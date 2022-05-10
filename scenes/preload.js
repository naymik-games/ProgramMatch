class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {


    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    //this.load.image("bug2", "assets/particle.png");
    for (var i = 0; i < 125; i++) {
      this.load.image("bug2", "assets/sprites/outline_adb_white_48dp.png");
    }
    this.load.bitmapFont('topaz', "assets/fonts/topaz.png", "assets/fonts/topaz.xml");
    this.load.spritesheet("burst", "assets/sprites/burst.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: gameOptions.gemSize,
      frameHeight: gameOptions.gemSize
    });
    this.load.spritesheet("arrows", "assets/sprites/arrows.png", {
      frameWidth: 100 * 3,
      frameHeight: 100 * 3
    });
    this.load.image("player", "assets/sprites/player.png");
    this.load.image("gem", "assets/sprites/gem.png");
    this.load.image("bug", "assets/sprites/bug.png");
    this.load.image("virus", "assets/sprites/virus.png");
    this.load.image("badge", "assets/sprites/badge.png");
    this.load.image("blank", "assets/sprites/blank.png");
    this.load.image("productivity", "assets/sprites/productivity.png");
    this.load.image("menu", "assets/sprites/menu.png");


  }
  create() {
    this.scene.start("startGame");
    //this.scene.start("PlayGame");

  }
}








