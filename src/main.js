/**
 * @author       Niklas Berg <nkholski@niklasberg.se>
 * @copyright    2018 Niklas Berg
 * @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
 */

//
// This plugin is based on Photonstorms Phaser 3 plugin template with added support for ES6.
// 

import World from './world';
import Tilemap from './tilemap';

class GridPhysics {
    constructor(scene) {
        Phaser.Physics.GridPhysics = this;
        //  The Scene that owns this plugin
        this.scene = scene;
        this.world = new World();
        this.tilemap = new Tilemap();
        scene.gridPhysics = this;
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted) {
            scene.sys.events.once('boot', this.boot, this);
        }
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {
        var eventEmitter = this.systems.events;
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    }

    postUpdate(time, delta){
        this.world.bodies.forEach((body) => {
            body.postUpdate();
        });

    }    


    update(time, delta) {
        this.world.update(time, delta);
    }
    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {}


    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }


};

//  Static function called by the PluginFile Loader.
GridPhysics.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.
    PluginManager.register('GridPhysics', GridPhysics, 'GridPhysics');
}

module.exports = GridPhysics;