export default class Validator {
  message = {
    empty: 'Ce champ est obligatoire',
    gps: 'Coordonnées géographiques incorrecte!'
  }

  errors = {}

  fields = {}

  filters = {}

  constructor(fields, filters) {
    this.fields = fields
    this.filters = filters

    this.validate()
  }

  validate() {
    for (const field in this.fields) {
      const fieldFitlers = this.filters[field]
      for (const filter of fieldFitlers) {
        /**
         * TODO: Logique de filtre
         */
      }
    }
  }

  empty(value) {
    return value ? '' : this.message['gps']
  }

  gps(coordinate) {
    return coordinate.match(/^\d*\.\d+$/) ? '' : this.message['gps']
  }
}
