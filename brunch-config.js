// See http://brunch.io for documentation.

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'gridPhysics.js':       /^app\/plugin/,
        'demo/demo.js':   /^app\/demo/,
        'demo/vendor.js': /(^bower_components|node_modules|vendor)\//
      }
    }
  },
  npm: {
    static: [
      'node_modules/dat.gui/build/dat.gui.js',
      'node_modules/phaser-ce/build/phaser.js',
    ]
  },
  paths: {
    public: 'dist'
  },
  plugins: {
    babel: {
      ignore: /^(bower_components|node_modules|vendor)/
    }
  }
};
