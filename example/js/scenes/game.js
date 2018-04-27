import "phaser";
import dat from 'dat.gui';
import debugGUI from '../debugGUI';
class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }
    preload() {
        this.load.image('basictiles', 'assets/images/basictiles.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/demo.json');
        this.load.atlas('sprites', 'assets/spriteatlas/sprites.png', 'assets/spriteatlas/sprites.json');
        this.load.plugin('GridPhysics', "GridPhysics.js");
    }
    create() {
        this.sys.install('GridPhysics');
        var map = this.make.tilemap({
            key: 'map'
        });
        var tiles = map.addTilesetImage('basictiles', 'basictiles');
        let layer = map.createStaticLayer("ground", tiles, 0, 0);
        layer = map.createStaticLayer("onGround", tiles, 0, 0);
        layer.layer.data.forEach(row => row.forEach(tile => {
            if (!map.tilesets[0].tileProperties.hasOwnProperty(tile.index - 1)) {
                return;
            }
            let p = map.tilesets[0].tileProperties[tile.index - 1];
            if (p.collide) {
                return;
            }
            tile.collideUp = p.collideUp ? true : false;
            tile.collideRight = p.collideRight ? true : false;
            tile.collideDown = p.collideDown ? true : false;
            tile.collideLeft = p.collideLeft ? true : false;
            tile.borderUp = p.borderUp ? true : false;
            tile.borderRight = p.borderRight ? true : false;
            tile.borderDown = p.borderDown ? true : false;
            tile.borderLeft = p.borderLeft ? true : false;
        }));
        layer.setCollisionByProperty({
            collide: true
        });
        this.gridPhysics.world.enable(layer);

        this.player = this.add.sprite(0, 0);
        this.velocity = 50;


        ["up", "right", "down", "left", "hit-up", "hit-right", "hit-down", "hit-left"].forEach(
            (key) => {

                this.anims.create({
                    key: 'hero/' + key,
                    frames: this.anims.generateFrameNames("sprites", {
                        prefix: 'hero/hero-' + key + '-',
                        end: 1
                    }),
                    frameRate: 5,
                    repeat: -1,
                    repeatDelay: 0
                });
            }
        );


        this.anims.create({
            key: 'crate',
            frames: [{
                key: "sprites",
                frame: "box"
            }],
            frameRate: 5,
            repeat: -1,
            repeatDelay: 0
        });

        //let layer2 = map.createStaticLayer("above", tiles, 0, 0);
        //layer2.setDepth(2);

    
        this.player.play("hero/right");

        this.gridPhysics.world.enable(this.player);
        /*this.player.body.gridPosition.x = 48;
        this.player.body.gridPosition.y = 14;*/
        this.player.body.gridPosition.x = 25;
        this.player.body.gridPosition.y = 16;
        this.player.body.immovable = true;
        this.player.body.baseVelocity = 50;

        this.player.body.strength = -1;
        this.player.body.collideWorldBounds = true;
        this.player.id = "player";
        this.debugGraphics = this.add.graphics();
        this.player.setDepth(1);

        this.enemies = [];
        let enemy = this.add.sprite(0, 48);
        enemy.originX = 0;
        enemy.originY = 0;
        enemy.tint = 0xFF00FF;
        enemy.id = "enemy1";
        enemy.play("hero/right");

        this.gridPhysics.world.enable(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.body.immovable = true;

        this.enemies.push(enemy);
        enemy = this.add.sprite(48, 48 + 32);
        enemy.id = "enemy2";
        enemy.originX = 0;
        enemy.originY = 0;
        enemy.tint = 0xFF00FF;
        enemy.play("hero/right");
        this.gridPhysics.world.enable(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.body.immovable = true;
        this.enemies.push(enemy);
        for (let crateObj of map.objects[0].objects) {

            if (crateObj.properties && crateObj.properties.level) {
                //layer.layer.data[crateObj.y/16][crateObj.x/16].level = true;
                this.gridPhysics.world.addStairs(crateObj);
            } else {

                let anim = "box"
                if (crateObj.properties && crateObj.properties.box) {
                    anim += crateObj.properties.box;
                }
                let crate = this.add.sprite(crateObj.x, crateObj.y - 16);
                crate.originX = 0;
                crate.originY = 0;
                crate.play("crate");
                if (crateObj.properties && crateObj.properties.scale) {
                    crate.width = 16 * crateObj.properties.scale;
                    crate.height = 16 * crateObj.properties.scale;
                    crate.setScale(crateObj.properties.scale)
                } else {
                    crate.width = 16;
                    crate.height = 16;
                }
                this.gridPhysics.world.enable(crate);
                crate.body.collideWorldBounds = true;
                if (crateObj.properties && crateObj.properties.mass) {
                    crate.body.mass = crateObj.properties.mass;
                }
            }
        }

        this.keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            x: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        };


          if (!this.debugGUI) {
            this.debugGUI = new debugGUI();
        }
        this.debugGUI.setupGUI(this)
    

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        window.player = this.player;

        this.gridPhysics.world.addToQue(player);
        this.gridPhysics.world.addToQue(this.enemies);

        //debugger;
   //     this.gridPhysics.world.turnbased = true;
    }

    update(time, delta) {

        //console.log(this.gridPhysics.world.firstInLine.id);
        if (this.gridPhysics.world.firstInLine.body.justMoved) {
            this.gridPhysics.world.nextTurn();
        }

        if (this.player.body.myTurn || !this.gridPhysics.world.turnbased) {

            let animDir = "";
            let madeAMove = false;
            if (this.keys.up.isDown) {
                this.player.body.setVelocity(0, -this.velocity);
                madeAMove = true;
                animDir = "up";
            } else if (this.keys.right.isDown) {
                this.player.body.setVelocity(this.velocity, 0);
                madeAMove = true;
                animDir = "right";
            } else if (this.keys.down.isDown) {
                this.player.body.setVelocity(0, this.velocity);
                madeAMove = true;
                animDir = "down";
            } else if (this.keys.left.isDown) {
                this.player.body.setVelocity(-this.velocity, 0);
                madeAMove = true;
                animDir = "left";
            } else {
                this.player.body.setVelocity(0, 0);
            }
            let anim = "hero/" + animDir;
            if (anim !== this.player.anims.currentAnim.key) {
                this.player.play(anim);
            }
            if (!this.gridPhysics.world.turnbased) {
                this.enemies.forEach(enemy => {
                    if ((enemy.body.activeSteps < enemy.steps) && enemy.body.isMoving.any) {
                        return;
                    }
                    enemy.steps = enemy.body.activeSteps + Phaser.Math.Between(1, 4)
                    enemy.dir = Phaser.Math.Between(1, 4)
                    if (enemy.dir < 3) {
                        enemy.body.setVelocity(enemy.dir === 1 ? this.velocity : -this.velocity, 0);
                    } else {
                        enemy.body.setVelocity(0, enemy.dir === 3 ? this.velocity : -this.velocity);
                    }
                });
            }
        } else {

            let enemy = this.gridPhysics.world.firstInLine;
            if ((enemy.body.activeSteps > enemy.steps) || !enemy.body.isMoving.any) {
                enemy.steps = enemy.body.activeSteps + Phaser.Math.Between(1, 4)
                enemy.dir = Phaser.Math.Between(1, 4);
            }
            if (enemy.dir < 3) {
                enemy.body.setVelocity(enemy.dir === 1 ? this.velocity : -this.velocity, 0);
            } else {
                enemy.body.setVelocity(0, enemy.dir === 3 ? this.velocity : -this.velocity);
            }

        }
        //this.debug();
    }
    debug() {
        this.debugGraphics.clear();
        var color = 0xffff00;
        var thickness = 2;
        var alpha = 1;

        this.debugGraphics.lineStyle(thickness, color, alpha);

        this.debugGraphics.strokeRect(player.body.gridPosition.x * 8, player.body.gridPosition.y * 8, 16, 16);
        //console.log(layer.getTileAt(player.body.gridPosition.x * 8,player.body.gridPosition.x * 8));

    }

}

export default Game;