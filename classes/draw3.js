let dirs = [{ r: -1, c: 0 }, { r: -1, c: 1 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 0 }, { r: 1, c: -1 }, { r: 0, c: -1 }, { r: -1, c: -1 }]
let dirs4 = [{ r: -1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 0, c: -1 }];

class Draw3P {

  // constructor, simply turns obj information into class properties and creates
  // an array called "chain" which will contain chain information
  constructor(obj) {
    if (obj == undefined) {
      obj = {}
    }
    this.rows = (obj.rows != undefined) ? obj.rows : 8;
    this.columns = (obj.columns != undefined) ? obj.columns : 7;
    this.items = (obj.items != undefined) ? obj.items : 6;
    this.allowDiagonal = obj.diagonal
    this.playerPosition = (obj.playerPosition != undefined) ? obj.playerPosition : {
      row: this.rows - 1,
      column: Math.floor(this.columns / 2)
    };
    if (this.playerPosition.row == undefined || this.playerPosition.row < 0 || this.playerPosition.row >= this.rows) {
      this.playerPosition.row = this.rows - 1;
    }
    if (this.playerPosition.column == undefined || this.playerPosition.column < 0 || this.playerPosition.column >= this.column) {
      this.playerPosition.column = Math.floor(this.columns / 2);
    }
    this.chain = [];
  }

  // returns the number of rows in board
  getRows() {
    return this.rows;
  }

  // returns the number of columns in board
  getColumns() {
    return this.columns;
  }

  // returns player row
  getPlayerRow() {
    return this.playerPosition.row;
  }

  // returns player column
  getPlayerColumn() {
    return this.playerPosition.column;
  }

  // sets player position
  setPlayerPosition(row, column) {
    this.playerPosition = {
      row: row,
      column: column
    }
  }

  // returns true if player is at "row" row and "column" column
  isPlayerAt(row, column) {
    return row == this.getPlayerRow() && column == this.getPlayerColumn();
  }

  // generates the game field
  generateField() {
    this.gameArray = [];

    for (let i = 0; i < this.getRows(); i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.getColumns(); j++) {
        let randomValue = Math.floor(Math.random() * this.items);
        this.gameArray[i][j] = {
          value: randomValue,
          isEmpty: false,
          isPlayer: this.isPlayerAt(i, j),
          isTarget: false,
          type: 'dot',
          row: i,
          column: j
        }
      }
    }

