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
      style: 'mapbox://styles/mapbox/streets-v12',
      // center: [2.6, 42.6978],
      maxBounds: [[2.6, 42.6978], [2.6, 43.3]],
      minZoom: 9,
      maxZoom: 9,
      zoom: 7,
      doubleClickZoom: false,
      dragRotate: false
    })
    this.app = app
    this.element = document.createElement('div')
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
    this.app.localEventState.set((state) => state)
    this.map.resize()
  }

  #onStateChange({ detail }) {
    // Récupération des évenements depuis l'état
    const localEvents = this.app.localEventState.get()
    // On supprime les anciens markeurs
    this.#markers.clear()
    // Création d'un nouveau markeur
    // pour chaque évenement
    for (const data of localEvents) {
      const localEvent = new LocalEvent(data)
      const marker = this.#newMarker(localEvent)
      this.#markers.add(marker)
    }
  }

  #onMarkerMouseEnter(marker, localEvent) {
    // On met en surbrillance l'élement
    // dans le outliner qui correspond
    // ou markeur actuelle
    this.app.outliner.activeItem(localEvent)
    if (marker.getPopup().isOpen()) return
    // Création d'une popup lorsque
    // le markeur est survolé
    this.newHoverPopup(localEvent)
  }

  newHoverPopup(localEvent) {
    // Création de la popup
    this.#popups.add(
      this.map
        .newPopup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: '400px'
        })
        .setLngLat([localEvent.lng, localEvent.lat])
        .setHTML(this.#getPopupHTML(localEvent))
        .addTo(this.map)
    )
  }

  onMarkerMouseLeave(localEvent) {
    // On supprime toute les anciennes popups
    this.#popups.clear()
    // On désactive la surbrillance de l'élement
    // dans le outliner correspondant au markeur actuelle
    this.app.outliner.deactiveItem(localEvent)
  }

  #newMarker(localEvent) {
    // Création du marker
    const marker = this.map
      .newMarker({
        anchor: 'top',
        lng: localEvent.lng,
        lat: localEvent.lat,
        color: localEvent.getStatus().color
      })
      // On lui attache une popup
      .setPopup(this.#newPopup(localEvent))
    // Lorsque la souris survole l'élement du markeur
    marker.getElement().addEventListener('mouseenter', () => {
      this.#onMarkerMouseEnter(marker, localEvent)
    })
    // Lorsque la souris ne survole plus l'élement du markeur
    marker.getElement().addEventListener('mouseleave', () => {
      this.onMarkerMouseLeave(localEvent)
    })
    return marker
  }

  #newPopup(localEvent) {
    // Création de la popup
    const popup = this.map
      .newPopup({
        maxWidth: '400px'
      })
      .setHTML(this.#getPopupHTML(localEvent, true))
    // Supprimer tout les popups de survole
    // lorsque la popup actuelle est ouverte
    popup.on('open', () => this.#popups.clear())
    return popup
  }

  #getPopupHTML(localEvent, description = false) {
    const formatedStart = Helper.dateTimeFormat(localEvent.start)
    const formatedEnd = Helper.dateTimeFormat(localEvent.end)
    const color = localEvent.getStatus().color
    const message = localEvent.getStatus().message
    return `
<h2>${localEvent.title}</h2>
<p style="color: ${color}">${message}</p>
<p>${description ? localEvent.description : ''}</p>
</p>
  Du <time datatime="${localEvent.start}">${formatedStart}</time>
  ou <time datatime="${localEvent.end}">${formatedEnd}</time>
</p>
`
  }

  #render() {
    this.element.classList.add('viewport')
    this.element.appendChild(this.map.getContainer())
    this.app.element.appendChild(this.element)
  }
}
