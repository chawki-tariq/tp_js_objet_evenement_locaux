import State from './State'
import Storage from './Storage'

export default class PersistState extends State {
  #key = null

  constructor(key, inital = null) {
    super(inital)
    this.#key = key
  }

  set(callback) {
    // On modifie le storage avant l'état
    const state = Storage.set(this.#key, callback(this.get()))
    if (state) {
      super.set(() => state)
    }
  }

  get() {
    // Renvoir la valeur du storage, sinon la valeur par défaut
    return Storage.get(this.#key) ?? super.get()
  }
}
