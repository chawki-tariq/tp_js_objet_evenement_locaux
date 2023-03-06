export default class Storage {
  static set(key, value) {
    try {
      // Si tout c'est bien passé
      localStorage.setItem(key, JSON.stringify(value))
      return value
      // Sinon
    } catch (e) {
      return false
    }
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(key))
  }
}
