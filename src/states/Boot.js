import GameState from './Game';

class Preload extends Phaser.State {
    preload() {
        this.game.load.image('enemy', './assets/images/enemy.png');
        this.game.load.image('basictiles', './assets/images/basictiles.png');
        this.game.load.tilemap('map', './assets/maps/demo2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.atlas('sprites', 'assets/spriteatlas/sprites.png', 'assets/spriteatlas/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

    }
    create() {
        this.game.smoothed = false;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setMinMax(400, 240, 400 * 3, 240 * 3);
        this.game.load.onLoadComplete.add(this.loadComplete, this);
        this.loadComplete();

    }

    loadComplete() {
        this.state.start('Game');
    }
}

export default Preload;
