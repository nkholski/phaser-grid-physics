class Tilemap {
    constructor() {
        this.tilemaps = []
        this.world = Phaser.Physics.GridPhysics.world;


    }

    collide(source, dx, dy, slide = false) {
        let position, width, height;
        if (source.hasOwnProperty("body")) {
            position = {
                x: source.body.gridPosition.x + dx,
                y: source.body.gridPosition.y + dy
            };
            width = source.body.width;
            height = source.body.height;
        } else {
            position = {
                x: source.x,
                y: soruce.y
            };
            width = source.width;
            height = source.height;
        }
        console.log(position, width, height, dx, dy);

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
                    //let tile = this.world.map.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                    layer.collisionHeight = 16;
                    layer.collisionWidth = 16;
                    //let tile = this.world.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                    //debugger;
                    let checkY = Math.floor(y * this.world.gridSize.y / layer.collisionHeight);
                    let checkX;
                    if (checkY < 0 || checkY > layer.layer.data.length - 1) {
                        if (this.collideWorldBounds) {
                            return true;
                        } else {
                            continue;
                        }
                    } else {
                        checkX = Math.floor(x * this.world.gridSize.x / layer.collisionWidth);
                        if (checkX < 0 || checkY > layer.layer.data[checkY].length - 1) {
                            if (this.collideWorldBounds) {
                                return true;
                            } else {
                                continue;
                            }
                        }
                    }

                    let tile = layer.layer.data[checkY][checkX];

                    if (tile === null || tile.index === -1) { // No tile, or empty - OK
                        continue;
                    }

                    if (tile.collideRight && tile.collideLeft && tile.collideDown && tile.collideUp) { // tile collides whatever direction the body enter
                        collide = true;
                        break;
                    } else if (dx < 0 && tile.collideRight) { // moving left and the tile collides from the right
                        console.log("Collide RIGHT", tile)
                        collide = true;
                        break;
                    } else if (dx > 0 && tile.collideLeft) {
                        console.log("Collide KEFT", tile)
                        collide = true;
                        break;
                    }
                    if (dy < 0 && tile.collideDown) {
                        console.log("Collide DOWN", tile)
                        collide = true;
                        break;
                    } else if (dy > 0 && tile.collideUp) {
                        console.log("Collide UP", tile)
                        collide = true;
                        break;
                    }

                    // Prevents bodies to walk with path of body outside of blocked tile side
                    if (dx != 0) {
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
                    }

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

}
export default Tilemap;