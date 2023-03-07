import { EventLikeType, LocalEventStatusColor } from '../core/constants'
import Removable from '../core/Removable'
import LocalEvent from './Entity/LocalEvent'

export default class Outliner {
  app = {}

  element = {}

  items = []

  constructor(app) {
    this.app = app
    this.element = document.createElement('aside')
    this.items = new Removable()
  }

  start() {
    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.#onStateChange.bind(this)
    )

    this.#render()
  }

  activeItem(localEvent) {
    this.items
      .getAll()
      .find((item) => item.dataset.id === localEvent.id)
      .classList.add('active')
  }

  deactiveItem(localEvent) {
    this.items
      .getAll()
      .find((item) => item.dataset.id === localEvent.id)
      .classList.remove('active')
  }

  #onStateChange() {
    this.#beforeRender()
    // Récupération des évenements qu'ont trie
    // pour afficher les plus fatidique en premier
    const localEvents = this.app.localEventState
      .get()
      .sort(
        (a) =>
          new LocalEvent(a).getStatus().color !== LocalEventStatusColor.ORANGE
      )
    // Suppression des anciens items
    this.items.clear()
    const fragment = document.createDocumentFragment()
    // Création d'un item pour chaque évenement
    for (const data of localEvents) {
      const localEvent = new LocalEvent(data)
      this.items.add(this.#newItem(localEvent))
    }
    // On ajoute au fragment tout les item
    fragment.append(...this.items.getAll())
    this.element.appendChild(fragment)
  }

  #onItemClick(e, localEvent) {
    e.stopPropagation()
    const action = e.target.dataset.action
    switch (action) {
      case 'edit':
        // if (Object.keys(this.app.editable.get()).length) return
        this.app.editable.set(() => localEvent)
        break
      case 'cancel':
        // Si on est pas déjà en mode édition ne rien faire
        if (!Object.keys(this.app.editable.get()).length) return
        this.app.editable.set(() => ({}))
        break
      case 'delete':
        // Si on est en mode édition ne rien faire
        if (Object.keys(this.app.editable.get()).length) return
        if (!confirm('Voulez-vous vraiment supprimer ?')) return
        this.app.localEventState.set((state) =>
          state.filter((e) => e.id !== localEvent.id)
        )
        break
      default:
        // Déplacer la caméra jusqu'au coordonnées géographique
        this.app.viewport.map.flyTo({
          center: [localEvent.lng, localEvent.lat]
        })
        break
    }
  }

  #newItem(localEvent) {
    const color = localEvent.getStatus().color
    const item = document.createElement('div')
    item.classList.add('outliner-item')
    item.dataset.id = localEvent.id
    let button =
      '<button class="btn btn-primary small" data-action="edit">Modifier</button>'
    // Si on est en mode édition et que l'évenement editer est le bon
    if (this.app.editable.get()?.id === localEvent.id) {
      button =
        '<button class="btn btn small" data-action="cancel">Annuler</button>'
    }
    item.innerHTML = `
    <div style="background-color: ${color}" class="outliner-item-status"></div>
    <h2 class="outliner-item-title">${localEvent.title}</h2>
    <div class="outliner-item-actions">
      ${button}
      <button class="btn btn-danger small" data-action="delete">Supprimer</button>
    </div>
    `
    item.addEventListener('click', (e) => this.#onItemClick(e, localEvent))
    item.addEventListener('mouseenter', (e) =>
      // Afficher la popup associé au marker correspondant à cette item
      this.app.viewport.newHoverPopup(localEvent)
    )
    item.addEventListener('mouseleave', (e) =>
      // Cacher la popup associé au marker correspondant à cette item
      this.app.viewport.onMarkerMouseLeave(localEvent)
    )
    return item
  }

  #beforeRender() {
    // Afficher le nombre d'évenement créer
    let title = `${this.app.localEventState.get().length} Evenement`
    // Si il n'y a aucun évenement
    if (!this.app.localEventState.get().length) {
      title = 'Aucun Evenement'
    }
    this.element.innerHTML = `
      <h1>${title}</h1>
    `
  }

  #render() {
    this.element.classList.add('outliner')
    this.app.element.appendChild(this.element)
  }
}
