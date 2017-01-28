class debugGUI extends dat.GUI {
    constructor() {
        super();
        this.value = 0;
        this.listen = 0;

    }
    setupGUI(that) {

        this.heroFolder = this.addFolder('Hero');
        this.worldFolder = this.addFolder('World');
        this.debugFolder = this.addFolder('Debug');

        this.heroFolder.add(that.game.hero.body, 'strength', 0, 10).step(1).name('Strength');
        this.heroFolder.add(that.game.hero.body, 'strength', 0, 10).step(1).name('MaxCue');
        this.heroFolder.add(that.game.hero.body, 'struggle', 0, 10).step(1).name('Struggle');
        this.heroFolder.add(that.game.hero.body, 'baseVelocity', 1, 480).step(1).name('Velocity');
        this.heroFolder.add(that.game.hero, 'debugger').name('Debug body');
        this.heroFolder.add(that.game.hero.body, 'collidable').name('Collidable');
        this.heroFolder.add(that.game.hero.body, 'activeSteps').name('Steps').listen();
        this.heroFolder.open();
        this.debugFolder.add(that.debugGfx.grid, 'active').name('Grid');
        this.debugFolder.add(that.debugGfx.collision, 'active').name('Collision');
        this.debugFolder.add(that.debugGfx.path, 'active').name('Path');
        this.debugFolder.add(that.debugGfx.pathCollision, 'active').name('Path collision');

        //    this.worldFolder.add(that, 'renderGrid').name('Render grid');
        this.worldFolder.add(that.physics, 'turnbased').name('Turn based');
        this.worldFolder.open();
    }
}

export default debugGUI;
