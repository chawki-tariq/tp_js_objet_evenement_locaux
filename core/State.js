import { EventLikeType } from './constants'

export default class State {
  #state = null

  constructor(initial) {
    this.#state = initial
  }

  set(state) {
    this.#state = state
    document.dispatchEvent(new CustomEvent(EventLikeType.STATE_CHANGE, {
      detail: this.#state
    }))
  }

  get() {
    return this.#state
  }
}