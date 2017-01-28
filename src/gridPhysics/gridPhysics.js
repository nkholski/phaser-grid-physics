/*jshint esversion: 6 */

/**
 * A Sample Plugin demonstrating how to hook into the Phaser plugin system.
 * @class Phaser.Plugin.SamplePlugin
 */

import GridBody from './gridBody';
//import GridDebug from './gridDebug';

class GridPhysics extends Phaser.Plugin {
    constructor(game) {
        super(game);
        this.cnt = 0;

        // Size of Grid in pixels
        this.gridSize = new Phaser.Point(8);

        // Shadow size in pixels.
        this.shadowSize = 0;

        // Locked while pushed
        this.lockBodies = false;

        // Sprites and stuff with gridPhysics enabled
        this.bodies = [];

        // Collidable tilemap layers
        this.tilemaplayers = [];

        this._pushChain = [];

        //
        this.game.physics.gridPhysics = this;

        this.debugGfx = {
            graphics: null,
            update: true,
            grid: {
                active: false,
                wasActive: false,
                data: null
            },
            path: {
                active: false,
                wasActive: false,
                data: null
            },
            pathCollision: {
                active: false,
                wasActive: false
            },
            collision: {
                active: false,
                wasActive: false,
                data: null
            }
        };

        window.debugGfx = this.debugGfx;

        this.turnbased = false;
        this.turn = 0;
        this.que = [];


    }

    enable(entity) {
        switch (entity.type) {
            case Phaser.SPRITE:
                entity.body = new GridBody(entity);
                this.bodies.push(entity.body);
                break;
            case Phaser.TILEMAPLAYER:
                this.tilemaplayers.push(entity);
                break;
        }
    }


    addToQue(body, reload = 0) {
        if(!body.hasOwnProperty("myTurn") && body.hasOwnProperty("body")){
          body = body.body;
        }

        if (reload === 0) {
            reload = body.reload > 0 ? body.reload: 1;
        }
        // Gör kön tillräckligt lång
        if (this.que.length < reload * 2) {
            for (let s = 0; s < reload * 2; s++) {
                this.que.push(null);
            }
        }
        let pos = reload * 2;
        while (this.que[pos] != null) {
            pos++;
        }
        this.que.splice(pos, 0, body);
    }

    nextTurn(oldBody = null, reload = 0) {
        if (oldBody != null) {
            oldBody.myTurn = false;
            oldBody.turns++;
            this.turn++;
            this.addToQue(oldBody, reload);
        }

        let body = null;
        while (body === null && this.que.length>0) {
            body = this.que.shift(0);
        }
        if(body === null){
          console.error("EMPTY QUE!");
          return false;
        }
        body.myTurn = true;

    }

    update() {
        this.turnMade = false;
        for (let body of this.bodies) {
            let next = {
                x: body.sprite.x,
                y: body.sprite.y
            }
            for (let dim of ["x", "y"]) {
                if (body.velocity[dim] === 0) { // Stannat, fixa positionen exakt.
                    body.sprite[dim] = body.gridPosition[dim] * body.physics.gridSize[dim];
                    continue;
                }
                if (body.gridPosition[dim] * body.physics.gridSize[dim] != body.sprite[dim]) {
                    body.sprite[dim] += body.velocity[dim] * body.game.time.physicsElapsed;
                    next[dim] = body.sprite[dim] + body.velocity[dim] * body.game.time.physicsElapsed;
                }
                if (body.velocity[dim] > 0 && (next[dim] > body.gridPosition[dim] * body.physics.gridSize[dim])) { // Nästa steg är klart!
                    body.isLocked[dim] = false; // Kan sätta ny gridPosition och velocity!
                }
                if (body.velocity[dim] < 0 && (next[dim] < body.gridPosition[dim] * body.physics.gridSize[dim])) { // Nästa steg är klart!
                    body.isLocked[dim] = false; // Kan sätta ny gridPosition och velocity!
                }
                if(!body.isLocked.x && !body.isLocked.y && this.turnbased){
                  body.setVelocity(0);
                }

            }
        }
        if (this.debugGfx.update) {
            this.renderDebug();

        }
    }

