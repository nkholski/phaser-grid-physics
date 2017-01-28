## Grid Physics for Phaser

The Grid Physics plugin is to Arcade physics what Arcade physics is to BOX2D. :-) This plugin adds support for grid/tile based movement along with some other stuff to make your life easier if you choose the path of grid restricted movement. My aim is to build the API as close as possible to Arcade physics.

Please note that the plugin is not suitable for production use yet. Buildning stand-alone plugin is not yet working, but you can import the source files into your project as long you have something set up that support imports and ES6/2005. The API is not set in stone. Ideas are added randomly, and probably not in the smartest way from start. The demo is based on a prototype for a game and will need to be replaced or reworked. A lot of comments are in Swedish, and the source is largely uncommented. I added it to Github to allow others to try it, and to invite anyone interested to contribute.

Help wanted! I'm stuck at making a way to build stand-alone plugin for others to use. My idea is to keep developing the plugin as a part of the demo project. If possible I want the source for the plugin in a src folder in the root folder, and the demo in a demo-source folder. I would like to be able to build the plugin so that ends up in in the dist folder.

# Credits
* Project is based on Phaser-ES6-Webpack by Leandro Cabrera: https://github.com/lean/phaser-es6-webpack
* Tileset and sprites: Dawnlike by DragonDePlatino, DawnBringer. http://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181
* Hero by Gazer: http://opengameart.org/content/overhead-action-rpg-characters
* I don't remember the source for the box graphics.

# This plugin vs a quick custom solution
Grid based movement isn't very complicated (Move your sprite one step to the right: "sprite.x+=gridUnitWidth"). The purpose with this plugin is to do this in a stable way, allowing animations without resorting to tweens, collision detection, one-way-tiles, movable objects, turn-based time, path finding and loads of methods and properties tied to the grid physics body. It will be an asset for anyone doing a RPG, puzzle games (like "The adventures of Lolo" on NES or Sokoban), retro action rpg (like "Zelda" on NES), rouge like games, retro platformers (like Castlequest on MSX (minus gravity for now)) strategy and board games.

# Features
* Any grid size  (not necessarily squares, i.e. 8x16 is possible, and not restricted to sprite or tile-sizes).
* Turn-based or real time.
* Visual debugging
* *Tilemap:*
   * Tile dimensions may differ from grid dimensions (but needs to be multiple of the grid dimensions, like 16x16 tiles on an 8x8 grid).
   * Collision detection against tiles with callback.
   * Tile collisions on specified directions only
* *Bodies (sprites):*
   * Body size is not restricted to grid-size, and different body sizes may co-exist (but must be equal or a multiple of grid dimensions. The sprite graphics may differ from body size.)
   * Path finding (easystar.js depencency)
   * Moveable objects (can be chained, i.e. the player push one crate against another crate that will also move).
   * Mass (and strength that limit total mass that can be pushed by the power of one sprite)
   * Velocity, ("struggle" property that can slow down a body based on mass pushed)
   * Populated properties like isMoving.x (boolean) or isBlocked.top (boolean).

# Code examples (expect changes)
* Init 8x8 grid physics:
```javascript
this.game.plugins.add(new GridPhysics(this.game));
game.physics.gridPhysics.gridSize.set(8);
```

* Enable grid collision on a tile map layer:
```javascript
game.physics.gridPhysics.enable(layer);
```

* Enable grid body on sprite:
```javascript
game.physics.gridPhysics.enable(sprite);
```

* Try to move a sprite to the right with 50px/s (collision detection with all solid objects and tilemaps is built-in):
```javascript
sprite.body.setVelocity(50, 0);
```

# Known annoying bugs
* Pushing bodies that already has a velocity might cause unexpected results.
* Pathfinding still struggles with one-way-tiles (but not always).
* Turn-based time wont work with more than two entities. :-O

# Future features
Depending on the interest I may add extra features. Some of the features is quick-fixes that I just typed down to remember them, others will be a bit more challenging. Possible ideas in no particular order:
* **Tilemap:**
   * Ground types: Slippery, slowdown (factor), moving
   * getPath(x,y,x2,y2)
* **Body:**
   * setGridPosition
   * Gestures: Jump, Shake etc.
   * movement.slide - Slide around corners to prevent getting stuck (pressing up with a character with the top right part of the body blocked will result in sliding to the left if it would be possible to walk up in the next step)
   * movement.ZeldaNESMovement - "Free movement" that adjusts the body to a the grid.
   * movement.turn - Allow to turn back in the opposite direction before finishing the ongoing move.
   * movement.margin - Allow new turn when the margin in pixels is left of the last one (default = 0)
   * Callback on collision to bodies and tiles, possibility to cancel collision.
   * standingOn - An array of tiles the body is standing on
   * blocked.dir
   * pushque.dir (oavsett om orkar)
   * Particle collision
   * Arcade-like movements (bullets, random vector)
   * Moving platforms
   * Drag
   * Magnetism
   * Co-joined bodies
   * Gravity.x/y
   * Pause
   * MovesToXY - numbers of moves necessarily (using pathfinding)
   * Body.onCollide, stopVelocityOnCollide
   * Support for non-linear velocities (like tweens)
   * Properties: blocked.left/right/up/down, isMoving, isPushing, massPushed
   * Trying to go x,y simulanously - If x wont work, try y.
   * forcedMovement (being pushed overrides the the desired velocioty of the object)

# Documentation
Not yet. To much is in flux.
