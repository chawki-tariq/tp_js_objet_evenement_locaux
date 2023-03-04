export default class Removable {
  removables = []

  add(removable) {
    this.removables.push(removable)
  }

  clear() {
    for (const removable of this.removables) {
      removable.remove()
    }
    this.removables = []
  }

  getAll() {
    return this.removables
  }
}