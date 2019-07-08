class GridBody {
  constructor(sprite) {
    /**
     * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
     */
    this.sprite = sprite;

    /**
     * @property {Phaser.Game} world - Local reference to the grid physics world.
     */
    this.world = Phaser.Physics.GridPhysics.world;

    this.tilemap = Phaser.Physics.GridPhysics.tilemap;

    this.solid = true;

    // UNDECIDED:
    /**
     * @property {boolean} enable - A disabled body won't be checked for any form of collision or overlap or have its pre/post updates run.
     * @default
     */
    //this.enable = true;

    // TODO:
    /**
     * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y this.gridPosition.
     */
    //  this.offset = new Phaser.Point();

    /**
     * @property {Phaser.Point} position - The position of the physics body.
     * @readonly
     */
    this.gridPosition = new Phaser.Geom.Point(0, 0);

    this.zIndex = 0;
    this.zHeight = 1;

    /**
     * @property {number} width - The calculated width of the physics body in grid units. Default match sprite size.
     * @readonly
     */
    this.width = Math.round(sprite.width / this.world.gridSize.x);

    /**
     * @property {number} height - The calculated height of the physics body in grid units. Default match sprite size.
     * @readonly
     */
    this.height = Math.round(sprite.height / this.world.gridSize.y);

    /**
     * @property {Phaser.Point} velocity - The velocity, or rate of change in speed of the Body. Measured in pixels per second.
     */
    this.velocity = new Phaser.Geom.Point(0, 0);

    /**
     * @property {Phaser.Point} _desiredVelocity - Velocity the entity strives to get.
     * @readonly
     */
    this._desiredVelocity = new Phaser.Geom.Point(0, 0);

    // TODO:
    /**
     * @property {Phaser.Point} _forcedVelocity - Velocity the entity is being pushed or otherwise forced.
     * @readonly
     */
    //this._forcedVelocity = new Phaser.Point();

    // TODO:
    /**
     * A Signal that is dispatched when this Body collides with another Body.
     */
    //this.onCollide = null;

    /**
     * @property {number} mass - The mass of the body. A body with strength => this.mass will be able to push this body.
     * @default
     */
    this.mass = 1;

    /**
     * @property {number} strength - Total mass that this body can move. -1 = unlimited
     * @default
     */
    this.strength = -1;

    /**
     * @property {number} pushLimit - Max number of objects that can be pushed, -1 = unlimited
     * @default
     */
    this.pushLimit = -1;

    /**
     * @property {number} struggle - Speed decrese ( velocity /= struggle * pushed mass), 0 = no decrese
     * NOTE: This will probably change to allow more flexible calculations (strugglePower = struggle.c + struggle.k * mass).
     * @default
     */
    this.struggle = 0;

    /**
     * @property {boolean} struggling - If the object is trying to move but not able, it will struggle :-)
     * @readonly
     */
    this.struggling = false;

    /**
     * @property {number} facing - A const reference to the direction the Body is traveling or facing.
     * @default
     */
    this.facing = Phaser.NONE;

    /**
     * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
     * @default
     */
    this.immovable = false;

    /**
     * @property {boolean} collidable - The body will check collision only if collidible is set to true.
     * @default
     */
    this.collidable = true;

    /**
     * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
     * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
     */
    this.collideWorldBounds = false;

    /**
     * @property {object} isMoving - Is populated with information if the body is actually moving.
     * @readonly
     */
    this.isMoving = {
      x: false,
      y: false,
      any: false
    };

    this.level = 0;

    // MAYBE:
    /**
     * @property {Phaser.Signal} onMoveComplete - Listen for the completion of `moveTo` or `moveFrom` events.
     */
    //this.onMoveComplete = new Phaser.Signal();

    this.moveTo = {
      active: false,
      path: [],
      next: null,
      recalc: 0 // 0 - never, 1 - if collision, 2 - each step (not impleneted yet)
    };

    this.magnetism = {
      dragItself: false, // If the body's weight is less than the object it's trying to pull and it's movable=true it will be pulled to the object instead of the opposite
      weakenByFactor: 1, //A power of 10 with weakenByFactor of 0.5 will have a power of 10*0.5 = 5 on one gridunit distance, and 10*0.5*0.5 = 2.5 on two.
      maxRange: 1, // Stop magnetism after this amount of squares regardless of power or weakenByFactor
      top: {
        active: false,
        power: 0, // 0 = Infinited, If dragged this magnetism could pull this mass without break seal.
        pole: null, // any pole-id (could be NORTH/SOUTH), null == any
        attractedTo: null, // any pole-id of other body
        attractedToAll: false // Like a black hole.
      },
      right: {
        active: false,
        power: 0,
        pole: null,
        attractedTo: null,
        attractedToAll: false
      },
      bottom: {
        active: false,
        power: 0,
        pole: null,
        attractedTo: null,
        attractedToAll: false
      },
      left: {
        active: false,
        power: 0,
        pole: null,
        attractedTo: null,
        attractedToAll: false
      }
    };

    this.cojoinedBodies = []; // Array of bodies

    this.collidingBodies = []; // [{active: Body, passive: Body}]
    this.collectCollidingBodies = true;

    /**
     * @property {Phaser.Point} shadow - The shadow reserves tiles this object moves from while animating a move to prevent overlaps from other sprites.
     * NOTE: Not yet entirely implemented
     * @readonly
     */
    this._shadow = new Phaser.Geom.Point(0, 0);

    /**
     * @property {object} isLocked - Used to prevent body from doing new moves before the last is finished.
     * NOTE: Not yet entirely implemented: May allow to turn in same direction and other stuff to make responsive.
     * @readonly
     */
    this.isLocked = {
      x: false,
      y: false,
      any: false
    };

    // MAY BE REMOVED:
    this._longPress = 0; // 0 - X, 1-Y (längsta nedtryckt)

    /**
     * @property {Number} activeSteps - Number of steps the body has taken.
     * NOTE: Not yet entirely implemented
     * @readonly
     */
    this.activeSteps = 0;

    /**
     * @property {Number} passiveSteps - Number of steps the body has been forced to take (being pushed).
     * NOTE: Not yet entirely implemented
     * @readonly
     */
    this.passiveSteps = 0;

    this.myTurn = false;
    this.turns = 0;
    this.reload = 1;

    this.onStairs = false;

    this.sprite.setOrigin(0, 0);

    this.snapToGrid();
  }

  snapToGrid() {
    this.gridPosition = {
      x: Math.round(this.sprite.x / this.world.gridSize.x),
      y: Math.round(this.sprite.y / this.world.gridSize.y)
    };
    this.sprite.x = this.world.gridSize.x * this.gridPosition.x;
    this.sprite.y = this.world.gridSize.y * this.gridPosition.y;
  }

  setPosition(x = 0, y = 0) {
    this.gridPosition.x = x;
    this.gridPosition.y = y;
    this.sprite.x = this.world.gridSize.x * this.gridPosition.x;
    this.sprite.y = this.world.gridSize.y * this.gridPosition.y;
    this.isLocked.x = false;
    this.isLocked.y = false;
  }

  setVelocity(x, y = null) {
    // longpress is not yet implemented
    y = y !== null ? y : x;

    if (x === 0 && y !== 0) {
      this._longpress = 1;
    } else if (y === 0 && x !== 0) {
      this._longpress = 0;
    }
    this._desiredVelocity = {
      x,
      y
    };
  }

  _intersectRect(r1, r2) {
    return !(
      r2.x >= r1.x + r1.width ||
      r2.x + r2.width <= r1.x ||
      r2.y >= r1.y + r1.height ||
      r2.y + r2.height <= r1.y
    );
  }

  testMove(dx, dy) {
    let freeToGo = true;

    if (!this.collidable) {
      return true;
    }

    if (this.onStairs) {
      this.level = this.tilemap.checkLevel(this.sprite, dx, dy);
    }

    if (this.tilemap.collide(this.sprite, dx, dy) && this.solid) {
      return false;
    }

    if (!this.collectCollidingBodies && !freeToGo) {
      return false;
    }

    // Kolla först tilemap för det kan bli krock direkt!
    for (let body of this.world.bodies) {
      if (
        this !== body &&
        body.collidable &&
        (body.level === this.level || body.onStairs)
      ) {
        // If not able to move and neither body is collecting colliding bodies, skip further checks
        if (
          !freeToGo &&
          !this.collectCollidingBodies &&
          !body.collectCollidingBodies
        ) {
          continue;
        }

        if (
          this._intersectRect(
            {
              x: this.gridPosition.x + dx,
              y: this.gridPosition.y + dy,
              width: this.width,
              height: this.height
            },
            {
              x: body.gridPosition.x,
              y: body.gridPosition.y,
              width: body.width,
              height: body.height
            }
          )
        ) {
          // Collect bodies if needed
          if (
            this.collectCollidingBodies &&
            this.collidingBodies.indexOf(body) === -1
          ) {
            this.collidingBodies.push(body);
          }
          if (
            body.collectCollidingBodies &&
            body.collidingBodies.indexOf(this) === -1
          ) {
            body.collidingBodies.push(this);
          }

          // Check how the other body might affect this one
          if (!this.solid || !body.solid) {
            continue;
          }

          if (body.immovable) {
            freeToGo = false;
          } else {
            if (this.world._pushChain.indexOf(body) === -1) {
              this.world._pushChain.push(body); // Tryck på denna
              if (!body.testMove(dx, dy)) {
                // kolla upp kroppen
                freeToGo = false;
              }
            }
          }
        }
      }
    }
    return freeToGo;
  }

  postUpdate() {
    this.collidingBodies = [];
    this.justMoved = false;
    if (this.isLocked.x || this.isLocked.y) {
      return;
    }

    if (this.moveTo.active) {
      this._desiredVelocity = {
        x: 0,
        y: 0
      };
      let dest = this.moveTo.path[this.moveTo.next];
      if (dest.x < this.gridPosition.x) {
        this._desiredVelocity.x = -100;
      } else if (dest.x > this.gridPosition.x) {
        this._desiredVelocity.x = 100;
      } else if (dest.y < this.gridPosition.y) {
        this._desiredVelocity.y = -100;
      } else if (dest.y > this.gridPosition.y) {
        this._desiredVelocity.y = 100;
      }
      this.moveTo.next++;
      if (this.moveTo.next > this.moveTo.path.length - 1) {
        this.moveTo.active = false;
      }
    }

    this.isMoving = {
      x: false,
      y: false,
      any: false
    };

    if (this._desiredVelocity.x === 0 && this._desiredVelocity.y === 0) {
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.struggling = false;
      return;
    }

    this.world._pushChain = [];
    let moveOk = true;
    let _d = {};
    for (let dim of ["x", "y"]) {
      _d[dim] =
        this._desiredVelocity[dim] === 0
          ? 0
          : this._desiredVelocity[dim] > 0
          ? 1
          : -1;
    }

    for (let dim of [0, 1]) {
      // Array här ändrar ordning efter prio
      if (dim === 0) {
        if (_d.x === 0) {
          continue;
        }
        if (!this.testMove(_d.x, 0)) {
          moveOk = false;
          break;
        } else {
          moveOk = true;
        }
      } else {
        if (_d.y === 0) {
          continue;
        }
        if (!this.testMove(0, _d.y)) {
          moveOk = false;
          break;
        } else {
          moveOk = true;
        }
      }
    }

    // Check if strong enough
    if (this.strength > -1 || this.struggle > 1) {
      let totalMass = 0;
      for (let body of this.world._pushChain) {
        totalMass += body.mass;
      }
      if (this.strength > -1 && totalMass > this.strength) {
        moveOk = false;
      }
      if (this.struggle > 1 && totalMass > 0) {
        this._desiredVelocity.x =
          this._desiredVelocity.x / (totalMass * this.struggle);
        this._desiredVelocity.y =
          this._desiredVelocity.y / (totalMass * this.struggle);
      }
    }
    if (this.pushLimit > -1 && this.world._pushChain.length > this.pushLimit) {
      moveOk = false;
    }

    if (!moveOk) {
      if (this._desiredVelocity.x !== 0 || this._desiredVelocity.y !== 0) {
        this.struggling = true;
      }
      if (this._desiredVelocity.x > 0) {
        this.facing = Phaser.RIGHT;
      } else if (this._desiredVelocity.x < 0) {
        this.facing = Phaser.LEFT;
      } else if (this._desiredVelocity.y < 0) {
        this.facing = Phaser.UP;
      } else if (this._desiredVelocity.y > 0) {
        this.facing = Phaser.DOWN;
      }
      this.velocity.x = 0;
      this.velocity.y = 0;
      this._shadow.x = 0;
      this._shadow.y = 0;

      return;
    }

    for (let dim of ["x", "y"]) {
      this.velocity[dim] = this._desiredVelocity[dim];
      this._shadow[dim] = 0;
      if (this.velocity[dim] != 0) {
        this.gridPosition[dim] += this.velocity[dim] > 0 ? 1 : -1;
        this.isLocked[dim] = true;
        this._shadow[dim] = this.velocity[dim] < 0 ? 1 : -1;

        for (let body of this.world._pushChain) {
          body.passiveSteps++;
          body.snapToGrid();
          body.velocity[dim] = this._desiredVelocity[dim];
          body.gridPosition[dim] += body.velocity[dim] > 0 ? 1 : -1;
          body.isLocked[dim] = true;
          body.onStairs = this.checkStairs(body);
        }
      }
    }

    if (this.velocity.x > 0) {
      this.facing = Phaser.RIGHT;
    } else if (this.velocity.x < 0) {
      this.facing = Phaser.LEFT;
    } else if (this.velocity.y < 0) {
      this.facing = Phaser.UP;
    } else if (this.velocity.y > 0) {
      this.facing = Phaser.DOWN;
    }

    if (this.velocity.x !== 0) {
      this.isMoving.x = true;
    }
    if (this.velocity.y !== 0) {
      this.isMoving.y = true;
    }
    this.isMoving.any = true;
    this.struggling = false;

    this.baseVelocity = 75;
    this.activeSteps++;
    this.justMoved = true;

    let wasOnStairs = this.onStairs;

    this.onStairs = this.checkStairs(this);

    if (wasOnStairs && !this.onStairs) {
      // HACK
      if (this.level === 1) {
        this.sprite.setDepth(11);
      } else {
        this.sprite.setDepth(1);
      }
    }
  }

  checkStairs(body) {
    let pos = body.gridPosition;
    for (let stairs of this.world.stairs) {
      if (
        pos.x < stairs.x + stairs.width &&
        pos.x + body.width > stairs.x &&
        pos.y < stairs.y + stairs.height &&
        body.height + pos.y > stairs.y
      ) {
        body.sprite.setDepth(1000);
        return true;
      }
    }
    return false;
  }

  /**
   * Draws this Body's boundary and velocity, if enabled.
   *
   * @method Phaser.Physics.Arcade.Body#drawDebug
   * @since 3.0.0
   *
   * @param {Phaser.GameObjects.Graphics} graphic - The Graphics object to draw on.
   */

  drawDebug(graphic) {
    let x = this.gridPosition.x * this.world.gridSize.x;
    let y = this.gridPosition.y * this.world.gridSize.y;
    let w = this.width * this.world.gridSize.x;
    let h = this.height * this.world.gridSize.y;

    if (true || this.debugShowBody) {
      graphic.lineStyle(1, "0xFFFFFF"); //this.debugBodyColor

      graphic.strokeRect(x, y, w, h);
    }
    /*if (this.debugShowVelocity)
        {
            graphic.lineStyle(1, this.world.defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2);
        }*/
  }

  /*renderDebugBody() {
         if (!this.debugBody) {
             this.debugBody = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
             this.debugShadow = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
         }

         this.debugBody.x = this.gridPosition.x * this.world.gridSize.x;
         this.debugBody.y = this.gridPosition.y * this.world.gridSize.y;
         this.debugShadow.x = this.gridPosition.x * this.world.gridSize.x + this.world.gridSize.x * this._shadow.x;
         this.debugShadow.y = this.gridPosition.y * this.world.gridSize.y + this.world.gridSize.y * this._shadow.y;
         if (this._shadow.x == 0) {
             this.debugShadow.width = this.sprite.width;
             this.debugShadow.height = this.world.gridSize.y;
         } else {
             this.debugShadow.width = this.world.gridSize.x;
             this.debugShadow.height = this.sprite.height;

         }
         game.debug.geom(this.debugBody, 'rgba(0,255,0,0.4)');
     }*/

  /*renderBodyInfo(debug, body) {
         debug.line('x: ' + body.gridPosition.x, 'y: ' + body.gridPosition.y, 'width: ' + body.width, 'height: ' + body.height);
         /*debug.line('x: ' + body.x.toFixed(2), 'y: ' + body.y.toFixed(2), 'width: ' + body.width, 'height: ' + body.height);
         debug.line('velocity x: ' + body.velocity.x.toFixed(2), 'y: ' + body.velocity.y.toFixed(2), 'deltaX: ' + body._dx.toFixed(2), 'deltaY: ' + body._dy.toFixed(2));
         debug.line('acceleration x: ' + body.acceleration.x.toFixed(2), 'y: ' + body.acceleration.y.toFixed(2), 'speed: ' + body.speed.toFixed(2), 'angle: ' + body.angle.toFixed(2));
         debug.line('gravity x: ' + body.gravity.x, 'y: ' + body.gravity.y, 'bounce x: ' + body.bounce.x.toFixed(2), 'y: ' + body.bounce.y.toFixed(2));
         debug.line('touching left: ' + body.touching.left, 'right: ' + body.touching.right, 'up: ' + body.touching.up, 'down: ' + body.touching.down);
         debug.line('blocked left: ' + body.blocked.left, 'right: ' + body.blocked.right, 'up: ' + body.blocked.up, 'down: ' + body.blocked.down);* /

 }
 */

  /* moveToPixelXY(x, y, speed = 60, maxTime = 0, active = true) {
          x = Math.round(x / this.world.gridSize.x);
          y = Math.round(y / this.world.gridSize.y);
          this.moveToXY(x, y, speed, maxTime, active);
      }*/

  /* moveToXY(x, y, speed = 60, maxTime = 0, active = true) {
          /*
            Yes, I know that this is ridiculously inefficient rebuilding the grid from the tilemap
            on each call without any cache, and trying to find the path of the full current map
            even if it's not necessarily in most cases.

            It's also still buggy. Different bodysizes and stuff is a challenge, and now
            the body size is locked to 2x2 of the grid size.

            And, also it just checks the first tilemap layer for collision even if you added more.

          * /


          if (typeof(EasyStar) === 'undefined') {
              console.error("Grid Physics error: Easystar.js must be enabled!");
              return;
          }
          if (this.physics.render.path || this.physics.render.pathCollision) {
              this.physics.resetDebugRenderer();
          }

          let easystar = new EasyStar.js();

          // Generate array
          // Respond
          let grid = [];
          let i = 0;
          let tileRatio = {
              x: this.physics.tilemaplayers[0].layer.data[0][0].width / game.physics.gridPhysics.gridSize.x,
              y: this.physics.tilemaplayers[0].layer.data[0][0].height / game.physics.gridPhysics.gridSize.y
          };
          for (let row of this.physics.tilemaplayers[0].layer.data) {
              grid[i] = [];
              grid[i + 1] = [];
              for (let tile of row) {
                  if (tile.collideUp && tile.collideDown && tile.collideLeft && tile.collideRight) { // ¦¦ --> && när conditional
                      for (let dy = 0; dy < tileRatio.y; dy++) {
                          for (let dx = 0; dx < tileRatio.x; dx++) {
                              grid[i + dx].push(1);
                          }
                      }
                  } else if (tile.collideUp || tile.collideDown || tile.collideLeft || tile.collideRight) {
                      for (let dy = 0; dy < tileRatio.y; dy++) {
                          for (let dx = 0; dx < tileRatio.x; dx++) {
                              grid[i + dx].push(4);
                          }
                      }
                  } else {
                      for (let dy = 0; dy < tileRatio.y; dy++) {
                          for (let dx = 0; dx < tileRatio.x; dx++) {
                              grid[i + dx].push(0);
                          }
                      }
                  }
              }
              //i++;
              i += tileRatio.y;
          }

          // Bodies
          for (let body of this.physics.bodies) {
              if (body === this) {
                  continue;
              }
              for (let x = 0; x < body.width; x++) {
                  for (let y = 0; y < body.height; y++) {
                      grid[body.gridPosition.y + y][body.gridPosition.x + x] = 3;

                  }
              }
          }




          // Smalare korridorer
          for (let y = 0; y < grid.length; y++) {

              for (let x = 0; x < grid[0].length; x++) {
                  if (x > 0 && grid[y][x] > 0 && grid[y][x] < 4) {
                      if (grid[y][x - 1] == 0 || grid[y][x - 1] == 4) {
                          grid[y][x - 1] = 2;
                      }
                      if (y > 0 && grid[y - 1][x] == 0 || grid[y][x - 1] == 4) {
                          grid[y - 1][x] = 2;
                      }
                      if (x > 0 && y > 0 && grid[y - 1][x - 1] == 0 || grid[y][x - 1] == 4) {
                          grid[y - 1][x - 1] = 2;
                      }
                  }
              }

          }


          //debugger;
          //        console.warn(grid);

          this.physics.renderPathCollision(grid);



          easystar.setGrid(grid);


          // Directional condition
          for (let y = 0; y < grid.length; y++) {
              for (let x = 0; x < grid[0].length; x++) {

                  if (grid[y][x] === 4) {
                      let tile = this.physics.tilemaplayers[0].layer.data[Math.round(y / 2)][Math.round(x / 2)];
                      let paths = []; //;
                      if (!tile.collideUp) {
                          paths.push(EasyStar.BOTTOM);
                      }
                      if (!tile.collideRight) {
                          paths.push(EasyStar.LEFT);
                      }
                      if (!tile.collideDown) {
                          paths.push(EasyStar.TOP);
                      }
                      if (!tile.collideLeft) {
                          paths.push(EasyStar.RIGHT);
                      }
                      grid[y][x] = 0;
                      easystar.setDirectionalCondition(x, y, paths);
                  }
              }
          }

          easystar.setAcceptableTiles([0, 4]);

          easystar.findPath(this.gridPosition.x, this.gridPosition.y, x, y, (path) => {
              if (path === null) {
                  //console.log("Path was not found.");
              } else if (path.length > 0) {
                  //    console.log("Path was found. The first Point is " + path[1].x + " " + path[1].y, this);
                  this.moveTo = {
                      active: true,
                      path,
                      next: 1,
                      velocity: speed,
                      recalc: 0
                  };
                  this.physics.renderPath(this.moveTo.path);

                  /*this.moveTo.x =
                  this.moveTo.y = path[1].y*2;*/
  /*  if (x < this.gridPosition.x) {
                     //  this.setVelocity(-speed, 0);
                       this.moveTo.x = -1;
                   }
                   else if (x > this.gridPosition.x) {
                     //  this.setVelocity(speed, 0);
                       this.moveTo.x = 1;
                   }
                   else if (y < this.gridPosition.y) {
                     //  this.setVelocity(0, -speed);
                       this.moveTo.y = -1;
                   } else if (y > this.gridPosition.y) {
                     //  this.setVelocity(0, speed);
                       this.moveTo.y = 1;
                   }* /
             }
         });
         easystar.setIterationsPerCalculation(1000);
         easystar.calculate();

         // This.isMovingToXY = {active: true, x,y,speed) <-- Kör på automatiskt medan detta finns. Testa ny väg vid varje stopp
     }*/
}

export default GridBody;
