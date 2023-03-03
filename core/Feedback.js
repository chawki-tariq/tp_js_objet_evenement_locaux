export default class Feedback {
  #feedbacks = []

  #type = ''

  #className = ''

  constructor(options = {}) {
    const { type = 'span', className = 'invalid' } = options
    this.#type = type
    this.#className = className
  }

  add(message, adjacentElement = null) {
    this.#feedbacks.push(this.create(message, adjacentElement))
  }

  clear() {
    for (const feedback of this.#feedbacks) {
      feedback.remove()
    }
    this.#feedbacks = []
  }

  getAll() {
    return this.#feedbacks
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
