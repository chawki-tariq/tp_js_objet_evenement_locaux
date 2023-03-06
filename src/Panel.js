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
    this.form.element.elements.namedItem(FormFieldName.LAT).value = e.lngLat.lat
    this.form.element.elements.namedItem(FormFieldName.LNG).value = e.lngLat.lng
  }

  #onStateChange() {
    const formReset = this.form.element.querySelector('button[type="reset"]')
    const formSubmit = this.form.element.querySelector('button[type="submit"]')
    const editable = this.app.editable.get()
    const isEdit = Object.keys(editable).length
    if (!isEdit) {
      formReset.setAttribute('aria-hidden', true)
      formSubmit.innerText = 'Enregister'
      for (const field of this.form.element.elements) {
        field.value = ''
      }
      return
    }
    formReset.removeAttribute('aria-hidden')
    formSubmit.innerText = 'Modifier'
    for (const field of this.form.element.elements) {
      if (editable[field.name]?.constructor.name === 'Date') {
        field.value = editable[field.name].toISOString().slice(0,16);
      } else {
        field.value = editable[field.name]
      }
    }
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
