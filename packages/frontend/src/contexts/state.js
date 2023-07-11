import { createContext } from 'react'
import { configure } from 'mobx'
import Interface from './interface'
import Ceremony from './Ceremony'
import Entropy from './Entropy'
configure({
  enforceActions: 'never',
})

export const buildState = () => {
  const state = {}

  const ui = new Interface(state)
  const entropy = new Entropy(state)
  const ceremony = new Ceremony(state)

  Object.assign(state, {
    ui,
    entropy,
    ceremony,
  })
  return state
}

export default createContext(buildState())
