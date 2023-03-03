export default class Entity {
  id = null

  constructor(data) {
    for (const property in data) {
      if (this.hasOwnProperty(property)) {
        console.log(property, data[property])
        Object.defineProperty(this, property, {
          value: data[property]
        })
      }
    }

    if (!this.id) {
      this.id = crypto.randomUUID()
    }
  }
}
