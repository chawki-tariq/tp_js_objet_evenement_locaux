import { EventLikeType, FormFieldName } from '../core/constants'
import Form from './Form'

export default class Panel {
  app = {}

  element = {}

  form = {}

  constructor(app) {
    this.app = app
    this.form = new Form(this)
  }

  start() {
    this.form.start()

    document.addEventListener(
      EventLikeType.STATE_CHANGE,
      this.#onStateChange.bind(this)
    )

    this.app.viewport.map.on('click', this.onMapClick.bind(this))

    this.render()
  }

  onMapClick(e) {
    // On change la valeur des champs des coordonées géographique
    this.form.element.elements.namedItem(FormFieldName.LAT).value = e.lngLat.lat
    this.form.element.elements.namedItem(FormFieldName.LNG).value = e.lngLat.lng
  }

  #onStateChange() {
    const formReset = this.form.element.querySelector('button[type="reset"]')
    const formSubmit = this.form.element.querySelector('button[type="submit"]')
    const editable = this.app.editable.get()
    const isEdit = Object.keys(editable).length
    // Si on est pas en mode édition
    if (!isEdit) {
      formReset.setAttribute('aria-hidden', true)
      formSubmit.innerText = 'Enregister'
      for (const field of this.form.element.elements) {
        field.value = ''
      }
      return
    }
    // Si on est en mode édition
    formReset.removeAttribute('aria-hidden')
    formSubmit.innerText = 'Modifier'
    // On hydrate les champs du formulaire avec les bon valeur
    for (const field of this.form.element.elements) {
      // Si on est en présence d'un type date
      if (editable[field.name]?.constructor.name === 'Date') {
        field.value = editable[field.name].toISOString().slice(0,16);
        // Sinon tout les autres types
      } else {
        field.value = editable[field.name]
      }
    }
    // Lorsque le boutton annuler est cliqué
    // reinitialiser le formulaire
    formReset.addEventListener('click', () => {
      this.app.editable.set(() => ({}))
    })
  }

  render() {
    this.element = document.createElement('aside')
    this.element.classList.add('panel')
    this.element.appendChild(this.form.element)
    this.app.element.appendChild(this.element)
  }
}
