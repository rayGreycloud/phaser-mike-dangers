class PlayGame {
  constructor(game) {
    this.game = game;
  }

  create() {
    this.gameOver = false;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.canJump = true;
    this.isClimbing = false;
    this.defineGroups();
    this.drawLevel();
    this.defineTweens();
    game.input.onTap.add(this.handleTap, this);
  }

  drawLevel() {
    this.currentFloor = 0;
    this.currentLadder = 0;
    this.highestFloorY = game.height * gameOptions.floorStart;
    this.floorArray = [];
    this.ladderArray = [];
    this.diamondArray = [
      []
    ];
    this.diamondPool = [];
    this.spikeArray = [
      []
    ];
    this.spikePool = [];
    while (this.highestFloorY > - 3 * gameOptions.floorGap) {
      this.addFloor();
      this.addLadder();
      if (this.currentFloor > 0) {
        this.addDiamond();
        this.addSpikes();
      }
      this.highestFloorY -= gameOptions.floorGap;
      this.currentFloor++;
    }
    this.currentFloor = 0;
    this.addHero();
  }

  addSpikes() {
    this.spikeArray[this.currentFloor] = [];
    this.addSpike();
    if (game.rnd.integerInRange(0, gameOptions.doubleSpikeRatio) == 0) {
      this.addSpike();
    }
  }

  addSpike() {
    var spike = game.add.sprite(game.rnd.integerInRange(50, game.width - 50), this.highestFloorY - 20, "spike");
    spike.anchor.set(0.5, 0);
    game.physics.enable(spike, Phaser.Physics.ARCADE);
    spike.body.immovable = true;
    this.spikeGroup.add(spike);
    this.spikeArray[this.currentFloor].push(spike);
  }

  addDiamond() {
    this.diamondArray[this.currentFloor] = [];
    if (game.rnd.integerInRange(0, gameOptions.diamondRatio) != 0) {
      var diamond = game.add.sprite(game.rnd.integerInRange(50, game.width - 50), this.highestFloorY - gameOptions.floorGap / 2, "diamond");
      diamond.anchor.set(0.5, 0);
      game.physics.enable(diamond, Phaser.Physics.ARCADE);
      diamond.body.immovable = true;
      this.diamondGroup.add(diamond);
      this.diamondArray[this.currentFloor].push(diamond);
    }
  }

  reviveDiamond() {
    if (game.rnd.integerInRange(0, gameOptions.diamondRatio) != 0) {
      if (this.diamondPool.length > 0) {
        var diamond = this.diamondPool.pop();
        diamond.revive();
        diamond.y = this.highestFloorY + gameOptions.floorGap - gameOptions.floorGap / 2;
        this.diamondArray[this.prevFloor].push(diamond);
      } else {
        var diamond = game.add.sprite(game.rnd.integerInRange(50, game.width - 50), this.highestFloorY + gameOptions.floorGap - gameOptions.floorGap / 2, "diamond");
        diamond.anchor.set(0.5, 0);
        game.physics.enable(diamond, Phaser.Physics.ARCADE);
        diamond.body.immovable = true;
        this.diamondGroup.add(diamond);
        this.diamondArray[this.prevFloor].push(diamond);
      }
    }
  }

  reviveSpike() {
    var spikes = 1;
    if (game.rnd.integerInRange(0, gameOptions.doubleSpikeRatio) == 0) {
      spikes = 2;
    }
    for (var i = 1; i <= spikes; i++) {
      if (this.spikePool.length > 0) {
        var spike = this.spikePool.pop();
        spike.y = this.highestFloorY + gameOptions.floorGap - 20;
        spike.revive();
        this.spikeArray[this.prevFloor].push(spike);
      } else {
        var spike = game.add.sprite(game.rnd.integerInRange(50, game.width - 50), this.highestFloorY + gameOptions.floorGap - 20, "spike");
        spike.anchor.set(0.5, 0);
        game.physics.enable(spike, Phaser.Physics.ARCADE);
        spike.body.immovable = true;
        this.spikeGroup.add(spike);
        this.spikeArray[this.prevFloor].push(spike);
      }
    }
  }

  addFloor() {
    var floor = game.add.sprite(0, this.highestFloorY, "ground");
    this.floorGroup.add(floor);
    game.physics.enable(floor, Phaser.Physics.ARCADE);
    floor.body.immovable = true;
    floor.body.checkCollision.down = false;
    this.floorArray.push(floor);
  }

  addLadder() {
    var ladder = game.add.sprite(game.rnd.integerInRange(50, game.width - 50), this.highestFloorY - gameOptions.floorGap, "ladder");
    this.ladderGroup.add(ladder);
    ladder.anchor.set(0.5, 0);
    game.physics.enable(ladder, Phaser.Physics.ARCADE);
    ladder.body.immovable = true;
    this.ladderArray.push(ladder);
  }

  addHero() {
    this.hero = game.add.sprite(game.width / 2, game.height * gameOptions.floorStart - 40, "hero");
    this.gameGroup.add(this.hero)
    this.hero.anchor.set(0.5, 0);
    game.physics.enable(this.hero, Phaser.Physics.ARCADE);
    this.hero.body.collideWorldBounds = true;
    this.hero.body.gravity.y = gameOptions.playerGravity;
    this.hero.body.velocity.x = gameOptions.playerSpeed;
    this.hero.body.onWorldBounds = new Phaser.Signal();
    this.hero.body.onWorldBounds.add(function(sprite, up, down, left, right) {
      if (left) {
        this.hero.body.velocity.x = gameOptions.playerSpeed;
        this.hero.scale.x = 1;
      }
      if (right) {
        this.hero.body.velocity.x = -gameOptions.playerSpeed;
        this.hero.scale.x = -1;
      }
      if (down) {
        game.state.start("PlayGame");
      }
    }, this)
  }

  defineTweens() {
    this.scrollTween = game.add.tween(this.gameGroup).to({
      y: gameOptions.floorGap
    }, 800, Phaser.Easing.Cubic.Out);
    this.scrollTween.onComplete.add(function () {
      this.gameGroup.y = 0;
      this.gameGroup.forEach(function(item) {
        if (item.length > 0) {
          item.forEach(function(subItem) {
            subItem.y += gameOptions.floorGap;
          }, this);
        } else {
          item.y += gameOptions.floorGap;
        }
      }, this);
    }, this);
    this.fallingLevelTween = game.add.tween(this.fallingLevelGroup).to({
      y: game.height / 2
    }, 500, Phaser.Easing.Cubic.Out);
    this.fallingLevelTween.onComplete.add(function () {
      var numChildren = this.fallingLevelGroup.total;
      for (var i = numChildren - 1; i >= 0; i--) {
        switch (this.fallingLevelGroup.children[i].key) {
          case "ladder":
            this.ladderGroup.children[this.ladderGroup.total - 1].y = this.highestFloorY;
            break;
          case "ground":
            this.floorGroup.children[this.floorGroup.total - 1].y = this.highestFloorY + gameOptions.floorGap;
            break;
          case "diamond":
            this.diamondGroup.add(this.fallingLevelGroup.children[i]);
            this.killDiamond(Phaser.Math.wrap(this.currentFloor - 1, 0, this.floorArray.length));
            break;
          case "spike":
            this.spikeGroup.add(this.fallingLevelGroup.children[i]);
            this.killSpike(Phaser.Math.wrap(this.currentFloor - 1, 0, this.floorArray.length));
        }
      }
      this.fallingLevelGroup.y = 0;
      this.reviveDiamond();
      this.reviveSpike();
    }, this)
  }

  defineGroups() {
    this.gameGroup = game.add.group();
    this.floorGroup = game.add.group();
    this.ladderGroup = game.add.group();
    this.diamondGroup = game.add.group();
    this.spikeGroup = game.add.group();
    this.fallingLevelGroup = game.add.group();
    this.gameGroup.add(this.floorGroup);
    this.gameGroup.add(this.ladderGroup);
    this.gameGroup.add(this.diamondGroup);
    this.gameGroup.add(this.spikeGroup);
    this.gameGroup.add(this.fallingLevelGroup);
  }

  handleTap(pointer, doubleTap) {
    if (this.canJump && !this.isClimbing && !this.gameOver) {
      this.hero.body.velocity.y = -gameOptions.playerJump;
      this.canJump = false;
    }
  }

  update() {
    if (!this.gameOver) {
      this.checkFloorCollision();
      this.checkLadderCollision();
      this.checkDiamondCollision();
      this.checkSpikeCollision();
      this.heroOnLadder();
    }
  }

  checkFloorCollision() {
    game.physics.arcade.collide(this.hero, this.floorArray[this.currentFloor], function() {
      this.canJump = true;
    }, null, this);
  }

  checkLadderCollision() {
    game.physics.arcade.overlap(this.hero, this.ladderArray, function(player, ladder) {
      if (!this.isClimbing && Math.abs(player.x - ladder.x) < 10) {
        this.hero.body.velocity.x = 0;
        this.hero.body.velocity.y = -gameOptions.climbSpeed;
        this.hero.body.gravity.y = 0;
        this.isClimbing = true;
        this.scrollTween.start();
      }
    }, null, this);
  }

  checkDiamondCollision() {
    game.physics.arcade.overlap(this.hero, this.diamondArray[this.currentFloor], function() {
      this.killDiamond(this.currentFloor);
    }, null, this);
  }

  checkSpikeCollision() {
    game.physics.arcade.overlap(this.hero, this.spikeArray[this.currentFloor], function() {
      this.gameOver = true;
      this.hero.body.velocity.x = game.rnd.integerInRange(-20, 20);
      this.hero.body.velocity.y = -gameOptions.playerJump
    }, null, this);
  }

  killDiamond(floor) {
    for (var i = 0; i < this.diamondArray[floor].length; i++) {
      this.diamondArray[floor][i].kill();
      this.diamondPool.push(this.diamondArray[floor][i]);
    }
    this.diamondArray[floor] = [];
  }

  killSpike(floor) {
    for (var i = 0; i < this.spikeArray[floor].length; i++) {
      this.spikeArray[floor][i].kill();
      this.spikePool.push(this.spikeArray[floor][i]);
    }
    this.spikeArray[floor] = [];
  }

  heroOnLadder() {
    if (this.isClimbing && this.hero.y <= this.floorArray[this.currentFloor].y - gameOptions.floorGap - 40) {
      this.hero.body.gravity.y = gameOptions.playerGravity;
      this.hero.body.velocity.x = gameOptions.playerSpeed * this.hero.scale.x;
      this.hero.body.velocity.y = 0;
      this.isClimbing = false;
      this.fallingLevelGroup.add(this.floorArray[this.currentFloor]);
      this.fallingLevelGroup.add(this.ladderArray[this.currentFloor]);
      for (var i = 0; i < this.diamondArray[this.currentFloor].length; i++) {
        this.fallingLevelGroup.add(this.diamondArray[this.currentFloor][i]);
      }
      for (i = 0; i < this.spikeArray[this.currentFloor].length; i++) {
        this.fallingLevelGroup.add(this.spikeArray[this.currentFloor][i]);
      }
      this.fallingLevelGroup
      this.fallingLevelTween.start();
      this.prevFloor = this.currentFloor;
      this.currentFloor = Phaser.Math.wrap(this.currentFloor + 1, 0, this.floorArray.length);
    }
  }
}
