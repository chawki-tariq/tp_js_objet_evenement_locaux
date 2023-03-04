import { EventLikeType } from '../core/constants'
import Map from '../core/Map'
import Removable from '../core/Removable'

export default class Viewport {
  map = {}

  app = {}

  markers = {}

  constructor(app) {
    this.app = app
    this.markers = new Removable()
    this.map = new Map({
      container: document.createElement('div'),
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2, 47],
      zoom: 4,
      clickTolerance: 10,
      doubleClickZoom: false,
      dragRotate: false
    })
  }

  start() {
    this.map.on('load', this.onMapLoad.bind(this))

    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.onStateChange.bind(this)
    )

    this.#render()
  }

  onMapLoad() {
    this.app.localEventState.set(this.app.localEventState.get([]))
  }

  onStateChange({ detail }) {
    this.markers.clear()
    for (const data of detail) {
      this.markers.add(this.map.newMarker({ lng: data.lng, lat: data.lat }))
    }
  }

  #render() {
    this.element = document.createElement('div')
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
