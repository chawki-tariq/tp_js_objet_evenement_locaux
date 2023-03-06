import Removable from "./Removable"

/**
 * Réprésente des informations supprimable
 */
export default class Feedback extends Removable {
  #className = ''

  constructor(className = 'invalid') {
    super()
    this.#className = className
  }

  add(message, adjacentElement = null) {
    super.add(this.create(message, adjacentElement))
  }

  create(message, adjacentElement) {
    const feedback = document.createElement('span')
    feedback.classList.add(`${this.#className}-feedback`)
    feedback.innerText = message
    if (adjacentElement) {
      adjacentElement.insertAdjacentElement('afterend', feedback)
    }
    return feedback
  }
}
