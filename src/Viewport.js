import Map from '../core/Map'
import { EventLikeType, FormFieldName } from '../core/constants'
import LocalEvent from './Entity/LocalEvent'

export default class Viewport {
  map = {};

  app = {}

  constructor(app) {
    this.app = app
    this.map = new Map({
      container: document.createElement('div'),
      style: "https://demotiles.maplibre.org/style.json",
      center: [2, 47],
      zoom: 4,
      clickTolerance: 10,
      doubleClickZoom: false,
      dragRotate: false,
    });
  }

  start() {
    this.map.on('click', this.onMapClick.bind(this))
    this.app.panel.form.element.addEventListener(EventLikeType.FORM_VALIDATE, this.onFormValidate.bind(this))
    
    this.#render()
  }
  
  onMapClick(e) {
    const form = this.app.panel.form
    form.element.elements.namedItem(FormFieldName.LAT).value = e.lngLat.lat
    form.element.elements.namedItem(FormFieldName.LNG).value = e.lngLat.lng
  }

  onFormValidate({ detail }) {
    console.log(detail)
    // console.log(new LocalEvent(detail))
    new LocalEvent(detail)
  }

  #render() {
    this.element = document.createElement('div')
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
