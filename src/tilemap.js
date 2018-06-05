class Tilemap {
    constructor() {
        this.tilemaps = []
        this.world = Phaser.Physics.GridPhysics.world;


    }

    collide(source, dx = 0, dy = 0, layers = this.world.tilemaplayers, slide = false) {
        let position, width, height, collideWorldBounds, returnTile, level;

        // Sort out variables to work with, either from a sprite with a body or just an object
        if (source.hasOwnProperty("body")) {
            position = {
                x: source.body.gridPosition.x,
                y: source.body.gridPosition.y
            };
            width = source.body.width;
            height = source.body.height;
            collideWorldBounds = source.body.collideWorldBounds;
            level = source.body.level;
        } else {
            position = {
                x: source.x,
                y: source.y
            };
            width = source.width ? source.width : 1;
            height = source.height ? source.height : 1;
            collideWorldBounds = source.hasOwnProperty("collideWorldBounds") ? source.collideWorldBounds : false;
            returnTile = true;
            level = source.level ? source.level : 0;
        }
        // Prevent goint outside the tilemap?
        if (collideWorldBounds &&
            (position.x + dx < 0 ||
                position.y + dy < 0 ||
                position.x + dx + width > (this.world.tilemaplayers[0].width / this.world.gridSize.x) ||
                position.y + dy + height > (this.world.tilemaplayers[0].height / this.world.gridSize.y))) {
            return true;
        }

        // Update the position to the attempted movement
        position.x += dx;
        position.y += dy;

        // Slim the body to prevent unnecessary collision checks (not that the physics are particulary demanding but anyway)
        if (dx !== 0) {
            if (dx > 0) {
                position.x += width - 1;
            }
            width = 1;
        } else if (dy !== 0) {
            if (dy > 0) {
                position.y += height - 1;
            }
            height = 1;
        }

        let tileRatio = {
            x: 2,
            y: 2
        }
        for (let x = position.x; x < position.x + width; x++) {
            for (let y = position.y; y < position.y + height; y++) {
                let collide = false;
                for (let layer of this.world.tilemaplayers) {
                    if(level > layer.level){
                        continue;
                    }
                    //let tile = this.world.map.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                    let collisionHeight = layer.layer.baseTileHeight;
                    let collisionWidth = layer.layer.baseTileHeight;

                    //layer.collisionWidth = 16;
                    //let tile = this.world.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                    //debugger;
             
                    let checkY = Math.floor(y * this.world.gridSize.y / collisionHeight);
                    let checkX;
                    if (checkY < 0 || checkY > layer.layer.data.length - 1) {
                        if (this.collideWorldBounds) {
                            return true;
                        } else {
                            continue;
                        }
                    } else {
                        checkX = Math.floor(x * this.world.gridSize.x / collisionWidth);
                        if (checkX < 0 || checkY > layer.layer.data[checkY].length - 1) {
                            if (this.collideWorldBounds) {
                                return true;
                            } else {
                                continue;
                            }
                        }
                    }

                    let tile = layer.layer.data[checkY][checkX];

                    if(tile.index === -1 && layer.level>0 && level>0){ // HACK
                        console.log(layer.level);
                        return true;
                    }

                    if (returnTile) {
                        console.log(tile, checkX, checkY);
                    }

                    if (tile === null || (tile.index === -1 && !tile.gotBorder)) { // No tile, or empty - OK
                        continue;
                    }

                    if (tile.collideRight && tile.collideLeft && tile.collideDown && tile.collideUp) { // tile collides whatever direction the body enter
                        collide = true;
                        break;
                    } else if (dx < 0 && tile.collideRight) { // moving left and the tile collides from the right
                        //console.log("Collide RIGHT", tile)
                        collide = true;
                        break;
                    } else if (dx > 0 && tile.collideLeft) {
                        //console.log("Collide KEFT", tile)
                        collide = true;
                        break;
                    }
                    if (dy < 0 && tile.collideDown) {
                        //console.log("Collide DOWN", tile)
                        collide = true;
                        break;
                    } else if (dy > 0 && tile.collideUp) {
                        //console.log("Collide UP", tile)
                        collide = true;
                        break;
                    }

                    // Prevents bodies to walk with path of body outside of blocked tile side
                    /* if (dx != 0) {
                         if (tile.borderUp && position.y < tile.y * tileRatio.y) {
                             collide = true;
                             break;
                         } else if (tile.borderDown && position.y + height > tile.y * tileRatio.y) {
                             collide = true;
                             break;
                         }
                     }
                     if (dy != 0) {
                         if (tile.borderLeft && position.x < tile.x * tileRatio.x) {
                             collide = true;
                             break;
                         } else if (tile.borderRight && position.x + width > tile.x * tileRatio.x) {
                             collide = true;
                             break;
                         }
                     }*/

                }
                if (collide) {
                    if (slide) { // Left-over from previous working version, needs review...
                        if (dx !== 0) {
                            if (!this.collide(source, dx, dy - 1)) {
                                return {
                                    dx,
                                    dy: dy - 1
                                };
                            } else if (!this.collide(source, dx, dy + 1)) {
                                return {
                                    dx,
                                    dy: dy + 1
                                };
                            }
                        }
                        if (dy !== 0) {
                            if (!this.collide(source, dx - 1, dy)) {
                                return {
                                    dx: dx - 1,
                                    dy
                                };
                            } else if (!this.collide(source, dx + 1, dy)) {
                                return {
                                    dx: dx + 1,
                                    dy
                                };
                            }
                        }
                    }
                    return {
                        dx: 0,
                        dy: 0
                    };
                }
            }
        }
        return false;
    }

    checkLevel(source, dx, dy) {
        let position, width, height;
        let level = 0;
        
        // DRY FAIL: Slightly modified copy from collision
        if (source.hasOwnProperty("body")) {
            position = {
                x: source.body.gridPosition.x,
                y: source.body.gridPosition.y
            };
            width = source.body.width;
            height = source.body.height;
        } else {
            position = {
                x: source.x,
                y: source.y
            };
            width = source.width ? source.width : 1;
            height = source.height ? source.height : 1;
        }

        position.x += dx;
        position.y += dy;

        if(dx!==0) {
            width = 1;
        }
        else {
            height = 1;
        }

        if(dx>0){
            position.x = position.x+width;
        }
        else if(dy>0){
            position.y = position.y+height;
        }

        // Return level a sprite move to, higher level is prioritized
        for (let x = position.x; x < position.x + width; x++) {
            for (let y = position.y; y < position.y + height; y++) {
                for (let layer of this.world.tilemaplayers) {
 
                   
                    let tile = layer.layer.data[Math.floor(y/2)][Math.floor(x/2)];

                    console.log(layer, layer.level, x ,y, tile)

                    if(tile && tile.index>0 && layer.level>level){
                        level = layer.level;
                    }
                }
            }
        }
        console.log("LEVEL", level);
        return level;


    }

}
export default Tilemap;