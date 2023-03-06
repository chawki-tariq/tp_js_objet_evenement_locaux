import State from './State'
import Storage from './Storage'

export default class PersistState extends State {
  #key = null

  constructor(key, inital = null) {
    super(inital)
    this.#key = key
  }

  set(callback) {
    super.set(() => Storage.set(this.#key, callback(this.get())))
  }

  get() {
    return Storage.get(this.#key) ?? super.get()
  }
}
