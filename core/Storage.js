export default class Storage {
  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    return value
  }

  get(key) {
    JSON.parse(localStorage.getItem(key))
  }
}