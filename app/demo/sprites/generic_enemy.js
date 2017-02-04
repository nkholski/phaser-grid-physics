class GenericEnemy extends Phaser.Sprite {

  constructor ({ game, x, y, family, id }) {
    super(game, x, y, "sprites");
    this.animations.add("animation", [family+"/"+family+0+"-"+id, family+"/"+family+1+"-"+id], 5, true);
    this.game = game;
    this.exists = true;
    this.reset(x,y);
    this.play("animation");
    this.game.physics.gridPhysics.enable(this);
    this.body.immovable = true;
    this.body.collideWorldBounds = true;
    this.game.add.existing(this);
    this.turnSteps = this.body.activeSteps + 1;
  }

  update () {
    if(!this.body.myTurn && this.body.physics.turnbased){
      return;
    }
    if(this.turnSteps == 1){
      this.turnSteps = 0;
      this.body.physics.nextTurn(this.body);
    }
    if((this.body.velocity.x!==0 || this.body.velocity.y!==0) && Math.random()<0.1){
      return;
    }
    if(this.body.physics.turnbased){
      this.body.baseVelocity = 75;
    } else {
      this.body.baseVelocity = 20;
    }
    let velx=0, vely=0;
    switch(Math.round(Math.random()*3)){
      case 0:
        velx=this.body.baseVelocity;
        break;
      case 1:
        velx=-this.body.baseVelocity;
        break;
      case 2:
        vely=this.body.baseVelocity;
        break;
      case 3:
        vely=-this.body.baseVelocity;
        break;
    }
    this.body.setVelocity(velx, vely);
    if(this.body.physics.turnbased){
      this.turnSteps++;
    }
  }

}

export default GenericEnemy;
