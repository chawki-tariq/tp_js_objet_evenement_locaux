import Form from "./Form"

export default class Panel {
  app = {}
  
  element = {}

  form = {}

  constructor(app) {
    this.app = app
    this.element = document.createElement('aside')
    this.element.classList.add('panel')
    this.form = new Form()
  }

  start() {
    this.form.start()

    this.render()
  }

  render() {
    this.element.appendChild(this.form.element)
    this.app.element.appendChild(this.element)
  }
}