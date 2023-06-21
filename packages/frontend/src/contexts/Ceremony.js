import EspecialClient from 'especial/client'
import { makeAutoObservable, makeObservable, observable } from 'mobx'
import randomf from 'randomf'

export default class Queue {
  connection = null
  client = null
  keepaliveTimer = null
  connected = false
  authToken = null
  userId = null
  ceremonyState = {}
  timeoutAt = null
  contributing = false
  contributionName = null
  contributionHashes = null
  loadingInitial = true
  inQueue = false
  queueEntry = null

  contributionUpdates = []
  transcript = []

  bootstrapData = null

  constructor(state, requestUrl) {
    makeAutoObservable(this)
    this.state = state
    if (typeof window !== 'undefined') {
      this.loadPromise = this.load()
    } else {
      this.loadPromise = this.loadSSR(requestUrl)
    }
  }

  get authenticated() {
    return !!this.authToken
  }

  get isActive() {
    return (
      this.ceremonyState?.activeContributor?.userId === this.userId &&
      !!this.userId
    )
  }

  get activeContributor() {
    return this.ceremonyState?.activeContributor?.userId ?? 'none'
  }

  get contributionText() {
    const hashText = Object.entries(this.contributionHashes ?? {})
      .map(([circuitName, hash]) => `${circuitName}: ${hash}`)
      .join('\n\n')
    return `I just contributed to the unirep dev trusted setup ceremony. You can too [here](https://dev.trusted-setup.unirep.io).
My circuit hashes are as follows:

${hashText}
    `
  }

  get queueNames() {
    return this.ceremonyState?.queueLengths.map(({ name }) => name) ?? []
  }

  get activeQueueEntry() {
    return this.ceremonyState?.activeContributor
  }

  get queueLength() {
    return this.ceremonyState?.queueLength
  }

  get circuitNames() {
    return this.ceremonyState?.circuitStats.map(({ name }) => name)
  }

  queueLengthByName(_name) {
    if (!this.ceremonyState) return 0
    const entry = this.ceremonyState.queueLengths.find(
      ({ name }) => name === _name
    )
    return entry?.count ?? 0
  }

  async loadSSR(requestUrl) {
    const url = new URL(requestUrl)
    const HTTP_SERVER = url.searchParams.get('s')
    if (!HTTP_SERVER.startsWith('http')) {
      this.HTTP_SERVER = `https://${HTTP_SERVER}`
    } else {
      this.HTTP_SERVER = HTTP_SERVER
    }
    await Promise.all([
      this.bootstrap(),
      this.loadTranscript(),
      this.loadStateHttp(),
    ])
    this.SSR_DATA = {
      bootstrapData: this.bootstrapData,
      ceremonyState: this.ceremonyState,
      // activeQueueEntry: this.activeQueueEntry,
      // circuitNames: this.circuitNames,
      // queueLength: this.queueLength,
      transcript: this.transcript,
    }
  }

