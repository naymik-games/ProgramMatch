class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {


  }
  create() {

    /* gameData = JSON.parse(localStorage.getItem('pmData'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('pmData', JSON.stringify(defaultData));
      gameData = defaultData;
    }*/
    saveData = JSON.parse(localStorage.getItem('pmSave'));
    if (saveData === null || saveData.length <= 0) {
      localStorage.setItem('pmSave', JSON.stringify(defaultSave));
      saveData = defaultSave;
    }
    this.cameras.main.setBackgroundColor(0x282828);

    var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'codeClear', 120).setOrigin(.5).setTint(0x00ff66);

    var startTime = this.add.bitmapText(game.config.width / 2 - 75, 275, 'topaz', 'let newGame >', 70).setOrigin(0, .5).setTint(0xffffff);
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);

    var laodTime = this.add.bitmapText(game.config.width / 2 - 75, 575, 'topaz', 'let loadGame >', 70).setOrigin(0, .5).setTint(0xffffff);
    laodTime.setInteractive();
    laodTime.on('pointerdown', this.clickHandler2, this);
    // var laodTime = this.add.bitmapText(game.config.width / 2 - 75, 675, 'topaz', saveData.score + ' Points on Level ' + saveData.level, 50).setOrigin(0, .5).setTint(0xffffff);
  }
  clickHandler() {
    load = false;
    this.scene.start('PlayGame');
    //this.scene.launch('UI');
  }
  clickHandler2() {
    load = true;
    this.scene.start('PlayGame');
    //this.scene.launch('UI');
  }

}