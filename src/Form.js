import Feedback from '../core/Feedback'
import { EventLikeType, FormFieldName } from '../core/constants'

export default class Form {
  element = {}

  feedback = {}

  constructor() {
    this.element = document.createElement('form')
    this.element.setAttribute('validate', 'novalidate')
    this.feedback = new Feedback()
  }

  start() {
    this.element.addEventListener('submit', this.onSubmit.bind(this))

    this.#render()
  }

  onSubmit(e) {
    e.preventDefault()
    const data = new FormData(this.element)
    this.feedback.clear()
    for (const [key, value] of data.entries()) {
      if (value) continue
      const field = this.element.elements.namedItem(key)
      this.feedback.add('Ce champ est obligatoire', field)
    }
    if (!this.feedback.getAll().length) {
      this.element.dispatchEvent(
        new CustomEvent(EventLikeType.FORM_VALIDATE, {
          detail: Object.fromEntries(data.entries())
        })
      )
    }
  }

  #render() {
    let html = ``
    html += `<p>`
    html += `<label>Titre</label>`
    html += `<input type="text" name="${FormFieldName.TITLE}" id="${FormFieldName.TITLE}">`
    html += `</p>`
    html += `<div>`
    html += `<p>`
    html += `<label>Longitude</label>`
    html += `<input type="text" name="${FormFieldName.LNG}" id="${FormFieldName.LNG}">`
    html += `</p>`
    html += `<p>`
    html += `<label>Latitude</label>`
    html += `<input type="text" name="${FormFieldName.LAT}" id="${FormFieldName.LAT}">`
    html += `</p>`
    html += `</div>`
    html += `<p>`
    html += `<label>Description</label>`
    html += `<textarea name="${FormFieldName.DESCRIPTION}" id="${FormFieldName.DESCRIPTION}" cols="50" rows="10"></textarea>`
    html += `</p>`
    html += `<button class="btn btn-primary" type="submit">Enregister</button>`
    this.element.innerHTML = html
  }
}
