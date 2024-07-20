console.log('this is linked')

/*-------------------------------- Constants --------------------------------*/
const pieceObject = {
    green: '💚',
    yellow: '💛',
    blue: '💙',
    red: '🧡',
    greengreen: '💚💚',
    greengreengreen: '💚💚💚',
    greengreengreengreen: '💚💚💚💚',
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
         35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 67, 68, 69, 70, 71, 72],
    yellow: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
         27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 
         46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 52, 53, 54, 55, 56, 73],
    blue: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
         40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
         10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 57, 58, 59, 60, 61, 74],
    red: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 0, 1,
         2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 
         23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 62, 63, 64, 65, 66, 75],
}


/*---------------------------- Variables (state) ----------------------------*/
let numOfPlayers, numOfPieces, diceValue, turn, selectedPiece, winner, outOfBounds, pieceHome, playArea
let diceFaceWipe
let board = []

let homeDepots = []

const activePieces = {}

// const piecePosition = {}

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

const diceEl = document.getElementById('dice-button')
const diceRollValueEl = document.getElementById('dice-value')


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
    // piecePosition.green = [88, 89, 90, 91]
    // piecePosition.yellow = [76, 77, 78, 79] 
    // piecePosition.blue = [80, 81, 82, 83]
    // piecePosition.red = [84, 85, 86, 87]
    winner = false
    pieceHome = false
    outOfBounds = false
    selectedPiece = false
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

// to display the value of rolled dice
function showDiceValue() {
    if (diceValue) {
        diceRollValueEl.classList.add(`d${diceValue}`)
    }
}

// handleDice function
function handleDice() {
    if (winner) {
        return
    }
    if (diceValue) {
        diceRollValueEl.classList.remove(diceFaceWipe)
    }
    handleDiceRoll()
    console.log(diceValue)
    render()
    selectedPiece = false
    // if the player doesn't have any active pieces and dice value is 6, 
    // activate the eventlistener for the player's depot
    // if (activePieces[turn] === 0 && diceValue !== 6) {
    //     return
    // } 
    // activate piece selection from depot if dice value is 6
    // if (diceValue === 6) {
    //     selectedPiece = false
        
    // }
    // pathEls.forEach(pathEl => {
    //     if (piecePosition[turn].includes(pathEl.id)) {
    //         pathEl.addEventListener('click', handleClick)
    //     }
    // })
}

// to handle dice roll and randomly assign diceValue
function handleDiceRoll() {
    diceValue = Math.floor(Math.random() * 6) + 1
    diceFaceWipe = `d${diceValue}`
}
    

// to make the first move 
function handleDepot(event) {
    //if dice value is not 6 or if they have already selected their piece, return
    if (diceValue !== 6 || selectedPiece) {
        return
    }
    const pieceIndex = event.target.id
    // if the selected depot square is empty, return
    if (board[pieceIndex] !== turn) {
        return
    }    
    board[pieceIndex] = ''
    const startPos = playArea[0]
    console.log(startPos)
    board[startPos] += turn
    render()
    selectedPiece = true
    activePieces[turn] += 1
    diceRollValueEl.classList.remove(diceFaceWipe)
    console.log(activePieces[turn])
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
    if(!outOfBounds && board[index].includes(turn) && !selectedPiece) {
        board[index] = board[index].replace(turn,'')
        board[playArea[newPos]] += turn
        selectedPiece = true
        diceRollValueEl.classList.remove(diceFaceWipe)
    }
}

// to check if the new position is outOfBounds for the player
function checkBounds(newPos, playArea) {
    if(playArea[newPos] === undefined) {
        outOfBounds = true
    }
}

/*----------------------------- Event Listeners -----------------------------*/
diceEl.addEventListener('click', handleDice)
greenDepotEl.addEventListener('click', handleDepot)
yellowDepotEl.addEventListener('click', handleDepot)
blueDepotEl.addEventListener('click', handleDepot)
redDepotEl.addEventListener('click', handleDepot)

pathEls.forEach(pathEl => {
    if (parseInt(pathEl.id) < 72) {
        pathEl.addEventListener('click', handleClick)
    }
})










