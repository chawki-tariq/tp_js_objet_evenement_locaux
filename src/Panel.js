import { FormFieldName } from "../core/constants"
import Form from "./Form"

export default class Panel {
  app = {}
  
  element = {}

  form = {}
 
  constructor(app) {
    this.app = app
    this.form = new Form()
  }

  start() {
    this.form.start()

    this.app.viewport.map.on('click', this.onMapClick.bind(this))

    this.render()
  }

  onMapClick(e) {
    this.form.element.elements.namedItem(FormFieldName.LAT).value = e.lngLat.lat
    this.form.element.elements.namedItem(FormFieldName.LNG).value = e.lngLat.lng
  }

  render() {
    this.element = document.createElement('aside')
    this.element.classList.add('panel')
    this.element.appendChild(this.form.element)
    this.app.element.appendChild(this.element)
  }
}