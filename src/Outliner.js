import { EventLikeType } from '../core/constants'
import Removable from '../core/Removable'
import LocalEvent from './Entity/LocalEvent'

export default class Outliner {
  app = {}

  element = {}

  #removables = []

  constructor(app) {
    this.app = app
    this.element = document.createElement('aside')
    this.#removables = new Removable()
  }

  start() {
    this.app.localEventState.set(this.app.localEventState.get())

    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.#onStateChange.bind(this)
    )

    this.#render()
  }

  #onStateChange({ detail }) {
    this.#removables.clear()
    const fragment = document.createDocumentFragment()
    for (const data of detail.sort((a, b) => a.createdAt > b.createdAt )) {
      const localEvent = new LocalEvent(data)
      this.#removables.add(this.#newItem(localEvent))
      fragment.append(...this.#removables.getAll())
    }
    this.element.appendChild(fragment)
  }

  #onItemClick(e, localEvent) {
    e.stopPropagation()
    const action = e.target.dataset.action
    if (action === 'edit') {
    } else if (action === 'delete') {
      if (!confirm('Voulez-vous vraiment supprimer ?')) return
      this.app.localEventState.set(
        this.app.localEventState
          .get()
          .filter((state) => state.id !== localEvent.id)
      )
    } else {
      this.app.viewport.map.flyTo({
        center: [localEvent.lng, localEvent.lat]
      })
    }
  }

  #newItem(localEvent) {
    const item = document.createElement('div')
    item.classList.add('outliner-item')
    item.innerHTML = `
    <h2 class="outliner-item-title">${localEvent.title}</h2>
    <p class="">${localEvent.createdAt.toLocaleString('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short'
    })}</p>
    <div class="outliner-item-actions">
      <button class="btn btn-primary small" data-action="edit">Modifier</button>
      <button class="btn btn-danger small" data-action="delete">Supprimer</button>
    </div>
    `
    item.addEventListener('click', (e) => this.#onItemClick(e, localEvent))
    return item
  }

  #render() {
    this.element.classList.add('outliner')
    this.app.element.appendChild(this.element)
  }
}
