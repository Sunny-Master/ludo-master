console.log('this is linked')

/*-------------------------------- Constants --------------------------------*/
const pieceObject = {
    green: '🥑',
    yellow: '🍍',
    blue: '🍄',
    red: '🍉',
}

const turnSequence = ['green', 'yellow', 'blue', 'red']

const homeSquare = {
    green: 72,
    yellow: 73,
    blue: 74,
    red: 75,
}

const squareOne = {
    green: 47,
    yellow: 8,
    blue: 21,
    red: 34
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
let numOfPlayers, numOfPieces, turn, selectedPiece, winner, outOfBounds, oobCount, pieceHome, playArea
let diceFaceWipe, diceValue, diceDisabled, count6, knockOffBonus, squareBlocked
let board = []

let playerDepots = []

const activePieces = {}

const piecesWon = {}

const vacantDepot = {}
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
    playerDepots = ['yellow', 'yellow', 'yellow', 'yellow',
                  'blue', 'blue', 'blue', 'blue',
                  'red', 'red', 'red', 'red',
                  'green', 'green', 'green', 'green' 
     ]
    playerDepots.forEach(sqr => board.push(sqr))
    //numOfPlayers = 4
    //numOfPieces = 4
    diceValue = 0
    turn = 'green'
    playArea = pathWay[turn]
    activePieces.green = 0
    activePieces.blue = 0
    activePieces.red = 0
    activePieces.yellow = 0
    piecesWon.green = 0
    piecesWon.yellow = 0 
    piecesWon.blue = 0
    piecesWon.red = 0
    vacantDepot.green = []
    vacantDepot.yellow = []
    vacantDepot.blue = []
    vacantDepot.red = []
    oobCount = 0
    count6 = 0
    // piecePosition.green = [88, 89, 90, 91]
    // piecePosition.yellow = [76, 77, 78, 79] 
    // piecePosition.blue = [80, 81, 82, 83]
    // piecePosition.red = [84, 85, 86, 87]
    winner = false
    pieceHome = false
    outOfBounds = false
    selectedPiece = false
    diceDisabled = false
    knockOffBonus = false
    squareBlocked = false
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
        let displayPieces = ''
        if (cell.includes('green')) {
            for (let i = 0; i < cell.match(/green/g).length; i++) {
                displayPieces += pieceObject['green']
            }
        }
        if (cell.includes('yellow')) {
            for (let i = 0; i < cell.match(/yellow/g).length; i++) {
                displayPieces += pieceObject['yellow']
            }
        }
        if (cell.includes('blue')) {
            for (let i = 0; i < cell.match(/blue/g).length; i++) {
                displayPieces += pieceObject['blue']
            }
        }
        if (cell.includes('red')) {
            for (let i = 0; i < cell.match(/red/g).length; i++) {
                displayPieces += pieceObject['red']
            }
        }
        pathEls[idx].textContent = displayPieces
        if(displayPieces.length > 2) {
            pathEls[idx].classList.add ('multi')
        } else {
            pathEls[idx].classList.remove('multi')
        }
    })
}

// to update the message element text to display the game state
function updateMessage() {
    if (!winner && !pieceHome && activePieces[turn] === 0) {
        messageEl.textContent = `${pieceObject[turn]}'s turn. Please roll the dice and get a '6' to make a move`
        // if (diceValue !== 6) {
        //     messageEl.textContent = `${pieceObject[turn]} didn't get a '6'. Better luck in the next roll of Dice`
        // } else {
        //     messageEl.textContent = `${pieceObject[turn]} needs to select a piece from depot to make a move`
        // }
    } else if(winner === false && pieceHome === false) {
        messageEl.textContent = `${pieceObject[turn]}'s turn. Please roll the dice and select piece to move`
    } else if (winner === false && pieceHome) {
        messageEl.textContent = `${pieceObject[turn]}'s piece reached home!! ${4 - piecesWon[turn]} more piece(s) to Win`
        pieceHome = false // to reset pieceHome after e piece reaches home
    } else {
        messageEl.textContent = `${pieceObject[turn]} won!! Congratulations!!`
    }
}

// to display the value of rolled dice
function showDiceValue() {
    if (diceValue) {
        diceRollValueEl.classList.add(`d${diceValue}`)
    }
    if (activePieces[turn] && selectedPiece) {
        diceRollValueEl.classList.remove(diceFaceWipe)
    }
}

