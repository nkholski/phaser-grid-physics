//import "phaser";
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

let game = new Phaser.Game(config);
