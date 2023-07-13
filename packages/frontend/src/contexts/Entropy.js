import { CURVE } from '@noble/bls12-381'
import { hkdf } from '@noble/hashes/hkdf'
import { sha256 } from '@noble/hashes/sha256'
import { randomBytes } from '@noble/hashes/utils'
import { makeAutoObservable } from 'mobx'

export default class Entropy {
  secret = ''

  constructor() {
    makeAutoObservable(this)
  }

  setSecret(secret) {
    this.secret = secret
  }

  generateEntropy(numberOfCircuits) {
    const generatedEntropyAsBytes = Uint8Array.from(
      this.secret.split('').map((x) => x.charCodeAt(0))
    )
    let secrets = []
    for (
      let i = 0, ni = generatedEntropyAsBytes.length;
      i < ni;
      i += numberOfCircuits
    ) {
      const entropyChunk = generatedEntropyAsBytes.slice(
        i,
        i + numberOfCircuits
      )
      const randomEntropyAsBytes = randomBytes(32)
      const entropyAsBytes = new Uint8Array(
        entropyChunk.length + randomEntropyAsBytes.length
      )
      entropyAsBytes.set(entropyChunk)
      entropyAsBytes.set(randomEntropyAsBytes, entropyChunk.length)
      /*
      In order to reduce modulo-bias in the entropy (w.r.t. the curve order):
      it is expanded out (and mixed) to at least 48 bytes before being reduced mod curve order.
      This exact technique is the RECOMMENDED means of obtaining a ~uniformly random F_r element according to
      the IRTF BLS signature specs: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature-05#section-2.3
      */
      const salt = randomBytes(32)
      const expandedEntropy = hkdf(sha256, entropyAsBytes, salt, '', 48)
      const hex96 = expandedEntropy.reduce(
        (str, byte) => str + byte.toString(16).padStart(2, '0'),
        ''
      )
      const expandedEntropyInt = BigInt('0x' + hex96)
      const secretInt = expandedEntropyInt % CURVE.r
      const secretHex = secretInt.toString(16).padStart(32, '0')
      secrets.push(secretHex)
    }
    return secrets
  }
}
