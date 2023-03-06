export default class Helper {
  static #dateTimeFormat = new Intl.DateTimeFormat(process.env.LOCALE, {
    dateStyle: 'long',
    timeStyle: 'short'
  })

  static #relativeTimeFormat = new Intl.RelativeTimeFormat(process.env.LOCALE, {
    numeric: 'auto',
    style: 'long'
  })

  static dateTimeFormat(datetime) {
    return Helper.#dateTimeFormat.format(datetime)
  }

  static relativeTimeFormat(value, unit = 'quarter') {
    return Helper.#relativeTimeFormat.format(value, unit)
  }
}
