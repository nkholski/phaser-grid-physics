(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("plugin/gridPhysics/gridBody.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*jshint esversion: 6 */

var gridBody = function () {
    function gridBody(sprite) {
        _classCallCheck(this, gridBody);

        /**
         * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
         */
        this.sprite = sprite;

        /**
         * @property {Phaser.Game} game - Local reference to game.
         */
        this.game = sprite.game;

        /**
         * @property {Phaser.Game} game - Local reference to general grid physics properties.
         */
        this.physics = this.game.physics.gridPhysics;

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
        this.gridPosition = new Phaser.Point(0, 0);

        /**
         * @property {number} width - The calculated width of the physics body in grid units. Default match sprite size.
         * @readonly
         */
        this.width = Math.round(sprite.width / this.physics.gridSize.x);

        /**
         * @property {number} height - The calculated height of the physics body in grid units. Default match sprite size.
         * @readonly
         */
        this.height = Math.round(sprite.height / this.physics.gridSize.y);

        /**
         * @property {Phaser.Point} velocity - The velocity, or rate of change in speed of the Body. Measured in pixels per second.
         */
        this.velocity = new Phaser.Point();

        /**
         * @property {Phaser.Point} _desiredVelocity - Velocity the entity strives to get.
         * @readonly
         */
        this._desiredVelocity = new Phaser.Point();

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
                attractedToAll: false },
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


        /**
         * @property {Phaser.Point} shadow - The shadow reserves tiles this object moves from while animating a move to prevent overlaps from other sprites.
         * NOTE: Not yet entirely implemented
         * @readonly
         */
        this._shadow = new Phaser.Point(0, 0);

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

        this.snapToGrid();
    }

    _createClass(gridBody, [{
        key: "snapToGrid",
        value: function snapToGrid() {
            this.gridPosition = {
                x: Math.round(this.sprite.x / this.physics.gridSize.x),
                y: Math.round(this.sprite.y / this.physics.gridSize.y)
            };
            this.sprite.x = this.physics.gridSize.x * this.gridPosition.x;
            this.sprite.y = this.physics.gridSize.y * this.gridPosition.y;
        }
    }, {
        key: "collideTilemap",
        value: function collideTilemap(dx, dy) {
            var slide = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var position = {
                x: this.gridPosition.x + dx,
                y: this.gridPosition.y + dy
            };
            var width = this.width;
            var height = this.height;
            if (dx !== 0) {
                width = 1;
                if (dx > 0) {
                    position.x += this.width - 1;
                }
            } else {
                if (dy !== 0) {
                    height = 1;
                    if (dy > 0) {
                        position.y += this.height - 1;
                    }
                }
            }
            var tileRatio = {
                x: 2,
                y: 2
            };

            for (var x = position.x; x < position.x + width; x++) {
                for (var y = position.y; y < position.y + height; y++) {
                    var collide = false;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.physics.tilemaplayers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var layer = _step.value;

                            var tile = this.game.map.getTile(Math.floor(x * this.physics.gridSize.x / layer.collisionWidth), Math.floor(y * this.physics.gridSize.y / layer.collisionHeight), layer, true);

                            if (!tile && this.collideWorldBounds) {
                                // No tile? Outside of worldBounds!
                                collide = true;
                                break;
                            } else if (!tile || tile.index === -1) {
                                // No tile, or empty - OK
                                continue;
                            }

                            if (tile.collideRight && tile.collideLeft && tile.collideDown && tile.collideUp) {
                                // tile collides whatever direction the body enter
                                collide = true;
                                break;
                            } else if (dx < 0 && tile.collideRight) {
                                // moving left and the tile collides from the right
                                collide = true;
                                break;
                            } else if (dx > 0 && tile.collideLeft) {
                                collide = true;
                                break;
                            }
                            if (dy < 0 && tile.collideDown) {
                                collide = true;
                                break;
                            } else if (dy > 0 && tile.collideUp) {
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
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    if (collide) {
                        if (slide) {
                            // Left-over from previous working version, needs review...
                            if (dx !== 0) {
                                if (!this.collideTilemap(dx, dy - 1)) {
                                    return {
                                        dx: dx,
                                        dy: dy - 1
                                    };
                                } else if (!this.collideTilemap(dx, dy + 1)) {
                                    return {
                                        dx: dx,
                                        dy: dy + 1
                                    };
                                }
                            }
                            if (dy !== 0) {
                                if (!this.collideTilemap(dx - 1, dy)) {
                                    return {
                                        dx: dx - 1,
                                        dy: dy
                                    };
                                } else if (!this.collideTilemap(dx + 1, dy)) {
                                    return {
                                        dx: dx + 1,
                                        dy: dy
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
    }, {
        key: "setVelocity",
        value: function setVelocity(x) {
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            // longpress is not yet implemented
            y = y !== null ? y : x;

            if (x === 0 && y !== 0) {
                this._longpress = 1;
            } else if (y === 0 && x !== 0) {
                this._longpress = 0;
            }
            this._desiredVelocity = {
                x: x,
                y: y
            };
        }
    }, {
        key: "_intersectRect",
        value: function _intersectRect(r1, r2) {
            return !(r2.x >= r1.x + r1.width || r2.x + r2.width <= r1.x || r2.y >= r1.y + r1.height || r2.y + r2.height <= r1.y);
        }
    }, {
        key: "preUpdate",
        value: function preUpdate() {
            // Required on bodies by Phaser
        }
    }, {
        key: "testMove",
        value: function testMove(dx, dy) {
            if (!this.collidable) {
                return true;
            }
            if (this.collideTilemap(dx, dy)) {
                return false;
            }
            // Kolla först tilemap för det kan bli krock direkt!
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.physics.bodies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var body = _step2.value;


                    if (this !== body && body.collidable) {
                        // Kolla om kollision
                        if (this._intersectRect({
                            x: this.gridPosition.x + dx,
                            y: this.gridPosition.y + dy,
                            width: this.width,
                            height: this.height
                        }, {
                            x: body.gridPosition.x,
                            y: body.gridPosition.y,
                            width: body.width,
                            height: body.height
                        })) {
                            // Om det krockar och oflyttbar, ta bort ur pushchain
                            if (body.immovable) {
                                return false;
                            } else {
                                if (this.physics._pushChain.indexOf(body) === -1) {
                                    this.physics._pushChain.push(body); // Tryck på denna
                                    if (!body.testMove(dx, dy)) {
                                        // kolla upp kroppen
                                        return false;
                                    };
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return true;
        }
    }, {
        key: "postUpdate",
        value: function postUpdate() {
            if (this.isLocked.x || this.isLocked.y) {
                return;
            }

            if (this.moveTo.active) {
                this._desiredVelocity = {
                    x: 0,
                    y: 0
                };
                var dest = this.moveTo.path[this.moveTo.next];
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

            this.physics._pushChain = [];
            var moveOk = true;
            var _d = {};
            var _arr = ["x", "y"];
            for (var _i = 0; _i < _arr.length; _i++) {
                var dim = _arr[_i];
                _d[dim] = this._desiredVelocity[dim] === 0 ? 0 : this._desiredVelocity[dim] > 0 ? 1 : -1;
            }

            var _arr2 = [0, 1];
            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                var _dim = _arr2[_i2]; // Array här ändrar ordning efter prio
                if (_dim === 0) {
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

            // Check is strong enough
            if (this.strength > -1 || this.struggle > 1) {
                var totalMass = 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.physics._pushChain[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var body = _step3.value;

                        totalMass += body.mass;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                if (this.strength > -1 && totalMass > this.strength) {
                    moveOk = false;
                }
                if (this.struggle > 1 && totalMass > 0) {
                    this._desiredVelocity.x = this._desiredVelocity.x / (totalMass * this.struggle);
                    this._desiredVelocity.y = this._desiredVelocity.y / (totalMass * this.struggle);
                }
            }
            if (this.pushLimit > -1 && this.physics._pushChain.length > this.pushLimit) {
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

            var _arr3 = ["x", "y"];
            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                var _dim2 = _arr3[_i3];
                this.velocity[_dim2] = this._desiredVelocity[_dim2];
                this._shadow[_dim2] = 0;
                if (this.velocity[_dim2] != 0) {
                    this.gridPosition[_dim2] += this.velocity[_dim2] > 0 ? 1 : -1;
                    this.isLocked[_dim2] = true;
                    this._shadow[_dim2] = this.velocity[_dim2] < 0 ? 1 : -1;

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.physics._pushChain[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _body = _step4.value;

                            _body.passiveSteps++;
                            _body.snapToGrid();
                            _body.velocity[_dim2] = this._desiredVelocity[_dim2];
                            _body.gridPosition[_dim2] += _body.velocity[_dim2] > 0 ? 1 : -1;
                            _body.isLocked[_dim2] = true;
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
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
        }
    }, {
        key: "renderDebugBody",
        value: function renderDebugBody() {
            if (!this.debugBody) {
                this.debugBody = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
                this.debugShadow = new Phaser.Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
            }

            this.debugBody.x = this.gridPosition.x * this.physics.gridSize.x;
            this.debugBody.y = this.gridPosition.y * this.physics.gridSize.y;
            this.debugShadow.x = this.gridPosition.x * this.physics.gridSize.x + this.physics.gridSize.x * this._shadow.x;
            this.debugShadow.y = this.gridPosition.y * this.physics.gridSize.y + this.physics.gridSize.y * this._shadow.y;
            if (this._shadow.x == 0) {
                this.debugShadow.width = this.sprite.width;
                this.debugShadow.height = this.physics.gridSize.y;
            } else {
                this.debugShadow.width = this.physics.gridSize.x;
                this.debugShadow.height = this.sprite.height;
            }
            game.debug.geom(this.debugBody, 'rgba(0,255,0,0.4)');
        }
    }, {
        key: "renderBodyInfo",
        value: function renderBodyInfo(debug, body) {
            debug.line('x: ' + body.gridPosition.x, 'y: ' + body.gridPosition.y, 'width: ' + body.width, 'height: ' + body.height);
            /*debug.line('x: ' + body.x.toFixed(2), 'y: ' + body.y.toFixed(2), 'width: ' + body.width, 'height: ' + body.height);
            debug.line('velocity x: ' + body.velocity.x.toFixed(2), 'y: ' + body.velocity.y.toFixed(2), 'deltaX: ' + body._dx.toFixed(2), 'deltaY: ' + body._dy.toFixed(2));
            debug.line('acceleration x: ' + body.acceleration.x.toFixed(2), 'y: ' + body.acceleration.y.toFixed(2), 'speed: ' + body.speed.toFixed(2), 'angle: ' + body.angle.toFixed(2));
            debug.line('gravity x: ' + body.gravity.x, 'y: ' + body.gravity.y, 'bounce x: ' + body.bounce.x.toFixed(2), 'y: ' + body.bounce.y.toFixed(2));
            debug.line('touching left: ' + body.touching.left, 'right: ' + body.touching.right, 'up: ' + body.touching.up, 'down: ' + body.touching.down);
            debug.line('blocked left: ' + body.blocked.left, 'right: ' + body.blocked.right, 'up: ' + body.blocked.up, 'down: ' + body.blocked.down);*/
        }
    }, {
        key: "moveToPixelXY",
        value: function moveToPixelXY(x, y) {
            var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var maxTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var active = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            x = Math.round(x / this.physics.gridSize.x);
            y = Math.round(y / this.physics.gridSize.y);
            this.moveToXY(x, y, speed, maxTime, active);
        }
    }, {
        key: "moveToXY",
        value: function moveToXY(x, y) {
            var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;

            var _this = this;

            var maxTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var active = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

            /*
              Yes, I know that this is ridiculously inefficient rebuilding the grid from the tilemap
              on each call without any cache, and trying to find the path of the full current map
              even if it's not necessarily in most cases.
               It's also still buggy. Different bodysizes and stuff is a challenge, and now
              the body size is locked to 2x2 of the grid size.
               And, also it just checks the first tilemap layer for collision even if you added more.
             */

            if (typeof EasyStar === 'undefined') {
                console.error("Grid Physics error: Easystar.js must be enabled!");
                return;
            }
            if (this.physics.render.path || this.physics.render.pathCollision) {
                this.physics.resetDebugRenderer();
            }

            var easystar = new EasyStar.js();

            // Generate array
            // Respond
            var grid = [];
            var i = 0;
            var tileRatio = {
                x: this.physics.tilemaplayers[0].layer.data[0][0].width / game.physics.gridPhysics.gridSize.x,
                y: this.physics.tilemaplayers[0].layer.data[0][0].height / game.physics.gridPhysics.gridSize.y
            };
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.physics.tilemaplayers[0].layer.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var row = _step5.value;

                    grid[i] = [];
                    grid[i + 1] = [];
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                        for (var _iterator7 = row[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                            var _tile = _step7.value;

                            if (_tile.collideUp && _tile.collideDown && _tile.collideLeft && _tile.collideRight) {
                                // ¦¦ --> && när conditional
                                for (var dy = 0; dy < tileRatio.y; dy++) {
                                    for (var dx = 0; dx < tileRatio.x; dx++) {
                                        grid[i + dx].push(1);
                                    }
                                }
                            } else if (_tile.collideUp || _tile.collideDown || _tile.collideLeft || _tile.collideRight) {
                                for (var _dy = 0; _dy < tileRatio.y; _dy++) {
                                    for (var _dx = 0; _dx < tileRatio.x; _dx++) {
                                        grid[i + _dx].push(4);
                                    }
                                }
                            } else {
                                for (var _dy2 = 0; _dy2 < tileRatio.y; _dy2++) {
                                    for (var _dx2 = 0; _dx2 < tileRatio.x; _dx2++) {
                                        grid[i + _dx2].push(0);
                                    }
                                }
                            }
                        }
                        //i++;
                    } catch (err) {
                        _didIteratorError7 = true;
                        _iteratorError7 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                _iterator7.return();
                            }
                        } finally {
                            if (_didIteratorError7) {
                                throw _iteratorError7;
                            }
                        }
                    }

                    i += tileRatio.y;
                }

                // Bodies
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.physics.bodies[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var body = _step6.value;

                    if (body === this) {
                        continue;
                    }
                    for (var _x11 = 0; _x11 < body.width; _x11++) {
                        for (var _y3 = 0; _y3 < body.height; _y3++) {
                            grid[body.gridPosition.y + _y3][body.gridPosition.x + _x11] = 3;
                        }
                    }
                }

                // Smalare korridorer
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            for (var _y = 0; _y < grid.length; _y++) {

                for (var _x9 = 0; _x9 < grid[0].length; _x9++) {
                    if (_x9 > 0 && grid[_y][_x9] > 0 && grid[_y][_x9] < 4) {
                        if (grid[_y][_x9 - 1] == 0 || grid[_y][_x9 - 1] == 4) {
                            grid[_y][_x9 - 1] = 2;
                        }
                        if (_y > 0 && grid[_y - 1][_x9] == 0 || grid[_y][_x9 - 1] == 4) {
                            grid[_y - 1][_x9] = 2;
                        }
                        if (_x9 > 0 && _y > 0 && grid[_y - 1][_x9 - 1] == 0 || grid[_y][_x9 - 1] == 4) {
                            grid[_y - 1][_x9 - 1] = 2;
                        }
                    }
                }
            }

            //debugger;
            //        console.warn(grid);

            this.physics.renderPathCollision(grid);

            easystar.setGrid(grid);

            // Directional condition
            for (var _y2 = 0; _y2 < grid.length; _y2++) {
                for (var _x10 = 0; _x10 < grid[0].length; _x10++) {

                    if (grid[_y2][_x10] === 4) {
                        var tile = this.physics.tilemaplayers[0].layer.data[Math.round(_y2 / 2)][Math.round(_x10 / 2)];
                        var paths = []; //;
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
                        grid[_y2][_x10] = 0;
                        easystar.setDirectionalCondition(_x10, _y2, paths);
                    }
                }
            }

            easystar.setAcceptableTiles([0, 4]);

            easystar.findPath(this.gridPosition.x, this.gridPosition.y, x, y, function (path) {
                if (path === null) {
                    //console.log("Path was not found.");
                } else if (path.length > 0) {
                    //    console.log("Path was found. The first Point is " + path[1].x + " " + path[1].y, this);
                    _this.moveTo = {
                        active: true,
                        path: path,
                        next: 1,
                        velocity: speed,
                        recalc: 0
                    };
                    _this.physics.renderPath(_this.moveTo.path);

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
                      }*/
                }
            });
            easystar.setIterationsPerCalculation(1000);
            easystar.calculate();

            // This.isMovingToXY = {active: true, x,y,speed) <-- Kör på automatiskt medan detta finns. Testa ny väg vid varje stopp
        }
    }]);

    return gridBody;
}();

exports.default = gridBody;

});

require.register("plugin/gridPhysics/gridDebug.js", function(exports, require, module) {
/** All debug-stuff from Body and Physics will be moved here */
"use strict";

});

require.register("plugin/gridPhysics/gridPhysics.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gridBody = require("./gridBody");

var _gridBody2 = _interopRequireDefault(_gridBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*jshint esversion: 6 */

/**
 * A Sample Plugin demonstrating how to hook into the Phaser plugin system.
 * @class Phaser.Plugin.SamplePlugin
 */

//import GridDebug from './gridDebug';

var GridPhysics = function (_Phaser$Plugin) {
    _inherits(GridPhysics, _Phaser$Plugin);

    function GridPhysics(game) {
        _classCallCheck(this, GridPhysics);

        var _this = _possibleConstructorReturn(this, (GridPhysics.__proto__ || Object.getPrototypeOf(GridPhysics)).call(this, game));

        _this.cnt = 0;

        // Size of Grid in pixels
        _this.gridSize = new Phaser.Point(8);

        // Shadow size in pixels.
        _this.shadowSize = 0;

        // Locked while pushed
        _this.lockBodies = false;

        // Sprites and stuff with gridPhysics enabled
        _this.bodies = [];

        // Collidable tilemap layers
        _this.tilemaplayers = [];

        _this.tileGridRatio = new Phaser.Point(-1, -1);
        console.log(_this.tileGridRatio);
        _this._pushChain = [];

        _this.map = null;

        //
        _this.game.physics.gridPhysics = _this;

        _this.debugGfx = {
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

        window.debugGfx = _this.debugGfx;

        _this.turnbased = false;
        _this.turn = 0;
        _this.que = [];

        return _this;
    }

    _createClass(GridPhysics, [{
        key: "enable",
        value: function enable(entity) {
            switch (entity.type) {
                case Phaser.SPRITE:
                    entity.body = new _gridBody2.default(entity);
                    this.bodies.push(entity.body);
                    break;
                case Phaser.TILEMAPLAYER:
                    this.tilemaplayers.push(entity);
                    console.log(entity);

                    if (this.tileGridRatio.x === -1) {
                        this.tileGridRatio.set(entity.collisionWidth / this.gridSize.x, entity.collisionHeight / this.gridSize.y);
                    }

                    this.addToLayerToCollision(entity);
                    entity.updateBorders = this.updateBorders.bind(entity);
                    break;
                default:
                    // Phaser.TILEMAP????
                    if (entity.hasOwnProperty) {
                        this.map = entity;
                    }
                    //            debugger;
                    break;
            }
        }
    }, {
        key: "updateBorders",
        value: function updateBorders() {
            console.log("UPDATE BLOCKED");
            var data = this.layer.data;
            for (var y = 0; y < data.length; y++) {
                console.log("y" + y);
                for (var x = 0; x < data[y].length; x++) {
                    var tile = data[y][x];
                    if (tile.borderUp) {
                        tile.collideUp = true;
                        data[y - 1][x].collideDown = true;
                    }
                    if (tile.borderDown) {
                        tile.collideDown = true;
                        data[y + 1][x].collideUp = true;
                    }
                    if (tile.borderLeft) {
                        tile.collideLeft = true;
                        data[y][x - 1].collideRight = true;
                    }
                    if (tile.borderRight) {
                        tile.collideRight = true;
                        data[y][x + 1].collideLeft = true;
                    }
                }
            }
        }
    }, {
        key: "addToQue",
        value: function addToQue(body) {
            var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (!body.hasOwnProperty("myTurn") && body.hasOwnProperty("body")) {
                body = body.body;
            }

            if (reload === 0) {
                reload = body.reload > 0 ? body.reload : 1;
            }
            // Gör kön tillräckligt lång
            if (this.que.length < reload * 2) {
                for (var s = 0; s < reload * 2; s++) {
                    this.que.push(null);
                }
            }
            var pos = reload * 2;
            while (this.que[pos] != null) {
                pos++;
            }
            this.que.splice(pos, 0, body);
        }
    }, {
        key: "nextTurn",
        value: function nextTurn() {
            var oldBody = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (oldBody != null) {
                oldBody.myTurn = false;
                oldBody.turns++;
                this.turn++;
                this.addToQue(oldBody, reload);
            }

            var body = null;
            while (body === null && this.que.length > 0) {
                body = this.que.shift(0);
            }
            if (body === null) {
                console.error("EMPTY QUE!");
                return false;
            }
            body.myTurn = true;
        }
    }, {
        key: "update",
        value: function update() {
            this.turnMade = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.bodies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var body = _step.value;

                    var next = {
                        x: body.sprite.x,
                        y: body.sprite.y
                    };
                    var _arr = ["x", "y"];
                    for (var _i = 0; _i < _arr.length; _i++) {
                        var dim = _arr[_i];
                        if (body.velocity[dim] === 0) {
                            // Stannat, fixa positionen exakt.
                            body.sprite[dim] = body.gridPosition[dim] * body.physics.gridSize[dim];
                            continue;
                        }
                        if (body.gridPosition[dim] * body.physics.gridSize[dim] != body.sprite[dim]) {
                            body.sprite[dim] += body.velocity[dim] * body.game.time.physicsElapsed;
                            next[dim] = body.sprite[dim] + body.velocity[dim] * body.game.time.physicsElapsed;
                        }
                        if (body.velocity[dim] > 0 && next[dim] > body.gridPosition[dim] * body.physics.gridSize[dim]) {
                            // Nästa steg är klart!
                            body.isLocked[dim] = false; // Kan sätta ny gridPosition och velocity!
                        }
                        if (body.velocity[dim] < 0 && next[dim] < body.gridPosition[dim] * body.physics.gridSize[dim]) {
                            // Nästa steg är klart!
                            body.isLocked[dim] = false; // Kan sätta ny gridPosition och velocity!
                        }
                        if (!body.isLocked.x && !body.isLocked.y && this.turnbased) {
                            body.setVelocity(0);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.debugGfx.update) {
                this.renderDebug();
            }
        }
    }, {
        key: "renderDebug",
        value: function renderDebug() {
            var gfx = this.debugGfx;
            if (gfx.grid.active != gfx.grid.wasActive || gfx.path.active != gfx.path.wasActive || gfx.pathCollision.active != gfx.pathCollision.wasActive || gfx.collision.active != gfx.collision.wasActive) {
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

                var _arr2 = ['grid', 'collision', 'path', 'pathCollision'];
                for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                    var type = _arr2[_i2];
                    gfx[type].wasActive = gfx[type].active;
                }

                if (gfx.grid.active || gfx.path.active || gfx.pathCollision.active || gfx.collision.active) {
                    gfx.graphics.alpha = 1;
                } else {
                    gfx.graphics.alpha = 0;
                }
            }
        }
    }, {
        key: "renderGrid",
        value: function renderGrid() {
            var graphics = this.debugGfx.graphics;
            graphics.lineStyle(1, 0x000000, 0.2);
            for (var x = 0; x < this.game.width / this.gridSize.x; x++) {
                graphics.moveTo(x * this.gridSize.x, 0);
                graphics.lineTo(x * this.gridSize.x, this.game.height);
            }
            for (var y = 0; y < this.game.height / this.gridSize.y; y++) {
                graphics.moveTo(0, y * this.gridSize.y);
                graphics.lineTo(this.game.width, y * this.gridSize.y);
            }
        }
    }, {
        key: "renderCollision",
        value: function renderCollision() {
            var graphics = this.debugGfx.graphics;
            graphics.lineStyle(0, 0x00FF00, 0.0);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.tilemaplayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var layer = _step2.value;

                    for (var y in layer.layer.data) {
                        for (var x in layer.layer.data[y]) {
                            var tile = layer.layer.data[y][x];
                            if (tile.collides) {
                                graphics.beginFill(0xFF0000, 0.5);
                                graphics.drawRect(x * tile.width + 1, y * tile.height + 1, tile.width - 2, tile.height - 2);
                                graphics.endFill();
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "renderPathCollision",
        value: function renderPathCollision(data) {
            if (data) {
                this.debugGfx.pathCollision.data = data;
                this.debugGfx.pathCollision.wasActive = false;
                return;
            }
            if (!this.debugGfx.pathCollision.data || this.debugGfx.pathCollision.data.length === 0) {
                return;
            }

            var graphics = this.debugGfx.graphics;
            var grid = this.debugGfx.pathCollision.data;

            for (var y = 0; y < grid.length; y++) {
                graphics.lineStyle(1, 0xFF0000, 0.3);
                for (var x = 0; x < grid[0].length; x++) {
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
    }, {
        key: "renderPath",
        value: function renderPath(data) {
            if (data) {
                this.debugGfx.path.data = data;
                this.debugGfx.path.wasActive = false;
                return;
            }
            if (!this.debugGfx.path.data || this.debugGfx.path.data.length === 0) {
                return;
            }

            var graphics = this.debugGfx.graphics;
            var path = this.debugGfx.path.data;
            graphics.lineStyle(1, 0x00FF00, 0.5);
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = path[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var point = _step3.value;

                    graphics.beginFill(0x00FF00, 0.4);

                    graphics.drawRect(point.x * this.gridSize.x, point.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var lastPoint = path[path.length - 1];
            graphics.beginFill(0xFF3300, 0.7);

            graphics.drawRect(lastPoint.x * this.gridSize.x, lastPoint.y * this.gridSize.y, this.gridSize.x, this.gridSize.y);
            graphics.endFill();
        }
    }, {
        key: "resetCollisionLayer",
        value: function resetCollisionLayer() {
            var map = this.map;
            var colLayerIndex = map.getLayerIndex("gridPhysicsCollision");
            var colTile = void 0,
                tile = void 0;
            for (var x = 0; x < map.layers[colLayerIndex].width; x++) {
                for (var y = 0; y < map.layers[colLayerIndex].height; y++) {
                    //console.log(collisionLayerName);
                    map.putTile(1, x, y, "gridPhysicsCollision");
                    colTile = map.getTile(x, y, "gridPhysicsCollision");
                    colTile.collideUp = false;
                    colTile.collideRight = false;
                    colTile.collideDown = false;
                    colTile.collideLeft = false;
                    //colTile.collides = false;
                }
            }
        }
    }, {
        key: "addToLayerToCollision",
        value: function addToLayerToCollision(layer) {

            var map = this.map;

            var colLayerIndex = map.getLayerIndex("gridPhysicsCollision");
            //let collisionLayer = null;
            var colTile = void 0,
                tile = void 0;

            if (!colLayerIndex) {
                var collisionLayer = map.createBlankLayer("gridPhysicsCollision", map.width, map.height, map.tileWidth, map.tileHeight);
                colLayerIndex = map.getLayerIndex("gridPhysicsCollision");
                collisionLayer.visible = false;
                this.resetCollisionLayer();
            }
            // Prepare the collision layer

            // Loop tiles for collision and add to collision layer

            for (var x = 0; x < layer.width; x++) {
                for (var y = 0; y < layer.height; y++) {
                    //console.log(x+"  "+y)
                    tile = map.getTile(x, y, layer.index);
                    if (!tile) {
                        continue;
                    }
                    colTile = map.getTile(x, y, "gridPhysicsCollision");
                    colTile.collideUp = tile.collideUp ? true : colTile.collideUp;
                    colTile.collideRight = tile.collideRight ? true : colTile.collideRight;
                    colTile.collideDown = tile.collideDown ? true : colTile.collideDown;
                    colTile.collideLeft = tile.collideLeft ? true : colTile.collideLeft;
                    //colTile.collides = tile.collides ? true : colTile.collides;*/

                    console.log("TILE", colTile);
                }
            }

            // Set all non-collision tiles to null (save some ram and probably perfomance)
            /*for (var x = 0; x < map.layers[colLayerIndex].width; x++) {
                for (var y = 0; y < map.layers[colLayerIndex].height; y++) {
                    colTile = map.getTile(x, y, collisionLayerName);
                    if (!colTile.collideUp && !colTile.collideDown && !colTile.collideLeft && !colTile.collideRight) {
                        map.putTile(null, x, y, collisionLayerName);
                    }
                }
            }*/

            // Build collision grid for pathfinding!


            // Fix faces - Not used by GridPhysics ATM, but could be nice for visual debugging
            map.calculateFaces(colLayerIndex);

            //return collisionLayer ? collisionLayer : null;
            console.log(map.layers[colLayerIndex]);
        }
    }]);

    return GridPhysics;
}(Phaser.Plugin);

exports.default = GridPhysics;

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=gridPhysics.js.map