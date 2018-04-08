
var config = {
    type: Phaser.WEBGL,
    width: 25*16,
    height: 15*16,
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

function preload ()
{
    this.load.image('basictiles', 'assets/images/basictiles.png');
    this.load.tilemapTiledJSON('map', 'assets/maps/demo.json');
    this.load.atlas('sprites', 'assets/spriteatlas/sprites.png', 'assets/spriteatlas/sprites.json');

    this.load.plugin('GridPhysics', GridPhysics);

}

var debugGraphics;

function create ()
{
    this.sys.install('GridPhysics');


    var map = this.make.tilemap({ key: 'map' });
    console.log(map.getLayerIndex);
    var tiles = map.addTilesetImage('basictiles', 'basictiles');
    var layer = map.createStaticLayer("ground", tiles, 0, 0);
    layer = map.createStaticLayer("onGround", tiles, 0, 0);
    layer.layer.data.forEach(row => row.forEach(tile =>{
        if(!map.tilesets[0].tileProperties.hasOwnProperty(tile.index-1)){
         return;
        }
        let p = map.tilesets[0].tileProperties[tile.index-1];
        if(p.collide){
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
        console.log(map.tilesets[0].tileProperties[tile.index]);
        console.log(tile);


    }));
    console.log(map.tilesets[0].tileProperties);
  

    layer.setCollisionByProperty({ collide: true });
    
    console.log(layer)
    this.gridPhysics.world.enable(layer);


    console.log(map.getLayerIndex);
    this.player = this.add.sprite(0, 0);
    this.player.originX = 0;
    this.player.originY = 0;

    ["up", "right", "down", "left", "hit-up", "hit-right", "hit-down", "hit-left"].forEach(
        (key) => { 
            console.log(this.anims.generateFrameNames("sprites", { prefix: 'hero/hero-'+key+'-', end: 1 }));

        this.anims.create(
            {
                key: 'hero/'+key,
                frames: this.anims.generateFrameNames("sprites", { prefix: 'hero/hero-'+key+'-', end: 1 }),
                frameRate: 5,
                repeat: -1,
                repeatDelay: 0
            }
        );
        }
    );


    this.anims.create(
        {
            key: 'crate',
            frames: [{key: "sprites", frame: "box"}],
            frameRate: 5,
            repeat: -1,
            repeatDelay: 0
        }
    );



    this.player.play("hero/right");
    
    player = this.player;
    this.gridPhysics.world.enable(this.player);
    this.player.body.strength = 112;
    this.player.body.collideWorldBounds = true;


    debugGraphics = this.add.graphics();

    /*let num = 10;
    while(num--){
        let crate = this.add.sprite(Math.random()*320, Math.random()*160);
        crate.originX = 0;
        crate.originY = 0;
        crate.play("crate");
        this.gridPhysics.world.enable(crate);
    }*/
    this.crate = this.add.sprite(64, 0);
    this.crate.originX = 0;
    this.crate.originY = 0;
    this.crate.play("crate");
    this.gridPhysics.world.enable(this.crate);
   // this.crate.body.setVelocity(0,0);

//console.log(map.objects);

   for (let crateObj of map.objects[0].objects) {
    console.log(crateObj);  
    let anim = "box"
    if (crateObj.properties && crateObj.properties.box) {
        anim += crateObj.properties.box;
    }

    let crate = this.add.sprite(crateObj.x, crateObj.y);
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
    //crate.body.collideWorldBounds = true;
    this.gridPhysics.world.enable(crate);

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
}



function update (time, delta)
{       
    let vel = 50;
    if(this.keys.up.isDown) {
        this.player.body.setVelocity(0,-vel);
    }
    else if(this.keys.right.isDown) {
        this.player.body.setVelocity(vel,0);
    }
    else if(this.keys.down.isDown) {
        this.player.body.setVelocity(0,vel);
    }
    else if(this.keys.left.isDown) {
        this.player.body.setVelocity(-vel,0);
    }
    else {
        this.player.body.setVelocity(0,0); 
    }

    debug();
}

function debug(){
    debugGraphics.clear();
    var color = 0xffff00;
    var thickness = 2;
    var alpha = 1;

    debugGraphics.lineStyle(thickness, color, alpha);

    debugGraphics.strokeRect(player.body.gridPosition.x*8,player.body.gridPosition.y*8, 16, 16);

}
