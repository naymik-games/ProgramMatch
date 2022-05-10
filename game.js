let game;

window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 900,
            height: 1640
        },
        scene: [preloadGame, startGame, playGame]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {

    }
    create() {


        this.cameras.main.setBackgroundColor(0x282828);
        this.rows = 11
        this.cols = 7
        this.items = 3
        this.canPick = true;
        this.dragging = false;
        this.totalLines = 0;
        this.moves = 0
        this.experience = 0
        this.score = 0
        this.scoreGoal = 1000
        this.maxMove = 7
        this.onLevel = 1
        this.allowDiagonal = true
        this.draw3 = new Draw3P({
            rows: this.rows,
            columns: this.cols,
            items: this.items,
            diagonal: this.allowDiagonal,
            playerPosition: {
                row: 2,
                column: 2
            }
        });
        gameOptions.boardOffset.x = (game.config.width - gameOptions.gemSize * this.cols) / 2
        this.draw3.generateField();
        this.drawField();

        this.playerBadge = this.add.image(gameOptions.boardOffset.x + gameOptions.gemSize / 2, (gameOptions.boardOffset.y + gameOptions.gemSize * (this.rows) + gameOptions.gemSize / 2) + 50, 'badge')
        this.levelProgressBar = this.add.image(gameOptions.boardOffset.x + gameOptions.gemSize + 15, (gameOptions.boardOffset.y + gameOptions.gemSize * (this.rows) + gameOptions.gemSize / 2) + 60, 'blank').setOrigin(0, .5).setTint(0xffb000)
        this.levelProgressBar.displayWidth = 0;
        this.levelProgressBar.displayHeight = 25;
        this.levelText = this.add.bitmapText((gameOptions.boardOffset.x + gameOptions.gemSize * (this.cols - 1)) + 15, (gameOptions.boardOffset.y + gameOptions.gemSize * (this.rows) + gameOptions.gemSize / 2) + 50, 'topaz', this.onLevel, 60).setOrigin(0, .5).setTint(0x00ff66);


        this.chainLengthText = this.add.bitmapText(50, 1550, 'topaz', 'L: 0', 60).setOrigin(0, .5).setTint(0x00ff66);
        this.totalLinesText = this.add.bitmapText(200, 1550, 'topaz', 'TL: 0', 60).setOrigin(0, .5).setTint(0x00ff66);
        this.totalMovesText = this.add.bitmapText(450, 1550, 'topaz', 'TM: 0', 60).setOrigin(0, .5).setTint(0x00ff66);
        this.experienceText = this.add.bitmapText(650, 1550, 'topaz', 'E: 0', 60).setOrigin(0, .5).setTint(0x00ff66);
        this.scoreText = this.add.bitmapText(50, 1450, 'topaz', 'S: 0', 60).setOrigin(0, .5).setTint(0xffb000);
        this.input.on("pointerdown", this.gemSelect, this);
        this.input.on("pointermove", this.drawPath, this);
        this.input.on("pointerup", this.removeGems, this);

        const config1 = {
            key: 'burst1',
            frames: 'burst',
            frameRate: 20,
            repeat: 0
        };
        this.anims.create(config1);
        this.bursts = this.add.group({
            defaultKey: 'burst',
            maxSize: 30
        });
        this.squareBox = this.add.graphics();
        this.squareBox.lineStyle(10, 0xffffff, 1);
        this.squareBox.fillStyle(0x000000, 0);
        //this.squareBox.lineStyle(10, colors[this.valueAt(this.pathDots[0].row, this.pathDots[0].col)], 1);
        // this.squareBox.fillStyle(colors[this.valueAt(this.pathDots[0].row, this.pathDots[0].col)], .2);
        this.squareBox.strokeRoundedRect(gameOptions.boardOffset.x - 15, gameOptions.boardOffset.y - 15, (gameOptions.gemSize * this.cols) + 30, ((gameOptions.gemSize * this.rows) + 30), 15);

        this.makeMenu()
        //this.squareBox.fillRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);
        this.showToast('hello')
    }
    drawField() {
        this.poolArray = [];
        this.arrowArray = [];
        for (let i = 0; i < this.draw3.getRows(); i++) {
            this.arrowArray[i] = [];
            for (let j = 0; j < this.draw3.getColumns(); j++) {
                let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;
                let item
                // console.log(this.draw3.virusAt(i, j))
                if (this.draw3.valueAt(i, j) == bugValue) {
                    item = this.add.sprite(posX, posY, "bug")
                } else if (this.draw3.virusAt(i, j)) {
                    this.draw3.setVirusDirection(i, j, Phaser.Math.Between(0, 3))
                    item = this.add.sprite(posX, posY, "virus")
                } else if (this.draw3.typeAt(i, j) == 'productivity') {

                    item = this.add.sprite(posX, posY, "productivity").setTint(colors[this.draw3.valueAt(i, j)])
                } else {
                    item = this.draw3.isPlayerAt(i, j) ? this.add.sprite(posX, posY, "player") : this.add.sprite(posX, posY, "gem").setTint(colors[this.draw3.valueAt(i, j)]);
                }
                //let item = this.draw3.isPlayerAt(i, j) ? this.add.sprite(posX, posY, "player") : this.add.sprite(posX, posY, "gem").setTint(colors[this.draw3.valueAt(i, j)]);
                item.setDepth(this.draw3.isPlayerAt(i, j) ? 1 : 0);
                let arrow = this.add.sprite(posX, posY, "arrows");
                arrow.setDepth(2);
                arrow.visible = false;
                this.arrowArray[i][j] = arrow;
                this.draw3.setCustomData(i, j, item);
            }
        }
    }
    gemSelect(pointer) {
        if (this.canPick) {
            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
            if (this.draw3.validPick(row, col) && this.draw3.isPlayerAt(row, col)) {
                this.canPick = false;
                this.draw3.putInChain(row, col)
                this.draw3.customDataOf(row, col).alpha = 0.5;
                this.dragging = true;
            }
        }
    }
    drawPath(pointer) {
        if (this.dragging) {
            let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
            let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
            if (this.draw3.validPick(row, col)) {
                let distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.draw3.customDataOf(row, col).x, this.draw3.customDataOf(row, col).y);
                if (distance < gameOptions.gemSize * 0.4) {
                    if (this.draw3.getChainLength() > this.maxMove) { return }
                    if (this.draw3.nonSelect(row, col)) { return }
                    if (this.draw3.getChainLength() == 1 && this.draw3.typeAt(row, col) == 'productivity') { return }

                    /* if (this.inPath({ row: row, col: col })) {
                        //console.log('back to first')
                        return
                    }
 */

                    if (this.draw3.continuesChain(row, col)) {
                        this.draw3.customDataOf(row, col).alpha = 0.5;
                        this.draw3.putInChain(row, col);

                        this.chainLengthText.setText('L: ' + this.draw3.getChainLength())
                        this.displayPath()
                    }
                    else {
                        if (this.draw3.backtracksChain(row, col)) {
                            let removedItem = this.draw3.removeLastChainItem();
                            this.draw3.customDataOf(removedItem.row, removedItem.column).alpha = 1;
                            this.hidePath();
                            this.displayPath();
                        }
                    }
                }
            }
        }
    }
    inPath(dot) {

        if (this.isSame(this.draw3.getNthChainItem(0), dot)) {
            return true;
        }
        return false;
    }
    isSame(one, two) {
        return one.row == two.row && one.column == two.col
    }
    removeGems() {
        if (this.dragging) {
            this.hidePath();
            var moveLines = this.draw3.getChainLength()
            this.totalLines += this.draw3.getChainLength()
            this.totalLinesText.setText('TL: ' + this.totalLines)
            this.chainLengthText.setText('L: 0')
            this.dragging = false;
            if (this.draw3.getChainLength() < 2) {
                let chain = this.draw3.emptyChain();
                chain.forEach(function (item) {
                    this.draw3.customDataOf(item.row, item.column).alpha = 1;
                }.bind(this));
                this.canPick = true;
            }
            else {
                this.colorBombs = []
                this.moves++



                this.score += moveLines * this.experience
                this.updateStats()
                this.playerStep();
            }
        }
    }

    playerStep() {
        let playerMovement = this.draw3.movePlayer();
        //console.log(playerMovement)
        if (playerMovement) {
            let player = this.draw3.customDataOf(playerMovement.from.row, playerMovement.from.column);
            player.alpha = 1;
            this.tweens.add({
                targets: player,
                x: player.x + (playerMovement.from.column - playerMovement.to.column) * gameOptions.gemSize,
                y: player.y + (playerMovement.from.row - playerMovement.to.row) * gameOptions.gemSize,
                duration: gameOptions.moveSpeed,
                callbackScope: this,
                onComplete: function () {
                    var nei = this.draw3.isVirusNeighbor(playerMovement.to.row, playerMovement.to.column)
                    if (nei.length > 0) {
                        for (var i = 0; i < nei.length; i++) {
                            if (this.draw3.customDataOf(nei[i].r, nei[i].c).alpha == 1) {
                                this.draw3.customDataOf(nei[i].r, nei[i].c).setAlpha(.6)
                            } else if (this.draw3.customDataOf(nei[i].r, nei[i].c).alpha == .6) {
                                this.draw3.customDataOf(nei[i].r, nei[i].c).setAlpha(.2)
                            } else {
                                let randomValue = Math.floor(Math.random() * this.items)
                                this.explode(nei[i].r, nei[i].c)
                                //this.totalLines += 20
                                this.score += 100
                                this.updateStats()
                                this.draw3.setValue(nei[i].r, nei[i].c, randomValue)
                                this.draw3.removeVirus(nei[i].r, nei[i].c)
                                //this.colorBomb(nei[i].r, nei[i].c, randomValue)
                                this.colorBombs.push(nei[i])
                                this.draw3.customDataOf(nei[i].r, nei[i].c).setAlpha(1).setTexture('gem').setTint(colors[randomValue])
                            }
                        }


                    }
                    if (this.draw3.typeAt(playerMovement.to.row, playerMovement.to.column) == 'productivity') {
                        this.doProductivity(playerMovement.from.row, playerMovement.from.column, this.draw3.valueAt(playerMovement.to.row, playerMovement.to.column))
                    }
                    this.poolArray.push(this.draw3.customDataOf(playerMovement.to.row, playerMovement.to.column));
                    this.draw3.customDataOf(playerMovement.to.row, playerMovement.to.column).alpha = 0;


                    this.playerStep();
                }
            })
        }
        else {
            this.makeGemsFall();
        }
    }
    makeGemsFall() {
        let moved = 0;
        let fallingMovements = this.draw3.arrangeBoardAfterChain();
        fallingMovements.forEach(function (movement) {
            moved++;
            this.tweens.add({
                targets: this.draw3.customDataOf(movement.row, movement.column),
                y: this.draw3.customDataOf(movement.row, movement.column).y + movement.deltaRow * gameOptions.gemSize,
                duration: gameOptions.fallSpeed * Math.abs(movement.deltaRow),
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.canPick = true;
                    }
                }
            })
        }.bind(this));
        let replenishMovements = this.draw3.replenishBoard();
        replenishMovements.forEach(function (movement) {
            moved++;
            let sprite = this.poolArray.pop();
            sprite.alpha = 1;
            sprite.y = gameOptions.boardOffset.y + gameOptions.gemSize * (movement.row - movement.deltaRow + 1) - gameOptions.gemSize / 2;
            sprite.x = gameOptions.boardOffset.x + gameOptions.gemSize * movement.column + gameOptions.gemSize / 2;
            if (this.draw3.valueAt(movement.row, movement.column) == bugValue) {
                sprite.setTexture('bug')
                sprite.clearTint()
            } else {
                sprite.setTexture('gem')
                sprite.setTint(colors[this.draw3.valueAt(movement.row, movement.column)]);
            }


            this.draw3.setCustomData(movement.row, movement.column, sprite);
            this.tweens.add({
                targets: sprite,
                y: gameOptions.boardOffset.y + gameOptions.gemSize * movement.row + gameOptions.gemSize / 2,
                duration: gameOptions.fallSpeed * movement.deltaRow,
                callbackScope: this,
                onComplete: function () {
                    moved--;
                    if (moved == 0) {
                        this.endTurn()
                    }
                }
            });
        }.bind(this))
    }
    endTurn() {
        if (this.colorBombs.length > 0) {
            this.colorBombs.forEach(function (item) {
                this.colorBomb(item)
            }.bind(this));
        }
        if (this.bugBottomCheck()) {
            this.doBug()
        } else if (this.virusCheck()) {
            console.log('viruses exist')
            this.doVirus()
            this.canPick = true;
        } else {
            this.canPick = true;
        }


    }
    updateStats() {
        this.experience = Math.floor(this.totalLines / this.moves)
        this.scoreText.setText('S: ' + this.score)


        this.experienceText.setText('E: ' + this.experience)
        this.totalMovesText.setText('TM: ' + this.moves)
        var per = this.score / this.scoreGoal

        //this.levelProgressBar.displayWidth = 
        var tween = this.tweens.add({
            targets: this.levelProgressBar,
            displayWidth: 500 * Phaser.Math.Clamp(per, 0, 1),
            duration: 500,
            callbackScope: this,
            onComplete: function () {
                if (this.score >= this.scoreGoal) {
                    this.score = 0
                    this.scoreGoal = this.onLevel * 1000
                    this.updateLevel()
                    var tween = this.tweens.add({
                        targets: this.levelProgressBar,
                        displayWidth: 0,
                        duration: 200
                    })
                } else {
                    if (this.moves % 10 == 0) {
                        var ranNum = Phaser.Math.Between(1, 100)
                        if (ranNum < 25) {
                            this.addVirus(Phaser.Math.Between(1, 4))
                        } else if (ranNum < 50) {
                            this.addProductivity(Phaser.Math.Between(1, 4))
                        }
                    }
                }
                /* this.saveGame() */
            }
        })


    }
    updateLevel() {
        this.onLevel++
        this.maxMove++
        var tween = this.tweens.add({
            targets: this.levelText,
            scale: 2,
            yoyo: true,
            duration: 300,
            callbackScope: this,
            onYoyo: function () {
                this.levelText.setText(this.onLevel)
            }
        })
        if (this.onLevel == 4) {
            this.items = 4
            this.draw3.items = 4

        } else if (this.onLevel == 6) {
            this.items = 5
            this.draw3.items = 5
        }
        this.addVirus(this.onLevel)
        this.addProductivity(this.onLevel)
    }
    addVirus(count) {
        var viruses = this.draw3.addVirus(count)
        viruses.forEach(function (virus) {
            this.draw3.setVirusDirection(virus.row, virus.col, Phaser.Math.Between(0, 3))
            this.draw3.customDataOf(virus.row, virus.col).setTexture('virus').clearTint()
            var tween = this.tweens.add({
                targets: this.draw3.customDataOf(virus.row, virus.col),
                scale: 2,
                duration: 300,
                yoyo: true

            })
        }.bind(this));
    }
    addProductivity(count) {
        var dots = this.draw3.addProductivity(count)
        dots.forEach(function (dot) {

            this.draw3.customDataOf(dot.row, dot.col).setTexture('productivity').setTint(colors[this.draw3.valueAt(dot.row, dot.col)])
            var tween = this.tweens.add({
                targets: this.draw3.customDataOf(dot.row, dot.col),
                scale: 2,
                duration: 300,
                yoyo: true

            })
        }.bind(this));
    }
    doProductivity(row, col, value) {
        var dots = this.draw3.setColumn(row, col, value)
        dots.forEach(function (dot) {

            this.draw3.customDataOf(dot.row, dot.col).setTint(colors[value])

        }.bind(this));
    }
    bugBottomCheck() {
        let bugs = this.draw3.getAllValue(bugValue)

        for (var i = 0; i < bugs.length; i++) {
            var bug = bugs[i]
            if (bug.row == this.rows - 1) {
                return true
            }
        }
        return false
    }
    virusCheck() {
        let viruses = this.draw3.getAllValue(virusValue)
        return viruses.length > 0
    }
    doVirus() {
        let viruses = this.draw3.getAllValue(virusValue)
        var count = 0
        if (viruses.length > 0) {
            viruses.forEach(rover => {
                //var roverVal = this.valueAt(rover.row, rover.col)

                var tile = this.draw3.getRandomNeighbor(rover.row, rover.col)
                //console.log(tile)
                this.draw3.setTarget(tile.row, tile.col)
                var swap = this.draw3.swapItems(rover.row, rover.col, tile.row, tile.col)
                //console.log(swap)
                //non rover to rover
                this.draw3.removeTarget(swap[0].row, swap[0].column)
                var tween1 = this.tweens.add({
                    targets: this.draw3.customDataOf(swap[0].row, swap[0].column),
                    x: gameOptions.boardOffset.x + gameOptions.gemSize * rover.col + gameOptions.gemSize / 2,
                    y: gameOptions.boardOffset.y + gameOptions.gemSize * rover.row + gameOptions.gemSize / 2,
                    duration: 200,
                    onCompleteScope: this,
                    onComplete: function () {

                        //this.alreadyMoved = true;

                        count++
                        if (count == viruses.length - 1) {
                            return false
                        }

                        //this.canPick = true;
                        //this.dragging = false;


                    }

                });
                //rover to non rover
                var tween1 = this.tweens.add({
                    targets: this.draw3.customDataOf(swap[1].row, swap[1].column),
                    x: gameOptions.boardOffset.x + gameOptions.gemSize * tile.col + gameOptions.gemSize / 2,
                    y: gameOptions.boardOffset.y + gameOptions.gemSize * tile.row + gameOptions.gemSize / 2,
                    duration: 200,
                    onCompleteScope: this,
                    onComplete: function () {
                        if (Phaser.Math.Between(1, 100) < 15) {
                            this.draw3.makeBug(swap[0].row, swap[0].column)
                            this.draw3.customDataOf(swap[0].row, swap[0].column).setTexture('bug').clearTint()
                        }

                    }


                });

            });

        }
    }
    doBug() {
        let bugs = this.draw3.getAllValue(bugValue)
        var count = 0
        for (var i = 0; i < bugs.length; i++) {
            var bug = bugs[i]
            if (bug.row == this.rows - 1) {
                this.draw3.customDataOf(bug.row, bug.col).setAlpha(.5)
                this.poolArray.push(this.draw3.customDataOf(bug.row, bug.col));
                this.draw3.setEmpty(bug.row, bug.col);
                this.explode(bug.row, bug.col)
                //this.totalLines += 10
                this.score += 50
                this.updateStats()
                this.tweens.add({
                    targets: this.draw3.customDataOf(bug.row, bug.col),
                    y: gameOptions.boardOffset.y + (this.rows + 1) * gameOptions.gemSize,
                    duration: gameOptions.fallSpeed,
                    callbackScope: this,
                    onComplete: function () {

                    }
                })
                count++
            }
        }
        if (count > 0) {
            this.totalLines += count
            this.totalLinesText.setText('TL: ' + this.totalLines)
            this.makeGemsFall()
        }
    }
    displayPath() {
        let path = this.draw3.getPath();
        path.forEach(function (item) {
            this.arrowArray[item.row][item.column].visible = true;
            if (!this.draw3.isDiagonal(item.direction)) {
                this.arrowArray[item.row][item.column].setFrame(0);
                this.arrowArray[item.row][item.column].angle = 90 * Math.log2(item.direction);
            }
            else {
                this.arrowArray[item.row][item.column].setFrame(1);
                this.arrowArray[item.row][item.column].angle = 90 * (item.direction - 9 + ((item.direction < 9) ? (item.direction / 3) - 1 - item.direction % 2 : 0));
            }
        }.bind(this))
    }
    hidePath() {
        this.arrowArray.forEach(function (item) {
            item.forEach(function (subItem) {
                subItem.visible = false;
                subItem.angle = 0;
            })
        })
    }
    colorBomb(virus) {
        var neighbors = this.draw3.getNeighborsDots(virus.r, virus.c)
        let randomValue = Math.floor(Math.random() * this.items);
        this.draw3.customDataOf(virus.r, virus.c).setTint(colors[randomValue]);
        this.draw3.setValue(virus.r, virus.c, randomValue)
        //console.log(neighbors)
        neighbors.forEach(function (item) {
            this.draw3.customDataOf(item.row, item.col).setTint(colors[randomValue]);
            this.draw3.setValue(item.row, item.col, randomValue)
        }.bind(this));
    }
    explode(row, col) {
        var explosion = this.bursts.get().setActive(true);

        // Place the explosion on the screen, and play the animation.
        explosion.setOrigin(0.5, 0.5).setScale(3);
        explosion.x = this.draw3.customDataOf(row, col).x;
        explosion.y = this.draw3.customDataOf(row, col).y;
        explosion.play('burst1');
        explosion.on('animationcomplete', function () {
            explosion.setActive(false);
        }, this);
    }
    showToast(text) {
        if (this.toastBox) {
            this.toastBox.destroy(true);
        }
        var toastBox = this.add.container().setDepth(2);
        var backToastb = this.add.image(0, 0, 'blank').setDepth(2).setTint(0x333333);
        backToastb.setAlpha(1);
        backToastb.displayWidth = 720;
        backToastb.displayHeight = 110;
        toastBox.add(backToastb);
        var backToast = this.add.image(0, 0, 'blank').setDepth(2).setTint(0x000000);
        backToast.setAlpha(1);
        backToast.displayWidth = 700;
        backToast.displayHeight = 90;
        toastBox.add(backToast);
        toastBox.setPosition(game.config.width + 800, 820);
        var toastText = this.add.bitmapText(20, -10, 'topaz', text, 50,).setTint(0x00ff66).setOrigin(.5, .5).setDepth(2);
        //toastText.setMaxWidth(game.config.width - 10);
        toastBox.add(toastText);
        this.toastBox = toastBox;
        this.tweens.add({
            targets: this.toastBox,
            //alpha: .5,
            x: 450,
            duration: 500,
            //  yoyo: true,
            callbackScope: this,
            onComplete: function () {
                this.time.addEvent({
                    delay: 2500,
                    callback: this.hideToast,
                    callbackScope: this
                });
            }
        });
        //this.time.addEvent({delay: 2000, callback: this.hideToast, callbackScope: this});
    }
    hideToast() {
        this.tweens.add({
            targets: this.toastBox,
            //alpha: .5,
            x: -800,
            duration: 500,
            //  yoyo: true,
            callbackScope: this,
            onComplete: function () {
                this.toastBox.destroy(true);
            }
        });

    }
    toggleMenu() {

        if (this.menuGroup.y == 0) {
            var menuTween = this.tweens.add({
                targets: this.menuGroup,
                y: -270,
                duration: 500,
                ease: 'Bounce'
            })

        }
        if (this.menuGroup.y == -270) {
            var menuTween = this.tweens.add({
                targets: this.menuGroup,
                y: 0,
                duration: 500,
                ease: 'Bounce'
            })
        }
    }
    makeMenu() {
        ////////menu
        this.menuGroup = this.add.container().setDepth(3);
        var menuBG = this.add.image(game.config.width / 2, game.config.height - 85, 'blank').setOrigin(.5, 0).setTint(0x333333).setAlpha(.8)
        menuBG.displayWidth = 300;
        menuBG.displayHeight = 600
        this.menuGroup.add(menuBG)
        var menuButton = this.add.image(game.config.width / 2, game.config.height - 40, "menu").setInteractive().setDepth(3);
        menuButton.on('pointerdown', this.toggleMenu, this)
        menuButton.setOrigin(0.5);
        this.menuGroup.add(menuButton);
        var homeButton = this.add.bitmapText(game.config.width / 2, game.config.height + 50, 'topaz', 'HOME', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        homeButton.on('pointerdown', function () {
            this.scene.stop()
            this.scene.start('startGame')
        }, this)
        this.menuGroup.add(homeButton);
        var wordButton = this.add.bitmapText(game.config.width / 2, game.config.height + 140, 'topaz', 'WORDS', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        wordButton.on('pointerdown', function () {
            var data = {
                yesWords: this.foundWords,
                noWords: this.notWords
            }
            this.scene.pause()
            this.scene.launch('wordsPlayed', data)
        }, this)
        this.menuGroup.add(wordButton);
        var helpButton = this.add.bitmapText(game.config.width / 2, game.config.height + 230, 'topaz', 'RESTART', 50).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
        helpButton.on('pointerdown', function () {


            this.scene.start('PlayGame')
        }, this)
        this.menuGroup.add(helpButton);
        //var thankYou = game.add.button(game.config.width / 2, game.config.height + 130, "thankyou", function(){});
        // thankYou.setOrigin(0.5);
        // menuGroup.add(thankYou);    
        ////////end menu
    }
    saveGame() {
        localStorage.removeItem("pmSave");
        var board = this.draw3.getBoard()
        //var boardExtra = this.match3.getBoardExtra()
        //console.log(boardExtra)
        saveData.totalLines = this.totalLines;
        saveData.moves = this.moves
        saveData.experience = this.experience
        saveData.score = this.score
        saveData.scoreGoal = this.scoreGoal
        saveData.maxMove = this.maxMove
        saveData.onLevel = this.onLevel
        saveData.allowDiagonal = this.allowDiagonal
        saveData.items = this.items


        saveData.gameArray = board
        // saveData.gameArrayExtra = boardExtra

        localStorage.setItem('pmSave', JSON.stringify(saveData));
        /* gameData.coins = this.coins
        localStorage.setItem('pmData', JSON.stringify(gameData)); */
    }
}


