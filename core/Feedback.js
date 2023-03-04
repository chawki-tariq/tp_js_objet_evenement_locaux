import Removable from "./Removable"

export default class Feedback extends Removable {
  #type = ''

  #className = ''

  constructor(options = {}) {
    super()
    const { type = 'span', className = 'invalid' } = options
    this.#type = type
    this.#className = className
  }

  add(message, adjacentElement = null) {
    super.add(this.create(message, adjacentElement))
  }

  create(message, adjacentElement) {
    const feedback = document.createElement(this.#type)
    feedback.classList.add(`${this.#className}-feedback`)
    feedback.innerText = message
    if (adjacentElement) {
      adjacentElement.insertAdjacentElement('afterend', feedback)
    }
    return feedback
  }
}
