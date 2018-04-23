import "phaser";
import dat from 'dat.gui';
import debugGUI from './debugGUI';
import { ENOMEM } from "constants";
// States
import  Game  from './scenes/game';


//import GridPhysics from "./gridPhysics";s
let config = {
    type: Phaser.WEBGL,
    width: 25 * 16,
    height: 15 * 16,
    scene: [
        Game
    ],
    physics: {
        grid: {
            debug: true,
        }
    }
};

console.log(Game);

let game = new Phaser.Game(config);
