(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("GridPhysics", [], factory);
	else if(typeof exports === 'object')
		exports["GridPhysics"] = factory();
	else
		root["GridPhysics"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tilemap = function () {
    function Tilemap() {
        _classCallCheck(this, Tilemap);

        this.tilemaps = [];
        this.world = Phaser.Physics.GridPhysics.world;
    }

    _createClass(Tilemap, [{
        key: "collide",
        value: function collide(source) {
            var dx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var dy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var layers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.world.tilemaplayers;
            var slide = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            var position = void 0,
                width = void 0,
                height = void 0,
                collideWorldBounds = void 0,
                returnTile = void 0,
                level = void 0;

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
            if (collideWorldBounds && (position.x + dx < 0 || position.y + dy < 0 || position.x + dx + width > this.world.tilemaplayers[0].width / this.world.gridSize.x || position.y + dy + height > this.world.tilemaplayers[0].height / this.world.gridSize.y)) {
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
                        for (var _iterator = this.world.tilemaplayers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var layer = _step.value;

                            if (level > layer.level) {
                                continue;
                            }
                            //let tile = this.world.map.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                            layer.collisionHeight = 16;
                            layer.collisionWidth = 16;
                            //let tile = this.world.getTileAt(Math.floor(x * this.world.gridSize.x / layer.collisionWidth), Math.floor(y * this.world.gridSize.y / layer.collisionHeight), layer, true);
                            //debugger;
                            var checkY = Math.floor(y * this.world.gridSize.y / layer.collisionHeight);
                            var checkX = void 0;
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

                            var tile = layer.layer.data[checkY][checkX];

                            if (tile.index === -1 && layer.level > 0 && level > 0) {
                                // HACK
                                console.log(layer.level);
                                return true;
                            }

                            if (returnTile) {
                                console.log(tile, checkX, checkY);
                            }

                            if (tile === null || tile.index === -1 && !tile.gotBorder) {
                                // No tile, or empty - OK
                                continue;
                            }

                            if (tile.collideRight && tile.collideLeft && tile.collideDown && tile.collideUp) {
                                // tile collides whatever direction the body enter
                                collide = true;
                                break;
                            } else if (dx < 0 && tile.collideRight) {
                                // moving left and the tile collides from the right
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
                                if (!this.collide(source, dx, dy - 1)) {
                                    return {
                                        dx: dx,
                                        dy: dy - 1
                                    };
                                } else if (!this.collide(source, dx, dy + 1)) {
                                    return {
                                        dx: dx,
                                        dy: dy + 1
                                    };
                                }
                            }
                            if (dy !== 0) {
                                if (!this.collide(source, dx - 1, dy)) {
                                    return {
                                        dx: dx - 1,
                                        dy: dy
                                    };
                                } else if (!this.collide(source, dx + 1, dy)) {
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
        key: "checkLevel",
        value: function checkLevel(source, dx, dy) {
            var position = void 0,
                width = void 0,
                height = void 0;
            var level = 0;

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

            if (dx !== 0) {
                width = 1;
            } else {
                height = 1;
            }

            if (dx > 0) {
                position.x = position.x + width;
            } else if (dy > 0) {
                position.y = position.y + height;
            }

            // Return level a sprite move to, higher level is prioritized
            for (var x = position.x; x < position.x + width; x++) {
                for (var y = position.y; y < position.y + height; y++) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.world.tilemaplayers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var layer = _step2.value;


                            var tile = layer.layer.data[Math.floor(y / 2)][Math.floor(x / 2)];

                            console.log(layer, layer.level, x, y, tile);

                            if (tile && tile.index > 0 && layer.level > level) {
                                level = layer.level;
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
            }
            console.log("LEVEL", level);
            return level;
        }
    }]);

    return Tilemap;
}();

exports.default = Tilemap;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridBody = function () {
    function GridBody(sprite) {
        _classCallCheck(this, GridBody);

        /**
         * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
         */
        this.sprite = sprite;

        /**
         * @property {Phaser.Game} world - Local reference to the grid physics world.
         */
        this.world = Phaser.Physics.GridPhysics.world;

        this.tilemap = Phaser.Physics.GridPhysics.tilemap;

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

            // MAY BE REMOVED:
        };this._longPress = 0; // 0 - X, 1-Y (längsta nedtryckt)


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

        this.sprite.originX = 0;
        this.sprite.originY = 0;

        this.snapToGrid();
    }

    _createClass(GridBody, [{
        key: "snapToGrid",
        value: function snapToGrid() {
            this.gridPosition = {
                x: Math.round(this.sprite.x / this.world.gridSize.x),
                y: Math.round(this.sprite.y / this.world.gridSize.y)
            };
            this.sprite.x = this.world.gridSize.x * this.gridPosition.x;
            this.sprite.y = this.world.gridSize.y * this.gridPosition.y;
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
        key: "testMove",
        value: function testMove(dx, dy) {
            if (!this.collidable) {
                return true;
            }

            if (this.onStairs) {
                console.log("ONSTAIRS");
                this.level = this.tilemap.checkLevel(this.sprite, dx, dy);
            }

            if (this.tilemap.collide(this.sprite, dx, dy)) {
                return false;
            }

            // Kolla först tilemap för det kan bli krock direkt!
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.world.bodies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var body = _step.value;


                    if (this !== body && body.collidable && (body.level === this.level || body.onStairs)) {
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
                                if (this.world._pushChain.indexOf(body) === -1) {
                                    this.world._pushChain.push(body); // Tryck på denna
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

            return true;
        }
    }, {
        key: "postUpdate",
        value: function postUpdate() {
            this.justMoved = false;
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

            this.world._pushChain = [];
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
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.world._pushChain[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var body = _step2.value;

                        totalMass += body.mass;
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

                if (this.strength > -1 && totalMass > this.strength) {
                    moveOk = false;
                }
                if (this.struggle > 1 && totalMass > 0) {
                    this._desiredVelocity.x = this._desiredVelocity.x / (totalMass * this.struggle);
                    this._desiredVelocity.y = this._desiredVelocity.y / (totalMass * this.struggle);
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

            var _arr3 = ["x", "y"];
            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                var _dim2 = _arr3[_i3];
                this.velocity[_dim2] = this._desiredVelocity[_dim2];
                this._shadow[_dim2] = 0;
                if (this.velocity[_dim2] != 0) {
                    this.gridPosition[_dim2] += this.velocity[_dim2] > 0 ? 1 : -1;
                    this.isLocked[_dim2] = true;
                    this._shadow[_dim2] = this.velocity[_dim2] < 0 ? 1 : -1;

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = this.world._pushChain[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var _body = _step3.value;

                            _body.passiveSteps++;
                            _body.snapToGrid();
                            _body.velocity[_dim2] = this._desiredVelocity[_dim2];
                            _body.gridPosition[_dim2] += _body.velocity[_dim2] > 0 ? 1 : -1;
                            _body.isLocked[_dim2] = true;
                            _body.onStairs = this.checkStairs(_body);
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

            var wasOnStairs = this.onStairs;

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
    }, {
        key: "checkStairs",
        value: function checkStairs(body) {
            var pos = body.gridPosition;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.world.stairs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var stairs = _step4.value;

                    if (pos.x < stairs.x + stairs.width && pos.x + body.width > stairs.x && pos.y < stairs.y + stairs.height && body.height + pos.y > stairs.y) {
                        body.sprite.setDepth(1000);
                        return true;
                    }
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

            return false;
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

    }]);

    return GridBody;
}();

exports.default = GridBody;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gridBody = __webpack_require__(1);

var _gridBody2 = _interopRequireDefault(_gridBody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var World = function () {
    function World(game) {
        _classCallCheck(this, World);

        this.cnt = 0;

        // Size of Grid in pixels
        this.gridSize = new Phaser.Geom.Point(8);

        // Shadow size in pixels.
        this.shadowSize = 0;

        // Locked while pushed
        this.lockBodies = false;

        // Sprites and stuff with gridPhysics enable
        this.bodies = [];

        // Collidable tilemap layers
        this.tilemaplayers = [];

        this.tileGridRatio = new Phaser.Geom.Point(-1, -1);

        this._pushChain = [];

        this.stairs = [];

        this.map = null;

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
        this.firstInLine = null;
        this.collisionMap = null;
    }

    _createClass(World, [{
        key: "enable",
        value: function enable(entity) {
            switch (entity.type) {
                case "Sprite":
                    entity.body = new _gridBody2.default(entity);
                    this.bodies.push(entity.body);
                    break;
                case "StaticTilemapLayer":
                    this.tilemaplayers.push(entity);
                    entity.level = entity.level ? entity.level : 0;
                    entity.setOrigin(0, 0);
                    if (this.tileGridRatio.x === -1) {
                        this.tileGridRatio.setTo(entity.collisionWidth / this.gridSize.x, entity.collisionHeight / this.gridSize.y);
                    }
                    this.updateBorders(entity);
                    return;
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
        value: function updateBorders(layer) {
            var data = layer.layer.data;
            for (var y = 0; y < data.length; y++) {
                for (var x = 0; x < data[y].length; x++) {
                    var tile = data[y][x];
                    if (tile.borderUp) {
                        tile.collideUp = true;
                        data[y - 1][x].collideDown = true;
                        data[y - 1][x].gotBorder = true;
                    }
                    if (tile.borderDown) {
                        tile.collideDown = true;
                        data[y + 1][x].collideUp = true;
                        data[y + 1][x].gotBorder = true;
                    }
                    if (tile.borderLeft) {
                        tile.collideLeft = true;
                        data[y][x - 1].collideRight = true;
                        data[y][x - 1].gotBorder = true;
                    }
                    if (tile.borderRight) {
                        tile.collideRight = true;
                        data[y][x + 1].collideLeft = true;
                        data[y][x + 1].gotBorder = true;
                    }
                }
            }
        }
    }, {
        key: "addToQue",
        value: function addToQue(body) {
            var _this = this;

            var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (!body.hasOwnProperty("myTurn")) {
                if (body.hasOwnProperty("body")) {
                    body = body.body;
                } else if ((typeof body === "undefined" ? "undefined" : _typeof(body)) === "object" && body.length > 0) {
                    body.forEach(function (b) {
                        _this.addToQue(b, reload);
                    });
                    return;
                } else {
                    console.error("You need to pass a sprite with gridBody, gridBody or an array to addToQue.");
                }
            }

            this.firstInLine = this.firstInLine ? this.firstInLine : body.sprite;
            this.firstInLine.body.myTurn = true;

            if (reload === 0) {
                reload = body.reload > 0 ? body.reload : 1;
            }
            // Fill the que with nulls to make room for quicker or faster units.
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

            // Remove unnecessary nulls in the beginning of the array from the first added body
            while (this.que[0] === null && this.que.length > 0) {
                this.que.shift(0);
            }
        }
    }, {
        key: "nextTurn",
        value: function nextTurn() {
            var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var body = null;

            // Add current body to the end of the que
            this.addToQue(this.firstInLine, reload);
            this.firstInLine.body.myTurn = false;
            this.firstInLine.body.turn++;

            // Keep track of total global moves
            this.turn++;
            this.que.shift(0);

            while (this.que[0] === null && this.que.length > 0) {
                this.que.shift(0);
            }

            if (this.que.length === 0) {
                console.error("EMPTY QUE!");
                return;
            }

            body = this.que[0];
            body.myTurn = true;
            this.firstInLine = body.sprite;
        }
    }, {
        key: "update",
        value: function update(time, delta) {
            this.turnMade = false;
            var elapsedTime = delta / 1000; //body.game.time.physicsElapsed

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
                            body.sprite[dim] = body.gridPosition[dim] * body.world.gridSize[dim];
                            continue;
                        }
                        if (body.gridPosition[dim] * body.world.gridSize[dim] != body.sprite[dim]) {
                            body.sprite[dim] += body.velocity[dim] * elapsedTime;
                            next[dim] = body.sprite[dim] + body.velocity[dim] * elapsedTime;
                        }
                        if (body.velocity[dim] > 0 && next[dim] > body.gridPosition[dim] * body.world.gridSize[dim]) {
                            // Nästa steg är klart!
                            body.isLocked[dim] = false; // Kan sätta ny gridPosition och velocity!
                        }
                        if (body.velocity[dim] < 0 && next[dim] < body.gridPosition[dim] * body.world.gridSize[dim]) {
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
                    map.putTileAt(1, x, y, "gridPhysicsCollision");
                    colTile = map.getTileAt(x, y, "gridPhysicsCollision");
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
            //console.log("lay",layer);
            //let map = this.map;
            console.log("WHAT");
            var map = layer.tilemap;
            // console.log(layer, map, "what")
            var colLayerIndex = map.getLayerIndex("gridPhysicsCollision");
            console.log("COL", layer);

            //let collisionLayer = null;
            var colTile = void 0,
                tile = void 0;
            tile = map.getTileAt(1, 0, layer);
            console.log("tile", tile.index);
            if (!colLayerIndex) {
                var collisionLayer = map.createBlankDynamicLayer("gridPhysicsCollision", map.width, map.height, map.tileWidth, map.tileHeight);
                colLayerIndex = map.getLayerIndex("gridPhysicsCollision");
                collisionLayer.visible = false;
                this.resetCollisionLayer();
            }
            console.log(map);
            tile = map.getTileAt(1, 0, layer);
            console.log("tile", tile.index);
            // Prepare the collision layer

            // Loop tiles for collision and add to collision layer
            console.log("layerindex", layer.layerIndex);
            console.log("asa", layer);

            for (var x = 0; x < layer.width; x++) {
                console.log(x);
                for (var y = 0; y < layer.height; y++) {

                    //console.log(x+"  "+y)
                    var _tile = map.getTileAt(x, y, layer);

                    if (_tile === null) {
                        continue;
                    }

                    if (_tile.index !== 21) {
                        console.log(_tile);
                    } else {
                        console.log(".");
                    }
                    //console.log(tile);


                    colTile = map.getTileAt(x, y, "gridPhysicsCollision");
                    colTile.collideUp = _tile.collideUp ? true : colTile.collideUp;
                    colTile.collideRight = _tile.collideRight ? true : colTile.collideRight;
                    colTile.collideDown = _tile.collideDown ? true : colTile.collideDown;
                    colTile.collideLeft = _tile.collideLeft ? true : colTile.collideLeft;
                    //colTile.collides = tile.collides ? true : colTile.collides;*/

                    // console.log("TILE", colTile);
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
            //  map.calculateFaces(colLayerIndex);

            //return collisionLayer ? collisionLayer : null;
            console.log(map.layers[colLayerIndex]);
        }
    }, {
        key: "setLayerLevel",
        value: function setLayerLevel(layer, level) {
            layer.level = level;
        }
    }, {
        key: "addStairs",
        value: function addStairs(obj) {
            this.stairs.push({
                x: obj.x / 8,
                y: obj.y / 8 - 2,
                width: obj.width / 8,
                height: obj.height / 8
            });
        }
    }]);

    return World;
}();

exports.default = World;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author       Niklas Berg <nkholski@niklasberg.se>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright    2018 Niklas Berg
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license      {@link https://github.com/nkholski/phaser3-animated-tiles/blob/master/LICENSE|MIT License}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

//
// This plugin is based on Photonstorms Phaser 3 plugin template with added support for ES6.
// 

var _world = __webpack_require__(2);

var _world2 = _interopRequireDefault(_world);

var _tilemap = __webpack_require__(0);

var _tilemap2 = _interopRequireDefault(_tilemap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridPhysics = function () {
    function GridPhysics(scene) {
        _classCallCheck(this, GridPhysics);

        Phaser.Physics.GridPhysics = this;
        //  The Scene that owns this plugin
        this.scene = scene;
        this.world = new _world2.default();
        this.tilemap = new _tilemap2.default();
        scene.gridPhysics = this;
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted) {
            scene.sys.events.once('boot', this.boot, this);
        }
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.


    _createClass(GridPhysics, [{
        key: 'boot',
        value: function boot() {
            var eventEmitter = this.systems.events;
            eventEmitter.on('update', this.update, this);
            eventEmitter.on('postupdate', this.postUpdate, this);
            eventEmitter.on('shutdown', this.shutdown, this);
            eventEmitter.on('destroy', this.destroy, this);
        }
    }, {
        key: 'postUpdate',
        value: function postUpdate(time, delta) {
            this.world.bodies.forEach(function (body) {
                body.postUpdate();
            });
        }
    }, {
        key: 'update',
        value: function update(time, delta) {
            this.world.update(time, delta);
        }
        //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.

    }, {
        key: 'shutdown',
        value: function shutdown() {}

        //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.

    }, {
        key: 'destroy',
        value: function destroy() {
            this.shutdown();
            this.scene = undefined;
        }
    }]);

    return GridPhysics;
}();

;

//  Static function called by the PluginFile Loader.
GridPhysics.register = function (PluginManager) {
    //  Register this plugin with the PluginManager, so it can be added to Scenes.
    PluginManager.register('GridPhysics', GridPhysics, 'GridPhysics');
};

module.exports = GridPhysics;

/***/ })
/******/ ]);
});