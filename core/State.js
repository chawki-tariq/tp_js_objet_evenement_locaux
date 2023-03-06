import { EventLikeType } from './constants'

export default class State {
  #state = null

  constructor(initial = null) {
    this.#state = initial
  }

  set(callback) {
    this.#state = callback(this.#state)
    document.dispatchEvent(new CustomEvent(EventLikeType.STATE_CHANGE, {
      detail: this.#state
    }))
  }

  get() {
    return this.#state
  }
}