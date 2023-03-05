import { LocalEventStatusColor } from '../../core/constants'
import Entity from '../../core/Entity'
import Helper from '../../core/Helper'

const NOW = Date.now()

export default class LocalEvent extends Entity {
  title = null

  description = null

  lng = null

  lat = null

  start = null

  end = null

  constructor(data) {
    super()
    this.hydrate(data)
    this.start = new Date(this.start)
    this.end = new Date(this.end)
  }

  getStatusColor() {
    const start = Math.ceil((this.start.getTime() - NOW) / 1000 / 3600 / 24)

    if (start > 3) {
      return LocalEventStatusColor.GREEN
    }

    if (start > 0) {
      return LocalEventStatusColor.ORANGE
    }

    return LocalEventStatusColor.RED
  }
}