    renderDebug() {
        let gfx = this.debugGfx;
        if (gfx.grid.active != gfx.grid.wasActive ||
            gfx.path.active != gfx.path.wasActive ||
            gfx.pathCollision.active != gfx.pathCollision.wasActive ||
            gfx.collision.active != gfx.collision.wasActive) {
            if (gfx.graphics) {
                gfx.graphics.clear();
            } else {
                gfx.graphics = game.add.graphics(0, 0);
            }

            if (gfx.grid.active) {
                this.renderGrid();
            }

            if (gfx.path.active) {
                this.renderPath();
            }

            if (gfx.pathCollision.active) {
                this.renderPathCollision();
            }

            if (gfx.collision.active) {
                this.renderCollision();
            }

            for (let type of ['grid', 'collision', 'path', 'pathCollision']) {
                gfx[type].wasActive = gfx[type].active;
            }


            if (gfx.grid.active || gfx.path.active || gfx.pathCollision.active || gfx.collision.active) {
                gfx.graphics.alpha = 1;
            } else {
                gfx.graphics.alpha = 0;
            }
        }
    }


    renderGrid() {
        let graphics = this.debugGfx.graphics;
        graphics.lineStyle(1, 0x000000, 0.2);
        for (let x = 0; x < (this.game.width / this.gridSize.x); x++) {
            graphics.moveTo(x * this.gridSize.x, 0);
            graphics.lineTo(x * this.gridSize.x, this.game.height);
        }
        for (let y = 0; y < (this.game.height / this.gridSize.y); y++) {
            graphics.moveTo(0, y * this.gridSize.y);
            graphics.lineTo(this.game.width, y * this.gridSize.y);
        }
    }

    renderCollision() {
        let graphics = this.debugGfx.graphics;
        graphics.lineStyle(0, 0x00FF00, 0.0);

        for (let layer of this.tilemaplayers) {
            for (let y in layer.layer.data) {
                for (let x in layer.layer.data[y]) {
                    let tile = layer.layer.data[y][x];
                    if (tile.collides) {
                        graphics.beginFill(0xFF0000, 0.5);
                        graphics.drawRect(x * tile.width + 1, y * tile.height + 1, tile.width - 2, tile.height - 2);
                        graphics.endFill();
                    }
                }
            }
        }
    }

    renderPathCollision(data) {
        if (data) {
            this.debugGfx.pathCollision.data = data;
            this.debugGfx.pathCollision.wasActive = false;
            return;
        }
        if (!this.debugGfx.pathCollision.data || this.debugGfx.pathCollision.data.length === 0) {
            return;
        }

        let graphics = this.debugGfx.graphics;
        let grid = this.debugGfx.pathCollision.data;

        for (let y = 0; y < grid.length; y++) {
            graphics.lineStyle(1, 0xFF0000, 0.3);
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x] != 0) {
                    if (grid[y][x] < 2) {
                        graphics.beginFill(0xFF3300, 0.4);
                    } else if (grid[y][x] == 4) {
                        graphics.beginFill(0x0000FF, 0.4);
                    } else {
                        graphics.beginFill(0xFF33FF, 0.4);

                    }
                    graphics.drawRect(x * this.gridSize.x, y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
                    graphics.endFill();
                }
            }
        }

    }

    renderPath(data) {
        if (data) {
            this.debugGfx.path.data = data;
            this.debugGfx.path.wasActive = false;
            return;
        }
        if (!this.debugGfx.path.data || this.debugGfx.path.data.length === 0) {
            return;
        }


        let graphics = this.debugGfx.graphics;
        let path = this.debugGfx.path.data;
        graphics.lineStyle(1, 0x00FF00, 0.5);
        for (let point of path) {
            graphics.beginFill(0x00FF00, 0.4);

            graphics.drawRect(point.x * this.gridSize.x, point.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);


        }
        let lastPoint = path[path.length - 1];
        graphics.beginFill(0xFF3300, 0.7);

        graphics.drawRect(lastPoint.x * this.gridSize.x, lastPoint.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
        graphics.endFill();


    }
}

export default GridPhysics;
