import GridPhysics from '../../plugin/gridPhysics/gridPhysics';
import GenericEnemy from '../sprites/generic_enemy';
import debugGUI from '../debugGUI';

class GameState extends Phaser.State {
    constructor(game) {
        super(game);
        this.game = game;
    }
    create() {
        let game = this.game;
        window.game = game;

        game.plugins.add(new GridPhysics(this.game));
        game.physics.gridPhysics.gridSize.set(8);
        this.debugGfx = game.physics.gridPhysics.debugGfx;
        this.physics = game.physics.gridPhysics;

        game.map = game.add.tilemap('map', 16, 16);
        let map = game.map;
        this.map = map; // wierd: game.map, map and this.map. FIX

        map.addTilesetImage('basictiles');
        let layer = map.createLayer("ground");
        layer = map.createLayer("onGround");
        game.physics.gridPhysics.enable(layer);

        for (let y = 0; y < layer.layer.data.length; y++) {
            for (let x = 0; x < layer.layer.data[y].length; x++) {
                let tile = layer.layer.data[y][x];
                if (tile.index === -1) {
                    continue;
                }
                for (let property of Object.keys(tile.properties)) {
                    if (tile.hasOwnProperty(property) || property.indexOf("blocked") === 0 ) {
                        if(property.indexOf("blocked")>-1){
                          console.log("blocked"+property);
                        }

                        tile[property] = tile.properties[property];
                    }
                }
                if (tile.properties.collide) {
                    for (let property of ["collideUp", "collideRight", "collideDown", "collideLeft"]) {
                        tile[property] = true;
                    }
                }
            }
        }
        layer.updateBlocked();


        layer.resizeWorld();

        for (let crateObj of this.map.objects.objects) {

            let anim = "box"
            if (crateObj.properties && crateObj.properties.box) {
                anim += crateObj.properties.box;
            }

            let crate = game.add.sprite(crateObj.x, crateObj.y - 16, 'sprites');
            crate.animations.add("box", [anim], 5, false);
            crate.play("box");
            if (crateObj.properties && crateObj.properties.scale) {
                crate.width = 16 * crateObj.properties.scale;
                crate.height = 16 * crateObj.properties.scale;
            } else {
                crate.width = 16;
                crate.height = 16;
            }

            crate.smoothed = false;
            game.physics.gridPhysics.enable(crate);
            crate.body.collideWorldBounds = true;

            if (crateObj.properties && crateObj.properties.mass) {
                crate.body.mass = crateObj.properties.mass;
            }
        }



        this.enemy = new GenericEnemy({
            game,
            x: 6 * 16,
            y: 0,
            family: "humanoid",
            id: "4-2"
        });
        this.enemy.body.strength = 1000;

        /*this.enemy2 = new GenericEnemy({
            game,
            x: 9*16,
            y: 4*16,
            family: "humanoid",
            id: "5-6"
        });
        this.enemy2.body.strength = 0;*/


        game.hero = game.add.sprite(320, 25 + 8, 'sprites');
        game.hero.animations.add("down", ["hero/hero-down-0", "hero/hero-down-1"], 5, true);
        game.hero.animations.add("right", ["hero/hero-right-0", "hero/hero-right-1"], 5, true);
        game.hero.animations.add("left", ["hero/hero-left-0", "hero/hero-left-1"], 5, true);
        game.hero.animations.add("up", ["hero/hero-up-0", "hero/hero-up-1"], 5, true);
        game.hero.animations.add("hit-down", ["hero/hero-hit-down-0", "hero/hero-hit-down-1", "hero/hero-hit-down-2", "hero/hero-hit-down-3"], 15, false);
        game.hero.animations.add("hit-right", ["hero/hero-hit-right-0", "hero/hero-hit-right-1", "hero/hero-hit-right-2", "hero/hero-hit-right-3"], 15, false);
        game.hero.animations.add("hit-left", ["hero/hero-hit-left-0", "hero/hero-hit-left-1", "hero/hero-hit-left-2", "hero/hero-hit-left-3"], 15, false);
        game.hero.animations.add("hit-up", ["hero/hero-hit-up-0", "hero/hero-hit-up-1", "hero/hero-hit-up-2", "hero/hero-hit-up-3"], 15, false);
        game.hero.play("down");
        game.physics.gridPhysics.enable(game.hero);
        game.hero.body.player = true;
        game.hero.body.baseVelocity = 75;
        game.hero.body.strength = 10;
        game.hero.body.maxCue = 10;
        game.hero.debugger = false;
        game.hero.body.collideWorldBounds = true;
        game.hero.body.immovable = true;

        game.marker = game.add.sprite(0, 0, 'sprites');
        game.marker.animations.add("blink", ["marker/blink1", "marker/blink2"], 5, true);
        game.marker.play("blink");

        this.cursors = game.input.keyboard.createCursorKeys();
        this.renderGrid = false;
        if (!this.debugGUI) {
            this.debugGUI = new debugGUI();
        }
        this.debugGUI.setupGUI(this);
        game.input.mouse.capture = true;
        this.physics.addToQue(this.enemy);
        //  this.physics.addToQue(this.enemy2);

        this.physics.addToQue(game.hero);
        this.physics.nextTurn();
        game.hero.body.turnSteps = game.hero.body.activeSteps + 1;
    }

    update() {
        let game = this.game;
        let hero = this.game.hero;


        if (!hero.body.myTurn && hero.body.physics.turnbased) {
            return;
        }
        game.hero.body.setVelocity(0, 0);

        if (hero.body.activeSteps >= hero.body.turnSteps) {
            hero.body.turnSteps = hero.body.activeSteps + 1;

            this.physics.nextTurn(hero.body);
        }

        game.marker.x = 8 * Math.round(game.input.activePointer.x / 8);
        game.marker.y = 8 * Math.round(game.input.activePointer.y / 8);

        let anim = "";
        switch (hero.body.facing) {
            case Phaser.UP:
                anim = "up";
                break;
            case Phaser.RIGHT:
                anim = "right";
                break;
            case Phaser.DOWN:
                anim = "down";
                break;
            case Phaser.LEFT:
                anim = "left";
                break;
        }

        if (hero.body.struggling) {
            anim = "hit-" + anim;
        }


        hero.play(anim);
        if (!hero.body.struggling && !hero.body.isMoving.any) {
            hero.animations.stop();
        }

        let vel = game.hero.body.baseVelocity;

        if (game.input.activePointer.isDown) {
            hero.body.moveToPixelXY(game.input.activePointer.x, game.input.activePointer.y, vel);
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            game.hero.body.setVelocity(-vel, 0);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            game.hero.body.setVelocity(vel, 0);
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            game.hero.body.setVelocity(0, -vel);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            game.hero.body.setVelocity(0, vel);
        }
    }


    render() {
        if (this.game.hero.debugger) {
            this.game.hero.body.renderDebugBody();
        }
    }


}



export default GameState;
