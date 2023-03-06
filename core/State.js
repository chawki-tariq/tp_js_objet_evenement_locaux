import { EventLikeType } from './constants'

/**
 * Réprésente l'état de quelque chose
 */
export default class State {
  #state = null

  constructor(initial = null) {
    this.#state = initial
  }

  set(callback) {
    // Modification de l'état avec le nouveau
    this.#state = callback(this.#state)
    // On déclenche l'évenement de modification de l'état
    document.dispatchEvent(new CustomEvent(EventLikeType.STATE_CHANGE, {
      detail: this.#state
    }))
  }

  get() {
    return this.#state
  }
}