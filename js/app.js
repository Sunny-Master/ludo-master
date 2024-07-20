console.log('this is linked')

/*-------------------------------- Constants --------------------------------*/
const pieceObject = {
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
let numOfPlayers, numOfPieces, diceValue, turn, selectedPiece, winner, outOfBounds, pieceHome, playArea
let diceFaceWipe
let board = []

let homeDepots = []

const activePieces = {}

const piecePosition = {}

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

const redDepotEl = document.querySelector('#redBig')
const greenDepotEl = document.querySelector('#greenBig')
const yellowDepotEl = document.querySelector('#yellowBig')
const blueDepotEl = document.querySelector('#blueBig')

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
    playArea = pathWay[turn]
    activePieces.green = 0
    activePieces.blue = 0
    activePieces.red = 0
    activePieces.yellow = 0
    piecePosition.green = [88, 89, 90, 91]
    piecePosition.yellow = [76, 77, 78, 79] 
    piecePosition.blue = [80, 81, 82, 83]
    piecePosition.red = [84, 85, 86, 87]
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
}

//to update the board with game state
function updateBoard() {
    board.forEach((cell, idx) => {
        //console.log(pathSquareEls[idx])
        pathEls[idx].textContent = pieceObject[cell]
    })
}

// to update the message element text to display the game state
function updateMessage() {
    if (!winner && !pieceHome && activePieces[turn] === 0) {
        messageEl.textContent = `${pieceObject[turn]}'s turn. Please roll the dice to get a 6 to make your first move`
    } else if(winner === false && pieceHome === false) {
        messageEl.textContent = `${pieceObject[turn]}'s turn. Please roll the dice and select piece to move`
    } else if (winner === false && pieceHome) {
        messageEl.textContent = `${pieceObject[turn]}'s piece reached home!! ${activePieces[turn]} more piece(s) to Win`
    } else {
        messageEl.textContent = `${pieceObject[turn]} won!! Congratulations!!`
    }
}

// to handle dice roll and randomly assign diceValue
function handleDiceRoll() {
    console.log('clicked')
    if (winner) {
        return
    }
    if (diceValue) {
        diceEl.classList.remove(diceFaceWipe)
    }
    diceValue = Math.floor(Math.random() * 6) + 1
    diceFaceWipe = `d${diceValue}`
    //console.log(diceEl)
    showDiceValue()

    // if there are no pieces on the player's pathway and dice value is 6, 
    // activate the eventlistener for the player's depot
    if (activePieces[turn] === 0 && diceValue !== 6) {
        return
    } else if (activePieces[turn] < 4 && diceValue === 6) {
        greenDepotEl.addEventListener('click', handleDepot)
    }
    // pathEls.forEach(pathEl => {
    //     if (piecePosition[turn].includes(pathEl.id)) {
    //         pathEl.addEventListener('click', handleClick)
    //     }
    // })
}
    


// to display the value of rolled dice
function showDiceValue() {
        diceEl.textContent = ""
        diceEl.classList.add(`d${diceValue}`)
}

// to make the first move 
function handleDepot(event) {
    const pieceIndex = event.target.id
    console.log(pieceIndex)
    board[pieceIndex] = ''
    const startPos = playArea[0]
    console.log(startPos)
    board[startPos] = turn
    render()
}




//to handle the piece selection by the player
function handleClick(event) {
    outOfBounds = false //to switch-back outOfBounds to false after intial outOfBounds message
    const squareIndex = parseInt(event.target.id)
    movePiece(squareIndex)
    render()
}

// to move the piece from current position to new position on the board
function movePiece(index) {
    const currentPos = playArea.indexOf(index)
    const newPos = currentPos + diceValue
    checkBounds(newPos, playArea)
    console.log(outOfBounds)
    if(!outOfBounds) {
        board[index] = ''
        board[playArea[newPos]] = turn
        diceEl.textContent = '🎲'
        diceEl.classList.remove(diceFaceWipe)
    }
}

// to check if the new position is outOfBounds for the player
function checkBounds(newPos, playArea) {
    if(playArea[newPos] === undefined) {
        outOfBounds = true
    }
}

/*----------------------------- Event Listeners -----------------------------*/
diceEl.addEventListener('click', handleDiceRoll)