    if (levelSettings.allowBug) {
      var i = 0
      while (i < levelSettings.bugStartValue) {
        var row = Phaser.Math.Between(0, this.getRows() - 2)
        var col = Phaser.Math.Between(0, this.getColumns() - 1)

        if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
          this.gameArray[row][col].value = bugValue
          this.gameArray[row][col].type = 'bug'
          i++
        }
      }
    }
    if (levelSettings.allowVirus) {
      var i = 0
      while (i < levelSettings.virusStartValue) {
        var row = Phaser.Math.Between(0, this.getRows() - 1)
        var col = Phaser.Math.Between(0, this.getColumns() - 1)

        if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
          this.gameArray[row][col].value = virusValue
          this.gameArray[row][col].type = 'virus'
          i++
        }
      }
    }
    if (levelSettings.allowProductivity) {
      var i = 0
      while (i < levelSettings.productivityStartValue) {
        var row = Phaser.Math.Between(0, this.getRows() - 1)
        var col = Phaser.Math.Between(0, this.getColumns() - 1)

        if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
          // this.gameArray[row][col].value = virusValue
          this.gameArray[row][col].type = 'productivity'
          i++
        }
      }
    }
  }
  addVirus(count) {
    var i = 0
    var result = []
    while (i < count) {
      var row = Phaser.Math.Between(0, this.getRows() - 1)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
        this.gameArray[row][col].value = virusValue
        this.gameArray[row][col].type = 'virus'
        result.push({ row: row, col: col })
        i++
      }
    }
    return result
  }
  addProductivity(count) {
    var i = 0
    var result = []
    while (i < count) {
      var row = Phaser.Math.Between(0, this.getRows() - 1)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
        this.gameArray[row][col].value = Math.floor(Math.random() * this.items);
        this.gameArray[row][col].type = 'productivity'
        result.push({ row: row, col: col })
        i++
      }
    }
    return result
  }
  addCard(type) {
    var i = 0
    var result = []
    while (i < 1) {
      var row = Phaser.Math.Between(0, this.getRows() - 1)
      var col = Phaser.Math.Between(0, this.getColumns() - 1)

      if (this.gameArray[row][col].type == 'dot' && !this.gameArray[row][col].isPlayer) {
        this.gameArray[row][col].value = cardValue;
        this.gameArray[row][col].type = type
        result.push({ row: row, col: col })
        i++
      }
    }
    return result
  }
  makeBug(row, column) {
    this.gameArray[row][column].value = bugValue
    this.gameArray[row][column].type = 'bug'
  }
  // returns true if the item at (row, column) is a valid pick
  validPick(row, column) {
    return row >= 0 && row < this.getRows() && column >= 0 && column < this.getColumns() && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }

  // returns the value of the item at (row, column), or false if it's not a valid pick
  valueAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].value;
  }
  setValue(row, column, value) {
    this.gameArray[row][column].value = value
  }
  setColumn(row, col, value) {
    var results = []
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (this.typeAt(i, j) == 'dot' && j == col && !this.isPlayerAt(i, j)) {
          this.setValue(i, j, value)
          results.push({ row: i, col: j })
        }
      }
    }
    return results
  }
  typeAt(row, column) {
    return this.gameArray[row][column].type
  }
  virusAt(row, column) {
    if (!this.validPick(row, column)) {
      return false;
    }
    return this.gameArray[row][column].type == 'virus';
  }
  removeVirus(row, column) {
    this.gameArray[row][column].type == 'dot'

  }
  setTarget(row, column) {
    this.gameArray[row][column].isTarget = true;
  }
  removeTarget(row, column) {
    this.gameArray[row][column].isTarget = false;
  }
  isTargetAt(row, column) {
    this.gameArray[row][column].isTarget;
  }
  getVirusDirection(row, column) {
    return this.gameArray[row][column].roverDir
  }
  setVirusDirection(row, column, dir) {
    this.gameArray[row][column].roverDir = dir
  }
  isVirusNeighbor(row, column) {
    var result = [];
    for (var n = 0; n < 4; n++) {

      if (this.validPick(row + dirs4[n].r, column + dirs4[n].c) && this.valueAt(row + dirs4[n].r, column + dirs4[n].c) == virusValue) {
        var coo = { r: row + dirs4[n].r, c: column + dirs4[n].c }
        //console.log(coo)
        result.push(coo)
      }
    }
    if (result.length > 0) {

    }
    return result;
  }

  getAllValue(value) {
    let result = []
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (this.valueAt(i, j) == value) {
          result.push({
            row: i,
            col: j
          })
        }
      }
    }
    return result
  }
  // sets a custom data of the item at (row, column)
  setCustomData(row, column, customData) {
    this.gameArray[row][column].customData = customData;
  }

  // returns the custom data of the item at (row, column)
  customDataOf(row, column) {
    return this.gameArray[row][column].customData;
  }

  // returns true if the item at (row, column) continues the chain
  continuesChain(row, column) {
    return (this.getChainLength() < 2 || this.getChainValue() == this.valueAt(row, column)) && !this.isInChain(row, column) && this.areNext(row, column, this.getLastChainItem().row, this.getLastChainItem().column);
  }

  // returns true if the item at (row, column) backtracks the chain
  backtracksChain(row, column) {
    return this.getChainLength() > 1 && this.areTheSame(row, column, this.getNthChainItem(this.getChainLength() - 2).row, this.getNthChainItem(this.getChainLength() - 2).column)
  }

  // returns the n-th chain item
  getNthChainItem(n) {
    return {
      row: this.chain[n].row,
      column: this.chain[n].column
    }
  }

  // returns the path connecting all items in chain, as an object containing row, column and direction
  getPath() {
    let path = [];
    if (this.getChainLength() > 1) {
      for (let i = 1; i < this.getChainLength(); i++) {
        let deltaColumn = this.getNthChainItem(i).column - this.getNthChainItem(i - 1).column;
        let deltaRow = this.getNthChainItem(i).row - this.getNthChainItem(i - 1).row;
        let direction = 0
        direction += (deltaColumn < 0) ? Draw3P.LEFT : ((deltaColumn > 0) ? Draw3P.RIGHT : 0);
        direction += (deltaRow < 0) ? Draw3P.UP : ((deltaRow > 0) ? Draw3P.DOWN : 0);
        path.push({
          row: this.getNthChainItem(i - 1).row,
          column: this.getNthChainItem(i - 1).column,
          direction: direction
        });
      }
    }
    return path;
  }

  // returns an array with basic directions (UP, DOWN, LEFT, RIGHT) given a direction
  getDirections(n) {
    let result = [];
    let base = 1;
    while (base <= n) {
      if (base & n) {
        result.push(base);
      }
      base <<= 1;
    }
    return result;
  }

  // returns true if the number represents a diagonal movement
  isDiagonal(n) {
    return this.getDirections(n).length == 2;
  }

  // returns the last chain item
  getLastChainItem() {
    return this.getNthChainItem(this.getChainLength() - 1);
  }

  // returns the first chain item
  getFirstChainItem() {
    return this.getNthChainItem(0);
  }

  // returns chain length
  getChainLength() {
    return this.chain.length;
  }

  // returns true if the item at (row, column) is in the chain
  isInChain(row, column) {
    for (let i = 0; i < this.getChainLength(); i++) {
      let item = this.getNthChainItem(i)
      if (this.areTheSame(row, column, item.row, item.column)) {
        return true;
      }
    }
    return false;
  }

  // returns the value of items in the chain
  getChainValue() {
    return this.valueAt(this.getNthChainItem(1).row, this.getNthChainItem(1).column)
  }

  // puts the item at (row, column) in the chain
  putInChain(row, column) {
    this.chain.push({
      row: row,
      column: column
    })
  }

  // removes the last chain item and returns it
  removeLastChainItem() {
    return this.chain.pop();
  }

  // clears the chain and returns the items
  emptyChain() {
    let result = [];
    this.chain.forEach(function (item) {
      result.push(item);
    })
    this.chain = [];
    this.chain.length = 0;
    return result;
  }

  // moves the player along the chain for one unit
  movePlayer() {
    if (this.getChainLength() > 1) {
      let playerStartPosition = this.chain.shift();
      let playerEndPosition = this.getFirstChainItem();
      this.setPlayerPosition(playerEndPosition.row, playerEndPosition.column);
      this.swapItems(playerStartPosition.row, playerStartPosition.column, playerEndPosition.row, playerEndPosition.column);

      this.setEmpty(playerStartPosition.row, playerStartPosition.column);


      return {
        from: playerEndPosition,
        to: playerStartPosition
      }
    }
    this.emptyChain();
    return false;
  }
  nonSelect(row, col) {
    return this.valueAt(row, col) == bugValue || this.valueAt(row, col) == virusValue
  }
  // checks if the items at (row, column) and (row2, column2) are the same
  areTheSame(row, column, row2, column2) {
    return row == row2 && column == column2;
  }

  // returns true if two items at (row, column) and (row2, column2) are next to each other horizontally, vertically or diagonally
  areNext(row, column, row2, column2) {

    if (this.allowDiagonal) {
      return (Math.abs(row - row2) + Math.abs(column - column2) == 1) || (Math.abs(row - row2) == 1 && Math.abs(column - column2) == 1);
    } else {
      return (Math.abs(column - column2) == 1 && row - row2 == 0) || (Math.abs(row - row2) == 1 && column - column2 == 0);

    }

  }

  // swap the items at (row, column) and (row2, column2) and returns an object with movement information
  swapItems(row, column, row2, column2) {
    let tempObject = Object.assign(this.gameArray[row][column]);
    this.gameArray[row][column] = Object.assign(this.gameArray[row2][column2]);
    this.gameArray[row2][column2] = Object.assign(tempObject);
    return [{
      row: row,
      column: column,
      deltaRow: row - row2,
      deltaColumn: column - column2
    },
    {
      row: row2,
      column: column2,
      deltaRow: row2 - row,
      deltaColumn: column2 - column
    }]
  }

  // set the item at (row, column) as empty
  setEmpty(row, column) {
    this.gameArray[row][column].isEmpty = true;
    this.gameArray[row][column].isPlayer = false;
  }

  // returns true if the item at (row, column) is empty
  isEmpty(row, column) {
    return this.gameArray[row][column].isEmpty;
  }

  // returns the amount of empty spaces below the item at (row, column)
  emptySpacesBelow(row, column) {
    let result = 0;
    if (row != this.getRows()) {
      for (let i = row + 1; i < this.getRows(); i++) {
        if (this.isEmpty(i, column)) {
          result++;
        }
      }
    }
    return result;
  }

  // arranges the board after a chain, making items fall down. Returns an object with movement information
  arrangeBoardAfterChain() {
    let result = []
    for (let i = this.getRows() - 2; i >= 0; i--) {
      for (let j = 0; j < this.getColumns(); j++) {
        if (!this.isPlayerAt(i, j)) {
          let emptySpaces = this.emptySpacesBelow(i, j);
          if (j == this.getPlayerColumn() && i < this.getPlayerRow()) {
            emptySpaces++;
            if (i + emptySpaces <= this.getPlayerRow()) {
              emptySpaces--;
            }
          }
          if (!this.isEmpty(i, j) && emptySpaces > 0) {
            this.swapItems(i, j, i + emptySpaces, j)
            result.push({
              row: i + emptySpaces,
              column: j,
              deltaRow: emptySpaces,
              deltaColumn: 0
            });
          }
        }
      }
    }
    return result;
  }

  // replenishes the board and returns an object with movement information
  replenishBoard() {
    let result = [];
    for (let i = 0; i < this.getColumns(); i++) {
      if (this.isEmpty(0, i) || this.isPlayerAt(0, i)) {
        let emptySpaces = this.emptySpacesBelow(0, i) + 1;
        if (this.isPlayerAt(0, i)) {
          emptySpaces--;
        }
        for (let j = 0; j < emptySpaces; j++) {
          let randomValue = Math.floor(Math.random() * this.items);
          let extraRow = (i == this.getPlayerColumn() && j >= this.getPlayerRow()) ? 1 : 0;
          result.push({
            row: j + extraRow,
            column: i,
            deltaRow: emptySpaces + extraRow,
            deltaColumn: 0
          });
          this.gameArray[j][i].value = randomValue;
          this.gameArray[j][i].type = 'dot'
          if (levelSettings.allowBug) {
            let chance = 0
            if (this.getAllValue(bugValue) == 0) {
              chance = 25
            } else {
              chance = 2
            }
            if (Phaser.Math.Between(1, 100) < chance) {
              this.gameArray[j][i].value = bugValue
              this.gameArray[j][i].type = 'bug'
            }

          }

        }
      }
    }
    for (let i = 0; i < this.getRows(); i++) {
      for (let j = 0; j < this.getColumns(); j++) {
        this.gameArray[i][j].isEmpty = false;
      }
    }
    return result;
  }
  //check for moves
  checkForMoves() {
    console.log(this.playerPosition)
    var results = this.getNeighborsDots(this.playerPosition.row, this.playerPosition.column)
    console.log(results)
  }
  //returns array of valid neighbor coord that are regular dots
  getNeighborsDots(row, column) {
    var result = []
    for (var i = 0; i < 8; i++) {
      var nR = row + dirs[i].r
      var nC = column + dirs[i].c
      if (!this.isPlayerAt(nR, nC) && this.validPick(nR, nC) && this.typeAt(nR, nC) == 'dot') {
        result.push({ row: nR, col: nC })
      }
    }
    //console.log(result)
    return result
  }
  getRandomNeighbor(row, column) {

    var found = false
    if (Phaser.Math.Between(1, 100) < 20) {
      var dir = Math.floor(Math.random() * 3)
      this.setVirusDirection(row, column, dir)
    } else {
      var dir = this.getVirusDirection(row, column)
    }

    while (!found) {
      //console.log(dir)
      var nR = row + dirs4[dir].r
      var nC = column + dirs4[dir].c
      if (this.validPick(nR, nC) && !this.virusAt(nR, nC) && !this.isTargetAt(nR, nC) && !this.isPlayerAt(nR, nC)) {
        found = true
      } else {
        dir = Phaser.Math.Between(0, 3)
        this.setVirusDirection(row, column, dir)
      }
    }
    return { row: nR, col: nC }

  }
  getBoard() {
    var gameSave = [];

    for (let i = 0; i < this.rows; i++) {
      gameSave[i] = [];
      for (let j = 0; j < this.columns; j++) {


        gameSave[i][j] = {
          value: this.gameArray[i][j].value,
          type: this.gameArray[i][j].type,
          isEmpty: this.gameArray[i][j].isEmpty,
          row: i,
          column: j,
          isPlayer: this.gameArray[i][j].isPlayer
        }

      }
    }
    return gameSave
  }
}
Draw3P.RIGHT = 1;
Draw3P.DOWN = 2;
Draw3P.LEFT = 4;
Draw3P.UP = 8;