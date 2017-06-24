class PreloadGame {
  constructor(game) {
    this.game = game;
  }

  preload() {
    this.game.stage.backgroundColor = 0xaaeaff;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.stage.disableVisibilityChange = true;
    this.game.load.image("ground", "/assets/ground.png");
    this.game.load.image("hero", "/assets/hero.png");
    this.game.load.image("ladder", "/assets/ladder.png");
    this.game.load.image("diamond", "/assets/diamond.png");
    this.game.load.image("spike", "/assets/spike.png");
  }

  create() {
    this.game.state.start("PlayGame");
  }
}
