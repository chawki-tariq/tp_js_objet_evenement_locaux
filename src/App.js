import Panel from './Panel'
import Viewport from './Viewport'
import PersistState from '../core/PersistState'
import { PersistStateKey } from '../core/constants'

export default class App {
  viewport = {}

  panel = {}

  element = {}

  localEventState = {}

  constructor() {
    this.element = document.createElement('main')
    this.element.classList.add('app')
    this.viewport = new Viewport(this)
    this.panel = new Panel(this)
    this.localEventState = new PersistState(PersistStateKey.LOCAL_EVENT)
  }

  start() {
    this.viewport.start()
    this.panel.start()
    
    this.render()
  }

  render() {
    document.body.appendChild(this.element)
  }
}
