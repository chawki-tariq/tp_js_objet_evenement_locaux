export default class Helper {
  static #dateTimeFormat = new Intl.DateTimeFormat(process.env.LOCALE, {
    dateStyle: 'long',
    timeStyle: 'short'
  })

  static dateTimeFormat(datetime) {
    return Helper.#dateTimeFormat.format(datetime)
  }
}
