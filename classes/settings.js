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
  productivityStartValue: 3,
  cardCodeDuration: 15,
  cardVirusDuration: 15,
  cardProdjectDuration: 15,
}
let load;
let saveData;
let defaultSave = {

  rows: 11,
  cols: 7,
  items: 3,
  totalLines: 0,
  moves: 0,
  experience: 0,
  bugsSquashed: 0,
  virusesKilled: 0,
  score: 0,
  scoreGoal: 1000,
  scoreTotal: 0,
  maxMove: 7,
  onLevel: 1,
  hasCardVirus: false,
  cardVirusStart: 0,
  hasCardCode: false,
  cardCodeStart: 0,
  hasCardProdject: false,
  cardProdjectStart: 0,
  allowDiagonal: true,
  virusRandomMax: 4,
  playerPositionR: 2,
  playerPositionC: 2,


  gameArray: []

}
let cardDefault = ['card_virus', 'card_code', 'card_prodject']
let bugValue = 6
let virusValue = 7
let cardValue = 8
let colors = [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86];