// handleDice function
function handleDice() {
    if (winner || diceDisabled) {
        return
    }
    if (diceValue) {
        diceRollValueEl.classList.remove(diceFaceWipe)
    }
    selectedPiece = false
    handleDiceRoll()
    diceDisabled = true 
    /* 
    if player has rolled 6 for the third time in a row, 
    or if the player doesn't have any active pieces and dice value is not 6, 
    switch player turn &
    make sure the next player is not able to move piece without rolling a dice
    */
    if ((count6 === 3) || (activePieces[turn] === 0 && diceValue !== 6)) {
        switchPlayerTurn()
        count6 = 0
        selectedPiece = true
    }
    render()
}

// to handle dice roll and randomly assign diceValue
function handleDiceRoll() {
    diceValue = Math.floor(Math.random() * 6) + 1
    diceFaceWipe = `d${diceValue}`
    if (diceValue === 6) {
        count6 += 1
    }
    console.log(diceFaceWipe)
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
    vacantDepot[turn].push(pieceIndex)
    const startPos = playArea[0]
    board[startPos] += turn
    selectedPiece = true
    activePieces[turn] += 1
    console.log(activePieces)
    diceDisabled = false
    render()
}


//to handle the piece selection by the player
function handleClick(event) {
    const squareIndex = parseInt(event.target.id)
    if (!board[squareIndex].includes(turn) || selectedPiece) {
        return
    }
    const currentPos = playArea.indexOf(squareIndex)
    const newPos = currentPos + diceValue
    const newSquareIndex = playArea[newPos]
    checkBounds(newPos, playArea)
    if (outOfBounds) {
        if(oobCount === activePieces[turn]) {
            switchPlayerTurn()
            return
        } 
        outOfBounds = false //to switch-back outOfBounds to false after intial outOfBounds message
        return
    }
    checkOccupier(newSquareIndex)
    if (squareBlocked) {
        if(activePieces[turn] === 1) {
            switchPlayerTurn()
            return
        }
        squareBlocked = false
        return
    }
    board[squareIndex] = board[squareIndex].replace(turn,'')
    movePiece(newSquareIndex)
    checkForWinner(newSquareIndex)
    // a player gets an extra roll anytime a 6 is rolled 
    if (diceValue !== 6 && !knockOffBonus) {
        switchPlayerTurn()
    } else {
        diceDisabled = false
        selectedPiece = true
        knockOffBonus = false
    }
    render()
}

// to check if the new position is outOfBounds for the player
function checkBounds(newPos, playArea) {
    if(playArea[newPos] === undefined) {
        outOfBounds = true
        oobCount += 1
    } 
}

// to move the piece from current position to new position on the board
function movePiece(newSquareIndex) {
        board[newSquareIndex] += turn
        diceRollValueEl.classList.remove(diceFaceWipe)
}

// check if the same square is occupied by piece of other player
function checkOccupier(newSquareIndex) {
    if (Object.values(homeSquare).includes(newSquareIndex) || Object.values(squareOne).includes(newSquareIndex) || board[newSquareIndex] === ''){
        return
    }
    if (pathEls[newSquareIndex].textContent.length === 8) {
        squareBlocked = true
        return
    } 
    if (board[newSquareIndex].includes(turn)) {
        return
        //set block for that squareIndex for other players by adding that square to a block list
        // create a seperate remove block function when only one piece occupies a square that in not a home square
    }
    Object.keys(homeSquare).forEach(player => {
        // check which other player's piece is occupying the square
        // that particular piece will be knocked off the play area and moved back to its depot. 
        // that piece can then only be activated by rolling a 6 by the respective player
        if (player !== turn) {
            if (board[newSquareIndex] === player) {
                knockOff(newSquareIndex, player)
            }
        }
    })
}

// knock off player piece back to depot
function knockOff(index, player) {
    board[index] = board[index].replace(player,'')
    let depotIndex = vacantDepot[player].pop()
    board[depotIndex] = player
    activePieces[player] -= 1
    knockOffBonus = true
}


// check if there is a winner
function checkForWinner(newSquareIndex) {
    pieceHome = false
    if (newSquareIndex !== homeSquare[turn]){
        return
    }
    pieceHome = true
    piecesWon[turn] += 1
    console.log(piecesWon[turn])
    activePieces[turn] -= 1
    if (piecesWon[turn] === 4) {
        winner = true
    }
}

// to switch turn to next player in the turn sequence
function switchPlayerTurn() {
    if (winner) {
        return
    }
    if (turn === 'red') {
        turn = turnSequence[0]
    } else {
        turn = turnSequence[turnSequence.indexOf(turn) + 1]
    }
    console.log(turn)
    playArea = pathWay[turn]
    outOfBounds = false
    count6 = 0
    oobCount = 0
    diceDisabled = false
    selectedPiece = true
    squareBlocked = false
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










