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
require.register("demo/debugGUI.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debugGUI = function (_dat$GUI) {
    _inherits(debugGUI, _dat$GUI);

    function debugGUI() {
        _classCallCheck(this, debugGUI);

        var _this = _possibleConstructorReturn(this, (debugGUI.__proto__ || Object.getPrototypeOf(debugGUI)).call(this));

        _this.value = 0;
        _this.listen = 0;

        return _this;
    }

    _createClass(debugGUI, [{
        key: 'setupGUI',
        value: function setupGUI(that) {

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
    }]);

    return debugGUI;
}(dat.GUI);

exports.default = debugGUI;

});

require.register("demo/main.js", function(exports, require, module) {
'use strict';

var _Boot = require('./states/Boot');

var _Boot2 = _interopRequireDefault(_Boot);

var _Game = require('./states/Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.EasyStar = require('easystarjs');

var Game = function (_Phaser$Game) {
  _inherits(Game, _Phaser$Game);

  function Game() {
    _classCallCheck(this, Game);

    var width = document.documentElement.clientWidth > 400 ? 400 : document.documentElement.clientWidth;
    var height = Math.round(0.6 * width);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, width, height, Phaser.CANVAS, 'content', null, false, false));

    _this.state.add('Boot', _Boot2.default, false);
    _this.state.add('Game', _Game2.default, false);
    _this.state.start('Boot');
    return _this;
  }

  return Game;
}(Phaser.Game);

window.game = new Game();

});

require.register("demo/sprites/generic_enemy.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericEnemy = function (_Phaser$Sprite) {
  _inherits(GenericEnemy, _Phaser$Sprite);

  function GenericEnemy(_ref) {
    var game = _ref.game,
        x = _ref.x,
        y = _ref.y,
        family = _ref.family,
        id = _ref.id;

    _classCallCheck(this, GenericEnemy);

    var _this = _possibleConstructorReturn(this, (GenericEnemy.__proto__ || Object.getPrototypeOf(GenericEnemy)).call(this, game, x, y, "sprites"));

    _this.animations.add("animation", [family + "/" + family + 0 + "-" + id, family + "/" + family + 1 + "-" + id], 5, true);
    _this.game = game;
    _this.exists = true;
    _this.reset(x, y);
    _this.play("animation");
    _this.game.physics.gridPhysics.enable(_this);
    _this.body.immovable = true;
    _this.body.collideWorldBounds = true;
    _this.game.add.existing(_this);
    _this.turnSteps = _this.body.activeSteps + 1;
    return _this;
  }

  _createClass(GenericEnemy, [{
    key: "update",
    value: function update() {
      if (!this.body.myTurn && this.body.physics.turnbased) {
        return;
      }
      if (this.turnSteps == 1) {
        this.turnSteps = 0;
        this.body.physics.nextTurn(this.body);
      }
      if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0) && Math.random() < 0.1) {
        return;
      }
      if (this.body.physics.turnbased) {
        this.body.baseVelocity = 75;
      } else {
        this.body.baseVelocity = 20;
      }
      var velx = 0,
          vely = 0;
      switch (Math.round(Math.random() * 3)) {
        case 0:
          velx = this.body.baseVelocity;
          break;
        case 1:
          velx = -this.body.baseVelocity;
          break;
        case 2:
          vely = this.body.baseVelocity;
          break;
        case 3:
          vely = -this.body.baseVelocity;
          break;
      }
      this.body.setVelocity(velx, vely);
      if (this.body.physics.turnbased) {
        this.turnSteps++;
      }
    }
  }]);

  return GenericEnemy;
}(Phaser.Sprite);

exports.default = GenericEnemy;

});

