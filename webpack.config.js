const path = require('path');

module.exports = {
  entry: './build/GameLogic/Game.js',
  output: {
    path: path.resolve(__dirname, 'resources/scripts'),
    filename: 'GameBundle.js',
	library: "GameBundle",
  },
};
