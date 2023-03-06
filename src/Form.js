import Feedback from '../core/Feedback'
import { EventLikeType, FormFieldName } from '../core/constants'

export default class Form {
  element = {}

  feedback = {}

  constructor() {
    this.element = document.createElement('form')
    this.element.setAttribute('novalidate', 'true')
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
      const field = this.element.elements.namedItem(key)

      // Si le champs est vide
      if (!value) {
        this.feedback.add('Ce champ est obligatoire!', field)
        continue
      }

      // Si le titre est trop long
      if (key === FormFieldName.TITLE && value.length > 100) {
        this.feedback.add('Doit contenir maximum 100 caractères', field)
        continue
      }

      // Si les coordonées sont incorrecte
      if (
        (key === FormFieldName.LNG && !value.match(/^-?\d*\.?\d+$/)) ||
        (key === FormFieldName.LAT && !value.match(/^-?\d*\.?\d+$/))
      ) {
        this.feedback.add('Coordonnées géographiques incorrecte!', field)
        continue
      }

      // Si la date de début est supérieur ou égale à la date de fin
      if (
        key === FormFieldName.START_DATETIME &&
        value >= data.get(FormFieldName.END_DATETIME)
      ) {
        this.feedback.add(
          'La date de début doit être inférieur à la date de fin!',
          field
        )
        continue
      }

      // Si la date de début est dans le passé
      if (
        key === FormFieldName.START_DATETIME &&
        new Date(value).getTime() < Date.now()
      ) {
        this.feedback.add(
          'La date de début doit être supérieur au moment présent!',
          field
        )
        continue
      }
    }

    // Si il n'y a eu aucune erreur
    if (!this.feedback.getAll().length) {
      this.element.dispatchEvent(
        new CustomEvent(EventLikeType.FORM_VALIDATED, {
          detail: Object.fromEntries(data.entries())
        })
      )

      this.element.reset()
    }
  }

  #render() {
    this.element.innerHTML = `
<p class="form-group">
  <label for="${FormFieldName.TITLE}">Titre</label>
  <input type="text" name="${FormFieldName.TITLE}" id="${FormFieldName.TITLE}">
</p>
<div class="g2 gap1">
<p class="form-group">
  <label for="${FormFieldName.LNG}">Longitude</label>
  <input type="number" name="${FormFieldName.LNG}" id="${FormFieldName.LNG}">
</p>
<p class="form-group">
  <label for="${FormFieldName.LAT}">Latitude</label>
  <input type="number" name="${FormFieldName.LAT}" id="${FormFieldName.LAT}">
</p>
</div>
<div class="g2 gap1">
  <p class="form-group">
  <label for="${FormFieldName.START_DATETIME}">Début</label>
  <input type="datetime-local" name="${FormFieldName.START_DATETIME}" id="${FormFieldName.START_DATETIME}">
  </p>
  <p class="form-group">
  <label for="${FormFieldName.END_DATETIME}">Fin</label>
  <input type="datetime-local" name="${FormFieldName.END_DATETIME}" id="${FormFieldName.END_DATETIME}">
  </p>
</div>
<p class="form-group">
  <label for="${FormFieldName.DESCRIPTION}">Description</label>
  <textarea name="${FormFieldName.DESCRIPTION}" id="${FormFieldName.DESCRIPTION}" cols="50" rows="10"></textarea>
</p>
<div class="g2 gap1">
<button class="btn btn-primary" type="submit">Enregister</button>
<button class="btn btn" type="reset" aria-hidden="true">Annuler</button>
</div>
`
  }
}
