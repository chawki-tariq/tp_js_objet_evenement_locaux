export default class Outliner {
  app = {}

  element = {}

  constructor(app) {
    this.app = app
  }

  start() {
    this.#render()
  }

  #render() {
    this.element = document.createElement('aside')
    this.element.classList.add('outliner')
    this.app.element.appendChild(this.element)
  }
}