require.register("demo/states/Boot.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preload = function (_Phaser$State) {
    _inherits(Preload, _Phaser$State);

    function Preload() {
        _classCallCheck(this, Preload);

        return _possibleConstructorReturn(this, (Preload.__proto__ || Object.getPrototypeOf(Preload)).apply(this, arguments));
    }

    _createClass(Preload, [{
        key: 'preload',
        value: function preload() {
            this.game.load.image('enemy', './assets/images/enemy.png');
            this.game.load.image('basictiles', './assets/images/basictiles.png');
            this.game.load.tilemap('map', './assets/maps/demo.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.atlas('sprites', 'assets/spriteatlas/sprites.png', 'assets/spriteatlas/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        }
    }, {
        key: 'create',
        value: function create() {
            this.game.smoothed = false;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(400, 240, 400 * 3, 240 * 3);
            this.game.load.onLoadComplete.add(this.loadComplete, this);
            this.loadComplete();
        }
    }, {
        key: 'loadComplete',
        value: function loadComplete() {
            this.state.start('Game');
        }
    }]);

    return Preload;
}(Phaser.State);

exports.default = Preload;

});

require.register("demo/states/Game.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gridPhysics = require('../../plugin/gridPhysics/gridPhysics');

var _gridPhysics2 = _interopRequireDefault(_gridPhysics);

var _generic_enemy = require('../sprites/generic_enemy');

var _generic_enemy2 = _interopRequireDefault(_generic_enemy);

var _debugGUI = require('../debugGUI');

var _debugGUI2 = _interopRequireDefault(_debugGUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameState = function (_Phaser$State) {
    _inherits(GameState, _Phaser$State);

    function GameState(game) {
        _classCallCheck(this, GameState);

        var _this = _possibleConstructorReturn(this, (GameState.__proto__ || Object.getPrototypeOf(GameState)).call(this, game));

        _this.game = game;
        return _this;
    }

    _createClass(GameState, [{
        key: 'create',
        value: function create() {
            var game = this.game;
            window.game = game;

            game.plugins.add(new _gridPhysics2.default(this.game));
            game.physics.gridPhysics.gridSize.set(8);
            this.debugGfx = game.physics.gridPhysics.debugGfx;
            this.physics = game.physics.gridPhysics;

            game.map = game.add.tilemap('map', 16, 16);
            var map = game.map;
            this.map = map; // wierd: game.map, map and this.map. FIX

            map.addTilesetImage('basictiles');
            var layer = map.createLayer("ground");
            layer = map.createLayer("onGround");
            game.physics.gridPhysics.enable(layer);

            for (var y = 0; y < layer.layer.data.length; y++) {
                for (var x = 0; x < layer.layer.data[y].length; x++) {
                    var tile = layer.layer.data[y][x];
                    if (tile.index === -1) {
                        continue;
                    }
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Object.keys(tile.properties)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _property = _step.value;

                            if (tile.hasOwnProperty(_property) || _property.indexOf("blocked") === 0) {
                                if (_property.indexOf("blocked") > -1) {
                                    console.log("blocked" + _property);
                                }

                                tile[_property] = tile.properties[_property];
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

                    if (tile.properties.collide) {
                        var _arr = ["collideUp", "collideRight", "collideDown", "collideLeft"];

                        for (var _i = 0; _i < _arr.length; _i++) {
                            var property = _arr[_i];
                            tile[property] = true;
                        }
                    }
                }
            }
            layer.updateBlocked();

            layer.resizeWorld();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.map.objects.objects[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var crateObj = _step2.value;


                    var anim = "box";
                    if (crateObj.properties && crateObj.properties.box) {
                        anim += crateObj.properties.box;
                    }

                    var crate = game.add.sprite(crateObj.x, crateObj.y - 16, 'sprites');
                    crate.animations.add("box", [anim], 5, false);
                    crate.play("box");
                    if (crateObj.properties && crateObj.properties.scale) {
                        crate.width = 16 * crateObj.properties.scale;
                        crate.height = 16 * crateObj.properties.scale;
                    } else {
                        crate.width = 16;
                        crate.height = 16;
                    }

                    crate.smoothed = false;
                    game.physics.gridPhysics.enable(crate);
                    crate.body.collideWorldBounds = true;

                    if (crateObj.properties && crateObj.properties.mass) {
                        crate.body.mass = crateObj.properties.mass;
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

            this.enemy = new _generic_enemy2.default({
                game: game,
                x: 6 * 16,
                y: 0,
                family: "humanoid",
                id: "4-2"
            });
            this.enemy.body.strength = 1000;

            /*this.enemy2 = new GenericEnemy({
                game,
                x: 9*16,
                y: 4*16,
                family: "humanoid",
                id: "5-6"
            });
            this.enemy2.body.strength = 0;*/

            game.hero = game.add.sprite(320, 25 + 8, 'sprites');
            game.hero.animations.add("down", ["hero/hero-down-0", "hero/hero-down-1"], 5, true);
            game.hero.animations.add("right", ["hero/hero-right-0", "hero/hero-right-1"], 5, true);
            game.hero.animations.add("left", ["hero/hero-left-0", "hero/hero-left-1"], 5, true);
            game.hero.animations.add("up", ["hero/hero-up-0", "hero/hero-up-1"], 5, true);
            game.hero.animations.add("hit-down", ["hero/hero-hit-down-0", "hero/hero-hit-down-1", "hero/hero-hit-down-2", "hero/hero-hit-down-3"], 15, false);
            game.hero.animations.add("hit-right", ["hero/hero-hit-right-0", "hero/hero-hit-right-1", "hero/hero-hit-right-2", "hero/hero-hit-right-3"], 15, false);
            game.hero.animations.add("hit-left", ["hero/hero-hit-left-0", "hero/hero-hit-left-1", "hero/hero-hit-left-2", "hero/hero-hit-left-3"], 15, false);
            game.hero.animations.add("hit-up", ["hero/hero-hit-up-0", "hero/hero-hit-up-1", "hero/hero-hit-up-2", "hero/hero-hit-up-3"], 15, false);
            game.hero.play("down");
            game.physics.gridPhysics.enable(game.hero);
            game.hero.body.player = true;
            game.hero.body.baseVelocity = 75;
            game.hero.body.strength = 10;
            game.hero.body.maxCue = 10;
            game.hero.debugger = false;
            game.hero.body.collideWorldBounds = true;
            game.hero.body.immovable = true;

            game.marker = game.add.sprite(0, 0, 'sprites');
            game.marker.animations.add("blink", ["marker/blink1", "marker/blink2"], 5, true);
            game.marker.play("blink");

            this.cursors = game.input.keyboard.createCursorKeys();
            this.renderGrid = false;
            if (!this.debugGUI) {
                this.debugGUI = new _debugGUI2.default();
            }
            this.debugGUI.setupGUI(this);
            game.input.mouse.capture = true;
            this.physics.addToQue(this.enemy);
            //  this.physics.addToQue(this.enemy2);

            this.physics.addToQue(game.hero);
            this.physics.nextTurn();
            game.hero.body.turnSteps = game.hero.body.activeSteps + 1;
        }
    }, {
        key: 'update',
        value: function update() {
            var game = this.game;
            var hero = this.game.hero;

            if (!hero.body.myTurn && hero.body.physics.turnbased) {
                return;
            }
            game.hero.body.setVelocity(0, 0);

            if (hero.body.activeSteps >= hero.body.turnSteps) {
                hero.body.turnSteps = hero.body.activeSteps + 1;

                this.physics.nextTurn(hero.body);
            }

            game.marker.x = 8 * Math.round(game.input.activePointer.x / 8);
            game.marker.y = 8 * Math.round(game.input.activePointer.y / 8);

            var anim = "";
            switch (hero.body.facing) {
                case Phaser.UP:
                    anim = "up";
                    break;
                case Phaser.RIGHT:
                    anim = "right";
                    break;
                case Phaser.DOWN:
                    anim = "down";
                    break;
                case Phaser.LEFT:
                    anim = "left";
                    break;
            }

            if (hero.body.struggling) {
                anim = "hit-" + anim;
            }

            hero.play(anim);
            if (!hero.body.struggling && !hero.body.isMoving.any) {
                hero.animations.stop();
            }

            var vel = game.hero.body.baseVelocity;

            if (game.input.activePointer.isDown) {
                hero.body.moveToPixelXY(game.input.activePointer.x, game.input.activePointer.y, vel);
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                game.hero.body.setVelocity(-vel, 0);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                game.hero.body.setVelocity(vel, 0);
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                game.hero.body.setVelocity(0, -vel);
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                game.hero.body.setVelocity(0, vel);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.game.hero.debugger) {
                this.game.hero.body.renderDebugBody();
            }
        }
    }]);

    return GameState;
}(Phaser.State);

exports.default = GameState;

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=demo.js.map