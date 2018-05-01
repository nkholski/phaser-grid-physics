# Grid Physics for Phaser

The Grid Physics plugin for Phaer is to Arcade physics what Arcade physics is to Matter.js. :-) The plugin adds support for grid/tile based movement along with some other stuff to make your life easier doing games with grid restricted movement. My aim is to build the API as close as possible to Arcade physics.

The plugin is being developed and there are both bugs and missing features. I'm making this to use it in a RPG project. That means that I'll prioritize those parts I need and that bugs that isn't an issue for my own game isn't attended. One example is that objects migth fly away if they are pushed by severeral bodies at once. If you run into issues that you would like addressed, please open an issue here.

**WARNING: Current state of the plugin** I've done the most basic port from Phaser 2 to Phaser 3. The source is a bit messy but it's a start and enough to run my example demo. Parts of the plugin isn't prepared for general use and contain shortcuts to get the demo running. These shortcuts is all related to the tilemap implementation: A 8x8 pixel grid with 16x16 pixel tiles is required to get all features working, probably also a maximum height of two levels. My next focus will be pathfinding and then cleaning up stuff to make it better prepared for general use.

**Setup instructions** is in the end of this file.

**Demo** Current version is hosted here: http://metroid.niklasberg.se/P3GridPhysics/
(The Phaser 2 demo with pathfinding support not yet added to the Phaser 3 version:  http://metroid.niklasberg.se/gridPhysics/)

**Discuss** Questions, feedback, requests or and other stuff related to the plugin: http://www.html5gamedevs.com/topic/37156-grid-physics-plugin-for-phaser-3/

## Credits
* Tileset and sprites: Dawnlike by DragonDePlatino, DawnBringer. http://opengameart.org/content/dawnlike-16x16-universal-rogue-like-tileset-v181
* Hero sprite by Gazer: http://opengameart.org/content/overhead-action-rpg-characters
* I don't remember the source for the box graphics.

## This plugin vs a quick custom solution
Grid based movement isn't very complicated (Move your sprite one step to the right: "sprite.x+=gridUnitWidth"). The purpose with this plugin is to do this in a stable way, allowing animations without resorting to tweens, collision detection, one-way-tiles, movable objects, turn-based time, path finding and loads of methods and properties tied to the grid physics body. It will be an asset for anyone doing an 8-bit style RPG, puzzle games (like "The adventures of Lolo" on NES or Sokoban), retro action rpg (like "Zelda" on NES), rouge like games, retro platformers (like Castlequest on MSX (minus gravity for now)) strategy and board games.

## Features
* Any grid size  (not necessarily squares, i.e. 8x16 is possible, and not restricted to sprite or tile sizes).
* *Tilemap:*
   * Tile dimensions may differ from grid dimensions (but needs to be multiple of the grid dimensions, like 16x16 tiles on an 8x8 grid).
   * Tile collisions: normal, on specified directions only and against leaving tile in any direction.
* *Bodies (sprites):*
   * Body size is not restricted to grid-size, and different body sizes may co-exist (but must be equal or a multiple of grid dimensions. The sprite graphics may differ from body size, like an 18x18 sprite with an 16x16 pixel body.)
   * Moveable objects (can be chained, i.e. the player push one crate against another crate that will also move).
   * Mass (and strength that limit total mass that can be pushed by the power of one sprite)
   * Velocity, ("struggle" property that can slow down a body based on mass pushed)
   * Populated properties like isMoving.x (boolean) or isBlocked.top (boolean).

## Upcoming features
* Turn-based or real-time. 
* Visual debugging
* Collision callbacks.
* Path finding (hopefully without external dependencies)

## Future features
Depending on the interest I may add extra features. Some of the features is quick-fixes that I just typed down to remember them, others will be a bit more challenging. Possible ideas in no particular order:

* *Tilemap:*
   * Ground types: Slippery, slowdown (factor), moving
   * getPath(x,y,x2,y2)
   * noExitTop (etc) - As collide but prevent from leaving a tile in a direction.
* *Body:*
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
   * Conjoined bodies
   * Gravity.x/y
   * Pause
   * MoveCountToXY - numbers of moves necessarily (using pathfinding)
   * JumpToXY - Move to XY without collision detection
   * NextPossible - Move to next free space in given direction.
   * Body.onCollide, stopVelocityOnCollide
   * Support for non-linear velocities (like tweens)
   * Properties: blocked.left/right/up/down, isMoving, isPushing, massPushed
   * Trying to go x,y simulanously - If x wont work, try y.
   * forcedMovement (being pushed overrides the the desired velocioty of the object)