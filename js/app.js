console.log('this is linked')

/*-------------------------------- Constants --------------------------------*/
const piecesObject = {
    green: '💚',
    yellow: '💛',
    blue: '💙',
    red: '🧡'
}

const turnSequence = ['green', 'yellow', 'blue', 'red']

const homeSquare = {
    green: 75,
    yellow: 57,
    blue: 63,
    red: 75,
}

const pathWay = {
    green: [47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
         16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 
         35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 70, 71, 72, 73, 74, 75],
    yellow: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
         27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 
         46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 52, 53, 54, 55, 56, 57],
    blue: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
         40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
         10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 58, 59, 60, 61, 62, 63],
    red: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1,
         2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 
         23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 64, 65, 66, 67, 68, 69],
}


/*---------------------------- Variables (state) ----------------------------*/
let numOfPlayers, numOfPieces, diceValue, turn, selectedPiece, winner, outOfBounds, pieceHome
let diceFaceWipe
let board = []

let homeDepots = []

const activePieces = {}

/*------------------------ Cached Element References ------------------------*/
const pathSquareEls = document.querySelectorAll('.path')

// referenced from: https://www.geeksforgeeks.org/fastest-way-to-convert-javascript-nodelist-to-array/
let pathEls = Array.from(pathSquareEls)

//considering that nodes are objects in an array
pathEls = pathEls.sort((a,b) => parseInt(a.id) - parseInt(b.id)) 

const boardEl = document.querySelector('.board')
const yellowSectionEl = document.querySelector('#yellowGateway')
const blueSectionEl = document.querySelector('#blueGateway')
const redSectionEl = document.querySelector('#redGateway')
const greenSectionEl = document.querySelector('#greenGateway')

const messageEl = document.getElementById('message')

const redPiecesDepotEl = document.querySelector('#redBig')
const greenPiecesDepotEl = document.querySelector('#greenBig')
const yellowPiecesDepotEl = document.querySelector('#yellowBig')
const bluePiecesDepotEl = document.querySelector('#blueBig')

const diceEl = document.getElementById('dice')


/*-------------------------------- Functions --------------------------------*/

// function to initialise the game 
function init() {
    for (let i = 0; i < 76; i++) {
        board.push('')
    }
    homeDepots = ['yellow', 'yellow', 'yellow', 'yellow',
                  'blue', 'blue', 'blue', 'blue',
                  'red', 'red', 'red', 'red',
                  'green', 'green', 'green', 'green' 
     ]
    homeDepots.forEach(sqr => board.push(sqr))
    numOfPlayers = 4
    numOfPieces = 4
    diceValue = 0
    turn = 'green'
    selectedPiece = ''
    activePieces.green = 4
    activePieces.blue = 4
    activePieces.red = 4
    activePieces.yellow = 4
    winner = false
    pieceHome = false
    outOfBounds = false
    render()
}

init()

//function to render the board
function render() {
    updateBoard()
    updateMessage()
    showDiceValue()
}

//to update the board with game state
function updateBoard() {
    board.forEach((cell, idx) => {
        //console.log(pathSquareEls[idx])
        pathEls[idx].textContent = piecesObject[cell]
    })
}

// to update the message element text to display the game state
function updateMessage() {
    if(winner === false && pieceHome === false) {
        messageEl.textContent = `${piecesObject[turn]}'s turn. Please roll the dice and select piece to move`

    } else if (winner === false && pieceHome) {
        messageEl.textContent = `${piecesObject[turn]}'s piece reached home!! ${activePieces[turn]} more to Win`
    } else {
        messageEl.textContent = `${piecesObject[turn]} won!! Congratulations!!`
    }
}

// to display the value of rolled dice
function showDiceValue() {
    if (diceValue === 0) {
        return
    } else {
        diceEl.textContent = ""
        diceEl.classList.add(`d${diceValue}`)
    }
}

function handleDice() {
    if (winner) {
        return
    }
    if (diceValue !== 0) {
        diceEl.classList.remove(diceFaceWipe)
    }
    diceFaceWipe = `d${diceValue}`
    diceValue = Math.floor(Math.random() * 6) + 1
    showDiceValue()
}

// to handle the piece selection by the player
// function handleClick(event) {
//     const squareIndex = parseInt(event.target.id)

// }



/*----------------------------- Event Listeners -----------------------------*/
diceEl.addEventListener('click', handleDice)
//boardEl.addEventListener('click', handleClick)











