import mapboxgl from 'mapbox-gl'
import { EventLikeType } from '../core/constants'
import Map from '../core/Map'

export default class Viewport {
  map = {}

  app = {}

  constructor(app) {
    this.app = app
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
    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.onStateChange.bind(this)
    )

    this.#render()
  }

  onStateChange({ detail }) {
    const marker = new mapboxgl.Marker()
      .setLngLat({ lng: detail.lng, lat: detail.lat })
      .addTo(this.map)
  }

  #render() {
    this.element = document.createElement('div')
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
