export default class Entity {
  id = null

  constructor() {
    if (!this.id) {
      this.id = crypto.randomUUID()
    }
  }

  hydrate(data) {
    for (const property in data) {
      if (this.hasOwnProperty(property)) {
        Object.defineProperty(this, property, {
          value: data[property]
        })
      }
    }
  }

  toJson() {
    const json = {}
    for (const property in this) {
      json[property] = this[property]
    }
    return json
  }
}
