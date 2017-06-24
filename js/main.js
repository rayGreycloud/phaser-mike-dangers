// Initialize
let game;
let gameOptions = {
  gameWidth: 800,
  gameHeight: 1300,
  floorStart: 1 / 8 * 5,
  floorGap: 250,
  playerGravity: 10000,
  playerSpeed: 450,
  climbSpeed: 450,
  playerJump: 1800,
  diamondRatio: 10
}

// Access class
let preloadGame = new PreloadGame(game);
let playGame = new PlayGame(game);

window.onload = function () {
  game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
  game.state.add("PreloadGame", preloadGame);
  game.state.add("PlayGame", playGame);
  game.state.start("PreloadGame");
}
