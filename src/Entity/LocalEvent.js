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
    const day = Math.round((this.start.getTime() - now) / 1000 / 3600 / 24)

    if (now > this.start.getTime() && now >= this.end.getTime()) {
      return {
        color: LocalEventStatusColor.RED,
        message: 'Quel dommage! Vous avez raté cet événement!'
      }
    }

    if (day >= 0 && day <= 3) {
      const hours = this.start.getHours()
      let message = `Attention, commence ${Helper.relativeTimeFormat(day, 'day')}
      ${Helper.relativeTimeFormat(hours, 'hour')}`
      if (now >= this.start.getTime() && now < this.end.getTime()) {
        message = 'Evenement en cours'
      }
      return {
        color: LocalEventStatusColor.ORANGE,
        message
      }
    }

    return {
      color: LocalEventStatusColor.GREEN,
      message: ''
    }
  }
}
