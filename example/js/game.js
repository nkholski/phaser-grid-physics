import "phaser";
import dat from 'dat.gui';
import debugGUI from './debugGUI';
import { ENOMEM } from "constants";

//import GridPhysics from "./gridPhysics";

var config = {
    type: Phaser.WEBGL,
    width: 25 * 16,
    height: 15 * 16,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        grid: {
            debug: true,
        }
    }
};

var player, map, map2, tileset, layer1, layer2, layer3, map2layer, countdown, changed;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('basictiles', 'assets/images/basictiles.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/demo.json');
    this.load.atlas('sprites', 'assets/spriteatlas/sprites.png', 'assets/spriteatlas/sprites.json');
    console.log("1");
    this.load.plugin('GridPhysics', "GridPhysics.js");
    console.log("2");
}

var debugGraphics;

function create() {
    console.log(this);
    console.log("INSTALLING     ")
    this.sys.install('GridPhysics');


    var map = this.make.tilemap({
        key: 'map'
    });
    console.log(map.getLayerIndex);
    var tiles = map.addTilesetImage('basictiles', 'basictiles');
    var layer = map.createStaticLayer("ground", tiles, 0, 0);
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
    console.log(map.tilesets[0].tileProperties);


    layer.setCollisionByProperty({
        collide: true
    });

    console.log(layer)
    this.gridPhysics.world.enable(layer);


    console.log(map.getLayerIndex);





    this.player = this.add.sprite(0, 0);
    //this.player.originX = 0;
    //this.player.originY = 0;

    ["up", "right", "down", "left", "hit-up", "hit-right", "hit-down", "hit-left"].forEach(
        (key) => {
            console.log(this.anims.generateFrameNames("sprites", {
                prefix: 'hero/hero-' + key + '-',
                end: 1
            }));

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

    map.createStaticLayer("above", tiles, 0, 0);


    this.player.play("hero/right");

    player = this.player;
    this.gridPhysics.world.enable(this.player);
    this.player.body.immovable = true;
    this.player.body.baseVelocity = 50;
    console.log(this.player);

    this.player.body.strength = -1;
    this.player.body.collideWorldBounds = true;

    debugGraphics = this.add.graphics();
    console.log(this.map);

    this.enemies = [];
    let enemy = this.add.sprite(0, 48);
    enemy.originX = 0;
    enemy.originY = 0;
    enemy.tint = 0xFF00FF;
    enemy.play("hero/right");

    this.gridPhysics.world.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.body.immovable = true;

    this.enemies.push(enemy);
    enemy = this.add.sprite(48, 48 + 32);
    enemy.originX = 0;
    enemy.originY = 0;
    enemy.tint = 0xFF00FF;
    enemy.play("hero/right");
    this.gridPhysics.world.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.body.immovable = true;
    this.enemies.push(enemy);
    /*let num = 10;
    while(num--){
        let crate = this.add.sprite(Math.random()*320, Math.random()*160);
        crate.originX = 0;
        crate.originY = 0;
        crate.play("crate");
        this.gridPhysics.world.enable(crate);
    }*/

    // this.crate.body.setVelocity(0,0);

    //console.log(map.objects);
    console.log("!!!");
    for (let crateObj of map.objects[0].objects) {
        let anim = "box"
        if (crateObj.properties && crateObj.properties.box) {
            anim += crateObj.properties.box;
        }

        let crate = this.add.sprite(crateObj.x, crateObj.y - 16);
        crate.originX = 0;
        crate.originY = 0;
        //console.log(crateObj.properties.scale);
        //    crate.scale();
        //crate.animations.add("box", [anim], 5, false);
        crate.play("crate");
        if (crateObj.properties && crateObj.properties.scale) {
            crate.width = 16 * crateObj.properties.scale;
            crate.height = 16 * crateObj.properties.scale;
            crate.setScale(crateObj.properties.scale)
        } else {
            crate.width = 16;
            crate.height = 16;
        }

        //game.physics.gridPhysics.enable(crate);
        this.gridPhysics.world.enable(crate);
        crate.body.collideWorldBounds = false;

        if (crateObj.properties && crateObj.properties.mass) {
            crate.body.mass = crateObj.properties.mass;
        }
    }



    console.log(this.crate);
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
    console.log(map);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    window.player = this.player;
    console.log(layer);
    console.log("CUE", this.gridPhysics)

    this.gridPhysics.world.turnBased = true;
    this.gridPhysics.world.addToQue(player);
    this.gridPhysics.world.addToQue(this.enemies);
    console.log("CUE", this.gridPhysics)
}



function update(time, delta) {
    let vel = 50;
    let animDir = "";
    if (this.keys.up.isDown) {
        this.player.body.setVelocity(0, -vel);
        animDir = "up";
    } else if (this.keys.right.isDown) {
        this.player.body.setVelocity(vel, 0);
        animDir = "right";
    } else if (this.keys.down.isDown) {
        this.player.body.setVelocity(0, vel);
        animDir = "down";
    } else if (this.keys.left.isDown) {
        this.player.body.setVelocity(-vel, 0);
        animDir = "left";
    } else {
        this.player.body.setVelocity(0, 0);
    }
    let anim = "hero/" + animDir;
    if (anim !== this.player.anims.currentAnim.key) {
        this.player.play(anim);
    }

    this.enemies.forEach(enemy => {
        if(enemy.body.isMoving.any){
            return;
        }
        if(!enemy.steps){
            enemy.steps = Phaser.Math.Between(3,8)
            enemy.dir = Phaser.Math.Between(1,4)
        }
        if (enemy.dir < 3) {
            enemy.body.setVelocity(enemy.dir === 1 ? vel : -vel, 0);
        } else {
            enemy.body.setVelocity(0, enemy.dir === 3 ? vel : -vel);
        }
        enemy.steps--;
    });

    debug();
}

function debug() {
    return;
    debugGraphics.clear();
    var color = 0xffff00;
    var thickness = 2;
    var alpha = 1;

    debugGraphics.lineStyle(thickness, color, alpha);

    debugGraphics.strokeRect(player.body.gridPosition.x * 8, player.body.gridPosition.y * 8, 16, 16);

}