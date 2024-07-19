console.log('this is linked')

/*-------------------------------- Constants --------------------------------*/
const piecesObject = {
    green: '💚',
    yellow: '💛',
    blue: '💙',
    red: '🧡'
}

const turnSequence = ['GREEN', 'YELLOW', 'BLUE', 'RED']


/*---------------------------- Variables (state) ----------------------------*/
let numOfPlayers, numOfPieces, diceValue, turn, selectedPiece, winner, outOfBounds, pieceHome

let board = []

let homeDepots = []

const activePieces = {}


/*------------------------ Cached Element References ------------------------*/
const pathSquareEls = document.querySelectorAll('.path')

// referenced from: https://www.geeksforgeeks.org/fastest-way-to-convert-javascript-nodelist-to-array/
let pathEls = Array.from(pathSquareEls)

//considering that nodes are objects
pathEls = pathEls.sort((a,b) => parseInt(a.id) - parseInt(b.id)) 

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
    console.log(board)
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

function render() {
    updateBoard()
    updateMessage()
}

function updateBoard() {
    board.forEach((cell, idx) => {
        //console.log(pathSquareEls[idx])
        pathEls[idx].textContent = piecesObject[cell]
    })
}

// Create a function call updateMessage: In updateMessage, render message based on the current game state
// If winner is false and pieceHome is false,
//      Render whose turn it is
// If winner is false and pieceHome is true, 
//      Render the ‘selectedPiece’ reached home for ‘player’ based on the turn
// Otherwise, 
//      render a congratulatory message to the player that has won

function updateMessage() {
    if(winner === false && pieceHome === false) {
        messageEl.textContent = `${piecesObject[turn]}'s turn. Please roll the dice and select piece to move`

    } else if (winner === false && pieceHome) {
        messageEl.textContent = `${piecesObject[turn]}'s piece reached home!! ${activePieces[turn]} more to Win`
    } else {
        messageEl.textContent = `${piecesObject[turn]} won!! Congratulations!!`
    }
}








/*----------------------------- Event Listeners -----------------------------*/











