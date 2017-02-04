import Boot from './states/Boot'
import GameState from './states/Game'

window.EasyStar = require('easystarjs');

class Game extends Phaser.Game {
  constructor () {
    let width = document.documentElement.clientWidth > 400 ? 400 : document.documentElement.clientWidth
    let height = Math.round(0.6*width);
    super(width, height, Phaser.CANVAS, 'content', null, false, false)
    this.state.add('Boot', Boot, false)
    this.state.add('Game', GameState, false)
    this.state.start('Boot')
  }
}

window.game = new Game()
