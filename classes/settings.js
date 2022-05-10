let gameOptions = {
  gemSize: 106,
  fallSpeed: 100,
  destroySpeed: 200,
  moveSpeed: 100,
  boardOffset: {
    x: 50,
    y: 50
  }
}
let levelSettings = {
  allowBug: true,
  bugStartValue: 7,
  allowVirus: true,
  virusStartValue: 3,
  allowProductivity: true,
  productivityStartValue: 3
}
let load;
let saveData;
let defaultSave = {
  totalLines: 0,
  moves: 0,
  experience: 0,
  score: 0,
  scoreGoal: 0,
  maxMove: 7,
  onLevel: 1,
  allowDiagonal: true,
  items: 3,
  gameArray: []

}
let bugValue = 6
let virusValue = 7
let colors = [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86];