  async load() {
    for (const key of Object.keys(window.CEREMONY_DATA ?? {})) {
      this[key] = (window.CEREMONY_DATA ?? {})[key]
    }
    const url = new URL(window.location)
    const HTTP_SERVER = url.searchParams.get('s')
    if (!HTTP_SERVER.startsWith('http')) {
      this.HTTP_SERVER = `https://${HTTP_SERVER}`
    } else {
      this.HTTP_SERVER = HTTP_SERVER
    }
    if (!this.bootstrapData) {
      await this.bootstrap()
    }
    await this.connect()
    this.authToken = localStorage.getItem('authToken')
    const hashText = localStorage.getItem('contributionHashes')
    if (hashText) {
      this.contributionHashes = JSON.parse(hashText)
    }
    // don't block here
    if (!this.transcript.length) {
      this.loadTranscript()
    }
    this.loadState().catch(console.log)
    if (!this.authenticated) await this.auth()
    const { data } = await this.client.send('user.info', {
      token: this.authToken,
    })
    this.inQueue = data.inQueue
    if (data.inQueue) {
      this.timeoutAt = data.timeoutAt
      this.queueEntry = data.queueEntry
      this.startKeepalive()
    } else if (url.searchParams.get('joinQueue')) {
      const name = url.searchParams.get('name')
      const queue = [...data.validQueues].pop()
      url.searchParams.delete('joinQueue')
      url.searchParams.delete('name')
      window.history.pushState({}, null, url.toString())
      await this.join(name, queue)
    }
    this.userId = data.userId
    if (data.active) {
      this.contribute()
    }
    this.loadingInitial = false
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('starting keepalive')
        this.startKeepalive()
      } else {
        // leave the queue if the page is minimized or tabbed out of
        console.log('stopping keepalive')
        this.stopKeepalive()
      }
    })
  }

  async bootstrap() {
    const url = new URL('/bootstrap', this.HTTP_SERVER)
    const r = await fetch(url.toString())
    if (!r.ok) {
      console.log('error bootstrapping')
      console.log(await r.json())
      return
    }
    const data = await r.json()
    this.bootstrapData = data
    const authOptions = data.authOptions.filter(
      ({ type }) => type === 'oauth' || type === 'none'
    )
    this.bootstrapData.authOptions = authOptions
  }

  async loadTranscript() {
    const url = new URL('/transcript', this.HTTP_SERVER)
    if (this.transcript.length) {
      url.searchParams.set('afterTimestamp', this.transcript[0].createdAt)
    }
    const data = await fetch(url.toString()).then((r) => r.json())
    const transcriptIds = this.transcript.reduce(
      (acc, obj) => ({
        ...acc,
        [obj._id]: true,
      }),
      {}
    )
    this.transcript = [
      data.filter(({ _id }) => !transcriptIds[_id]),
      this.transcript,
    ].flat()
  }

  async loadStateHttp() {
    const data = await fetch(
      new URL('/ceremony', this.HTTP_SERVER).toString()
    ).then((r) => r.json())
    this.ingestState(data)
  }

  async loadState() {
    const { data } = await this.client.send('ceremony.state')
    this.ingestState(data)
  }

  async oauth(name, path) {
    const url = new URL(path, this.HTTP_SERVER)
    url.searchParams.set('token', this.authToken)
    const currentUrl = new URL(window.location.href)
    const dest = new URL('/', currentUrl.origin)
    dest.searchParams.set('joinQueue', 'true')
    dest.searchParams.set('name', name)
    url.searchParams.set('redirectDestination', dest.toString())
    window.location.replace(url.toString())
  }

  async join(name, queueName) {
    this.contributionHashes = null
    this.contributionName = name.trim()
    // join the queue
    const { data: _data } = await this.client.send('ceremony.join', {
      token: this.authToken,
      queueName,
    })
    this.inQueue = true
    this.queuePosition = _data.queuePosition
    // start the keepalive
    this.startKeepalive()
    this.contributionUpdates = []
    await this.loadState()
    if (this.isActive) {
      this.contribute()
    }
  }

  updateContributionStatus(text) {
    this.contributionUpdates = [...this.contributionUpdates, text]
  }

  async contribute() {
    if (this.contributing) return
    this.contributing = true
    console.log('starting contribution')
    try {
      const snarkjs = await import('snarkjs')
      const { data } = await this.client.send('user.info', {
        token: this.authToken,
      })
      const downloadPromises = Object.entries(data.latestContributions).reduce(
        (acc, [circuitName, id]) => {
          this.updateContributionStatus(
            `Downloading ${circuitName} last contribution`
          )
          return {
            ...acc,
            [circuitName]: this.downloadContribution(circuitName, id),
          }
        },
        {}
      )
      const uploadPromises = []
      const contributionHashes = {}
      for (const [circuitName, id] of Object.entries(
        data.latestContributions
      )) {
        console.log(circuitName, id)
        const latest = await downloadPromises[circuitName]
        const out = { type: 'mem' }
        if (this.activeContributor !== this.userId) break
        this.updateContributionStatus(`Computing ${circuitName} contribution`)
        const hash = await snarkjs.zKey.contribute(
          latest,
          out,
          this.contributionName || 'anonymous contributor',
          Array(32)
            .fill(null)
            .map(() => randomf(2n ** 256n))
            .join('')
        )
        if (this.activeContributor !== this.userId) break
        this.updateContributionStatus(`Uploading ${circuitName} contribution`)
        uploadPromises.push(this.uploadContribution(out.data, circuitName))
        contributionHashes[circuitName] = formatHash(hash)
      }
      try {
        await Promise.all(uploadPromises)
        this.contributionHashes = contributionHashes
        window.localStorage.setItem(
          'contributionHashes',
          JSON.stringify(contributionHashes)
        )
      } catch (_err) {
        console.log(_err)
        console.log('Contribution upload failed')
        this.updateContributionStatus(
          `! One or more contributions failed to process !`
        )
      }
      this.stopKeepalive()
      this.timeoutAt = null
      this.contributing = false
      this.inQueue = false
    } catch (err) {
      console.log('Error making contribution')
      console.log(err)
      this.contributing = false
      this.inQueue = false
    }
  }

  async downloadContribution(circuitName, id) {
    const url = new URL(`/contribution/${id}`, this.HTTP_SERVER)
    url.searchParams.set('circuitName', circuitName)
    url.searchParams.set('token', this.authToken)
    const res = await fetch(url.toString())
    const data = await res.arrayBuffer()
    return new Uint8Array(data)
  }

  async uploadContribution(data, circuitName) {
    const url = new URL(`/contribution`, this.HTTP_SERVER)
    const formData = new FormData()
    formData.append('contribution', new Blob([data]))
    formData.append('token', this.authToken)
    formData.append('circuitName', circuitName)
    await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    })
  }

  async startKeepalive() {
    if (!this.connected) throw new Error('Not connected')
    const _keepaliveTimer = randomf(2n ** 256n).toString(16)
    this.keepaliveTimer = _keepaliveTimer
    if (!this.timeoutAt) {
      const { data } = await this.client.send('user.info', {
        token: this.authToken,
      })
      this.inQueue = data.inQueue
      if (!data.inQueue) {
        this.queueEntry = data.queueEntry
        console.log('Not in queue. Stopping keepalive')
        this.keepaliveTimer = null
        return
      }
      if (this.keepaliveTimer !== _keepaliveTimer) return
      this.timeoutAt = data.timeoutAt
    }
    const padding = 5000
    for (;;) {
      const nextPing = Math.max(0, +(this.timeoutAt - padding) - +new Date())
      if (this.keepaliveTimer !== _keepaliveTimer) return
      await new Promise((r) => setTimeout(r, nextPing))
      if (this.keepaliveTimer !== _keepaliveTimer) return
      console.log('sending keepalive')
      try {
        const { data } = await this.client.send('ceremony.keepalive', {
          token: this.authToken,
        })
        this.queuePosition = data.queuePosition
        this.timeoutAt = data.timeoutAt
      } catch (err) {
        console.log('Keepalive errored')
        console.log(err)
        this.keepaliveTimer = null
        this.timeoutAt = null
        this.inQueue = false
      }
    }
  }

  stopKeepalive() {
    this.timeoutAt = null
    this.keepaliveTimer = null
  }

  async auth() {
    const { data } = await this.client.send('user.register')
    localStorage.setItem('authToken', data.token)
    this.authToken = data.token
    this.userId = data.userId
  }

  async send(text) {
    const { publicSignals, proof } = await this.state.auth.proveAddressData(
      text
    )
    await this.client.send('create.message', {
      text,
      publicSignals,
      proof,
      channelName: this.activeChannel,
    })
  }

  ingestState(data) {
    this.ceremonyState = data
    // this.activeQueueEntry = data.activeContributor
    // this.queueLength = data.queueLength
    // this.circuitNames = data.circuitStats.map(({ name }) => name)
    if (this.isActive) this.contribute()
  }

  async connect() {
    if (this.connected) return console.log('Already connected')
    if (!this.bootstrapData?.WS_SERVER) throw new Error('No ws url loaded')
    try {
      const _client = new EspecialClient(this.bootstrapData?.WS_SERVER)
      makeObservable(_client, {
        connected: observable,
      })

      this.client = _client
      await _client.connect()
      this.connected = _client.connected
    } catch (err) {
      this.client = null
      return
    }
    this.client.addConnectedHandler(() => {
      this.connected = this.client.connected
    })
    // this.client.listen('msg', ({ data }) => this.ingestMessages(data))
    this.client.listen('ceremonyState', ({ data }) => {
      this.ingestState(data)
      if (this.transcript.length !== data.transcriptLength) {
        this.loadTranscript()
      }
    })
    this.client.listen('activeContributor', ({ data }) => {
      // this.activeQueueEntry = data.activeContributor
      // this.queueLength = data.queueLength
      if (this.isActive) this.contribute()
    })
  }
}

function formatHash(b) {
  if (!b) return null
  const a = new DataView(b.buffer, b.byteOffset, b.byteLength)
  let S = ''
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      S += a
        .getUint32(i * 16 + j * 4)
        .toString(16)
        .padStart(8, '0')
    }
  }
  return S
}
