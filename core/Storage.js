export default class Storage {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return value
    } catch (e) {
      return false
    }
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(key))
  }
}
