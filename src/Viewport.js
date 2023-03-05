import { EventLikeType } from '../core/constants'
import Map from '../core/Map'
import Removable from '../core/Removable'

export default class Viewport {
  map = {}

  app = {}

  #markers = {}

  #popups = {}

  constructor(app) {
    this.map = new Map({
      container: document.createElement('div'),
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2, 47],
      zoom: 4,
      clickTolerance: 10,
      doubleClickZoom: false,
      dragRotate: false
    })
    this.app = app
    this.#markers = new Removable()
    this.#popups = new Removable()
  }

  start() {
    this.map.on('load', this.#onMapLoad.bind(this))

    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.#onStateChange.bind(this)
    )

    this.#render()
  }

  #onMapLoad() {
    this.app.localEventState.set(this.app.localEventState.get())
  }

  #onStateChange({ detail }) {
    this.#markers.clear()
    for (const data of detail) {
      const marker = this.#newMarker(data)
      this.#markers.add(marker)
    }
  }

  #onMarkerMouseEnter(marker, data) {
    if (marker.getPopup().isOpen()) return
    this.#popups.add(
      this.map
        .newPopup({
          closeButton: false,
          closeOnClick: false
        })
        .setLngLat(marker.getLngLat())
        .setHTML(`<h2>${data.title}</h2>`)
        .addTo(this.map)
    )
  }

  #onMarkerMouseLeave() {
    this.#popups.clear()
  }

  #newMarker(data) {
    const marker = this.map
      .newMarker({
        anchor: 'top',
        lng: data.lng,
        lat: data.lat
      })
      .setPopup(this.#newPopup(data))
    marker.getElement().addEventListener('mouseenter', () => {
      this.#onMarkerMouseEnter(marker, data)
    })
    marker.getElement().addEventListener('mouseleave', () => {
      this.#onMarkerMouseLeave()
    })
    return marker
  }

  #onPopupOpen(e) {
    this.#popups.clear()
  }

  #newPopup(data) {
    const popup = this.map
      .newPopup()
      .setHTML(`<h2>${data.title}</h2>` + `<p>${data.description}</p>`)
      popup.on('open', this.#onPopupOpen.bind(this))
    return popup
  }

  #render() {
    this.element = document.createElement('div')
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
