import { EventLikeType } from '../core/constants'
import Helper from '../core/Helper'
import Map from '../core/Map'
import Removable from '../core/Removable'
import LocalEvent from './Entity/LocalEvent'

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
      const localEvent = new LocalEvent(data)
      const marker = this.#newMarker(localEvent)
      this.#markers.add(marker)
    }
  }

  #onMarkerMouseEnter(marker, localEvent) {
    if (marker.getPopup().isOpen()) return
    this.#popups.add(
      this.map
        .newPopup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: '400px'
        })
        .setLngLat(marker.getLngLat())
        .setHTML(this.#getHoverPopupHTML(localEvent))
        .addTo(this.map)
    )
  }

  #onMarkerMouseLeave() {
    this.#popups.clear()
  }

  #newMarker(localEvent) {
    const marker = this.map
      .newMarker({
        anchor: 'top',
        lng: localEvent.lng,
        lat: localEvent.lat,
        color: localEvent.getStatus().color
      })
      .setPopup(this.#newPopup(localEvent))
    marker.getElement().addEventListener('mouseenter', () => {
      this.#onMarkerMouseEnter(marker, localEvent)
    })
    marker.getElement().addEventListener('mouseleave', () => {
      this.#onMarkerMouseLeave()
    })
    return marker
  }

  #newPopup(localEvent) {
    const popup = this.map
      .newPopup({
        maxWidth: '400px'
      })
      .setHTML(this.#getClickPopupHTML(localEvent))
    popup.on('open', () => this.#popups.clear())
    return popup
  }

  #getClickPopupHTML(localEvent) {
    return `
<p style="color: ${localEvent.getStatus().color}">${
      localEvent.getStatus().message
    }</p>
<h2>${localEvent.title}</h2>
<p>${localEvent.description}</p>
</p>${this.#getPopupDatetimeHTML(localEvent)}</p>
`
  }

  #getHoverPopupHTML(localEvent) {
    return `
<p style="color: ${localEvent.getStatus().color}">${
      localEvent.getStatus().message
    }</p>
<h2>${localEvent.title}</h2>
</p>${this.#getPopupDatetimeHTML(localEvent)}</p>
`
  }

  #getPopupDatetimeHTML(localEvent) {
    return `
    Du <time datatime="${localEvent.start}">${Helper.dateTimeFormat(
      localEvent.start
    )}</time>
    ou <time datatime="${localEvent.end}">${Helper.dateTimeFormat(
      localEvent.end
    )}</time>
    `
  }

  #render() {
    this.element = document.createElement('div')
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
