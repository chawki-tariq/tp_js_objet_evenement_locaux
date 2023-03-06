export default class Entity {
  id = null

  constructor() {
    // Générer un id si l'entity n'en possède pas
    if (!this.id) {
      this.id = crypto.randomUUID()
    }
  }

  /**
   * Hydrate les propriétés de l'entité actuelle
   * @param {Object} data
   */
  hydrate(data) {
    for (const property in data) {
      // Si l'entité possède la propriété
      if (this.hasOwnProperty(property)) {
        // Modification de la propriété
        Object.defineProperty(this, property, {
          value: data[property]
        })
      }
    }
  }

  /**
   * Jsonifie l'entité
   */
  toJson() {
    const json = {}
    for (const property in this) {
      json[property] = this[property]
    }
    return json
  }
}
