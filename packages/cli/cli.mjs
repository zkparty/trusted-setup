#!/usr/bin/env node

import EspecialClient from 'especial/client.js'
import chalk from 'chalk'
import Ceremony from './ceremony.mjs'
import inquirer from 'inquirer'
import ora from 'ora'
import fetch from 'node-fetch'
import readline from 'readline'
import clipboard from 'clipboardy'
import open from 'open'

const [HTTP_SERVER] = process.argv.slice(2)

const ceremony = new Ceremony()
const { authOptions, welcomeMessage } = await ceremony.bootstrap(HTTP_SERVER)

console.log(welcomeMessage)

const { name, entropy, authType } = await inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Enter a public name for the contribution',
    default: 'anonymous cli contributor',
    // validate:
  },
  {
    type: 'input',
    name: 'entropy',
    message: 'Enter any extra random data (may be blank)',
  },
  {
    type: 'list',
    name: 'authType',
    message: 'How would you like to auth',
    choices: authOptions,
  },
])

console.log('Connecting to ceremony...')
await ceremony.connect()

console.log('Authenticating...')
await ceremony.auth()

let waitingForAuth = false
if (authType === 'github') {
  waitingForAuth = true
  {
    const url = new URL('/oauth/github/device', HTTP_SERVER)
    url.searchParams.append('token', ceremony.authToken)
    const data = await fetch(url.toString()).then((r) => r.json())

    clipboard.writeSync(data.userCode)
    console.log(
      `To auth with github enter this code: ${chalk.bold(
        data.userCode
      )} (copied to clipboard)`
    )
    console.log(`At the following url: ${chalk.bold(data.verificationUri)}`)

    console.log(`Press the ${chalk.bold('d')} key to open this url`)

    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY) process.stdin.setRawMode(true)
    process.stdin.on('keypress', (chunk, key) => {
      if (key && key.name == 'd' && waitingForAuth) {
        open(data.verificationUri)
      }
      if (key.ctrl && key.name == 'c') {
        process.exit(1)
      }
    })
  }

  const spinner = ora().start()
  spinner.text = 'Waiting for Github auth...'
  for (;;) {
    await new Promise((r) => setTimeout(r, 2000))
    const url = new URL('/oauth/github/list', HTTP_SERVER)
    url.searchParams.append('token', ceremony.authToken)
    const data = await fetch(url.toString()).then((r) => r.json())
    if (data.length) break
  }
  spinner.stop()

  waitingForAuth = false
  if (process.stdin.isTTY) process.stdin.setRawMode(false)
}

const { data } = await ceremony.client.send('user.info', {
  token: ceremony.authToken,
})
const queue = data.validQueues.pop()

console.log(`Joining queue ${chalk.bold(queue)}...`)
await ceremony.join(name, queue)

const spinner = ora().start()

for (;;) {
  if (ceremony.isActive) break
  // otherwise update our current queue position
  const { data } = await ceremony.client.send('user.info', {
    token: ceremony.authToken,
  })
  spinner.text = `You are number ${
    1 + data.queueEntry?.index - data.activeContributor?.index
  } in the queue`
  await new Promise((r) => setTimeout(r, 5000))
}

spinner.text = 'Starting contribution'
const hashes = await ceremony.contribute((v) => (spinner.text = v))

spinner.stop()

console.log('Thank you for contributing! Your hashes are below.')

console.log(hashes)

process.exit(0)
