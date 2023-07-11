import { makeAutoObservable } from 'mobx'

export default class Entropy {
  secret = ''

  constructor() {
    makeAutoObservable(this)
  }

  setSecret(secret) {
    this.secret = secret
  }
}
