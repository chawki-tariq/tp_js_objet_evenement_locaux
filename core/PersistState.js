import { EventLikeType } from './constants'
import Storage from './Storage'

export default class PersistState {
  #key = null

  constructor(key, initial = null) {
    this.#key = key
    if (initial) {
      this.set(this.#key, initial)
    }
  }

  set(state) {
    document.dispatchEvent(
      new CustomEvent(EventLikeType.STATE_CHANGE, {
        detail: Storage.set(this.#key, state)
      })
    )
  }

  get() {
    return Storage.get(this.#key)
  }
}
