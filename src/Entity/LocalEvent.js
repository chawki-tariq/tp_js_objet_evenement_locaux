import { LocalEventStatusColor } from '../../core/constants'
import Entity from '../../core/Entity'
import Helper from '../../core/Helper'

export default class LocalEvent extends Entity {
  title = null

  description = null

  lng = null

  lat = null

  start = null

  end = null

  createdAt = new Date()

  constructor(data) {
    super()
    this.hydrate(data)
    this.start = new Date(this.start)
    this.end = new Date(this.end)
  }

  getStatus() {
    const now = Date.now()
    // Différence entre maintenant et la date de début de l'évenement
    const day = Math.round((this.start.getTime() - now) / 1000 / 3600 / 24)

    // Si les dates de l'évenement sont dans le passé
    if (now > this.start.getTime() && now >= this.end.getTime()) {
      return {
        color: LocalEventStatusColor.RED,
        message: 'Quel dommage! Vous avez raté cet événement!'
      }
    }

    // Si la différence est entre aujourd-hui est dans 3 jours
    if (day >= 0 && day <= 3) {
      const hours = this.start.getHours()
      return {
        color: LocalEventStatusColor.ORANGE,
        message: `Attention, commence ${Helper.relativeTimeFormat(
          day,
          'day'
        )} à ${hours}`
      }
    }

    return {
      color: LocalEventStatusColor.GREEN,
      message: ''
    }
  }
}
