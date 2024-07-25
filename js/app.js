/*-------------------------------- Constants --------------------------------*/
const pieceObject = {
    green: '../assets/images/pieces/donatello.png',
    yellow: '../assets/images/pieces/michaelangelo.png',
    blue: '../assets/images/pieces/leonardo.png',
    red: '../assets/images/pieces/raphael.png',
}

const playerNames = {
    green: 'Donatello',
    yellow: 'Michaelangelo',
    blue: 'Leonardo',
    red: 'Raphael',
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

const diceSound = new Audio('../assets/sounds/dice.wav')


/*---------------------------- Variables (state) ----------------------------*/
let numOfPlayers, numOfPieces, turn, selectedPiece, winner, outOfBounds, pieceHome, playArea
let diceFaceWipe, diceValue, diceDisabled, count6, knockOffBonus
let board 

let playerDepots

const activePieces = {}

const piecesWon = {}

const vacantDepot = {}
const piecePosition = {}

/*------------------------ Cached Element References ------------------------*/

const selectPlayersEl = document.getElementById('select-players')

const pathSquareEls = document.querySelectorAll('.path')
// referenced from: https://www.geeksforgeeks.org/fastest-way-to-convert-javascript-nodelist-to-array/
let pathEls = Array.from(pathSquareEls)
//considering that nodes are objects in an array
pathEls = pathEls.sort((a,b) => parseInt(a.id) - parseInt(b.id)) 

const boardEl = document.querySelector('.board')
const yellowSectionEl = document.querySelector('#yellow-gateway')
const blueSectionEl = document.querySelector('#blue-gateway')
const redSectionEl = document.querySelector('#red-gateway')
const greenSectionEl = document.querySelector('#green-gateway')

const messageEl = document.getElementById('message')

const redDepotEl = document.querySelector('#red-big')
const greenDepotEl = document.querySelector('#green-big')
const yellowDepotEl = document.querySelector('#yellow-big')
const blueDepotEl = document.querySelector('#blue-big')

const diceEl = document.getElementById('dice-button')
const diceRollValueEl = document.getElementById('dice-value')

const resetBtnEl = document.getElementById('reset')
const titleScreenEl = document.getElementById('title-screen')
const startBtnEl = document.getElementById('start')
const howBtnEl = document.getElementById('instr-btn')
const backBtnEl = document.getElementById('back')
const instrScreenEl = document.getElementById('instructions')

/*-------------------------------- Functions --------------------------------*/

// function to initialise the game 
function init() {
    board = []
    diceRollValueEl.className = 'dice'
    diceEl.className = 'dice'
    selectPlayersEl.selectedIndex = 0
    playerDepots = []
    numOfPlayers = 0
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
    count6 = 0
    piecePosition.green = [88, 89, 90, 91]
    piecePosition.yellow = [76, 77, 78, 79] 
    piecePosition.blue = [80, 81, 82, 83]
    piecePosition.red = [84, 85, 86, 87]
    winner = false
    pieceHome = false
    outOfBounds = false
    selectedPiece = false
    diceDisabled = true
    knockOffBonus = false
    titleScreenEl.style.display = '' 
    instrScreenEl.style.display = 'none'   
    render()
}

init()

//function to render the board
function render() {
    updateDepots()
    updateBoard()
    updateMessage()
    showDiceValue()
}

//setting number of players
function playerSelection() {
    if (numOfPlayers !== 0) {
        return
    }
    numOfPlayers = parseInt(selectPlayersEl.value)
    
}

// to update the depots based on number of players
function updateDepots() {
    if (diceValue) {
        return
    }
    for (let i = 0; i < 76; i++) {
        board[i] =''
    }
    if (numOfPlayers === 4) {
        playerDepots = ['yellow', 'yellow', 'yellow', 'yellow',
            'blue', 'blue', 'blue', 'blue',
            'red', 'red', 'red', 'red',
            'green', 'green', 'green', 'green' 
        ]
    } else if (numOfPlayers === 2 || numOfPlayers === 1) {
        playerDepots = ['', '', '', '', 
                        'blue', 'blue', 'blue', 'blue',
                        '', '', '', '',
                        'green', 'green', 'green', 'green'
        ]
    } else if (numOfPlayers === 0) {
        playerDepots = ['', '', '', '',
                        '', '', '', '',
                        '', '', '', '',
                        '', '', '', '',
        ]
    } 
    playerDepots.forEach((sqr, index) => board[76 + index] = sqr)
}

//to update the board with game state
function updateBoard() {
    board.forEach((cell, idx) => {
                       
        pathEls[idx].innerHTML = ''
        if (cell.includes('green')) {
            for (let i = 0; i < cell.match(/green/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['green']
                pieceElement.alt = 'Donatello Face'
                pathEls[idx].appendChild(pieceElement)
                
            }
        }
        if (cell.includes('yellow')) {
            for (let i = 0; i < cell.match(/yellow/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['yellow']
                pathEls[idx].appendChild(pieceElement)

            }
        }
        if (cell.includes('blue')) {
            for (let i = 0; i < cell.match(/blue/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['blue']
                pathEls[idx].appendChild(pieceElement)
            }
        }
        if (cell.includes('red')) {
            for (let i = 0; i < cell.match(/red/g).length; i++) {
                const pieceElement = document.createElement('img')
                pieceElement.classList.add('piece')
                pieceElement.src = pieceObject['red']
                pathEls[idx].appendChild(pieceElement)
            }
        }

        const imageElements = pathEls[idx].querySelectorAll('.piece') 

        if (imageElements.length > 1) {
            imageElements.forEach( imageElement => {
               imageElement.classList.add('multi')
            })   
        } else {
            imageElements.forEach( imageElement => {
                imageElement.classList.remove('multi')
             })   
        }
    })
}

// to update the message element text to display the game state
function updateMessage() {
    if (numOfPlayers === 0) {
        messageEl.textContent = 'Game On!!'
    } else if (winner) {
        messageEl.textContent = `BOOYAKASHA!! ${playerNames[turn]} is the LUDO MASTER!! Congratulations!!`
    } else if (pieceHome) {
        messageEl.textContent = `BOOYAKASHA!! ${playerNames[turn]}'s Piece reached HOME!! Get ${4 - piecesWon[turn]} more Piece(s) Home to Win`
    } else if (!winner && !pieceHome && activePieces[turn] === 0) {
        if (outOfBounds) {
            messageEl.textContent = `Out Of Bounds!! You lose the turn! ${playerNames[turn]}'s turn. Roll the Dice!`
        } else {
            messageEl.textContent = `${playerNames[turn]}'s turn. Roll the Dice and get a SIX to make your First move!`
        }
        if (diceDisabled) {
            firstMove()
        }
    } else {
        if (diceDisabled){
            makeYourMove()
        } else {
            rollTheDice()
        }
    } 
}

// to render a message based on different dice roll condition when there are no activePieces
function firstMove() {
    if (diceValue !== 6) {
        messageEl.textContent = `${playerNames[turn]} didn't get a SIX. Better Luck in the next roll of Dice`
   } else {
        messageEl.textContent = `COWABUNGA!! ${playerNames[turn]} got a SIX! Select a Piece from Depot to make a move!`
   }
}

// to render a message when user has rolled a dice when there is/are active piece(s)
function makeYourMove() {
    if (outOfBounds) {
        messageEl.textContent = `Out Of Bounds!! This is not going to be a walk in the park! Select a different Piece!`
    } else if (diceValue !== 6) {
        messageEl.textContent = `${playerNames[turn]} got a ${diceValue}! Select an Active Piece to make a move!`
    } else if (count6 === 1) {
        messageEl.textContent = `COWABUNGA!! ${playerNames[turn]} got a SIX! Select any Piece to make a move!!`
    } else if(count6 === 2) { 
        messageEl.textContent = `BOOYAH!! ${playerNames[turn]} got a SIX Again! Select any Piece to make a move!!`
    } else if (count6 === 3) {
        messageEl.textContent = `OOPS!! Rule of 3 SIXES: You lose the turn!!` 
    } 
}

// to render a message when user needs to roll the dice 
function rollTheDice() {
    if (outOfBounds) {
        messageEl.textContent = `Out Of Bounds!! You lose the turn! ${playerNames[turn]}'s turn. Roll the Dice!`
    }  else if (knockOffBonus) {
        messageEl.textContent = `KNOCK OFF bonus!! ${playerNames[turn]}'s turn. Roll the Dice!`
    } else if (count6 === 1) {
        messageEl.textContent = `${playerNames[turn]}'s turn. Rule of SIX: Bonus turn!! Roll the Dice!`
    } else if (count6 === 2) {
        messageEl.textContent = `${playerNames[turn]}'s turn. Rule of 2 SIXES: Another Bonus turn!! Roll the Dice!`
    } else {
        messageEl.textContent = `${playerNames[turn]}'s turn. Roll the Dice!`
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
    if (winner || diceDisabled) {
        return
    }
    if (diceValue) {
        diceRollValueEl.className = 'dice'
    }
    selectedPiece = false
    
    handleDiceRoll()
    diceDisabled = true
    knockOffBonus = false // to reset knockOffBonus from previous turn
    outOfBounds = false // to reset outOfBounds from previous turn
    render() 
    /* 
    if player has rolled 6 for the third time in a row, 
    or if the player doesn't have any active pieces and dice value is not 6, 
    switch player turn &
    make sure the next player is not able to move piece without rolling a dice
    */
    if ((count6 === 3) || (activePieces[turn] === 0 && diceValue !== 6)) {
        switchPlayerTurn()
        setTimeout(() => render(), 2000)
    } 
    
    if ((activePieces[turn] + piecesWon[turn]) < 4 && diceValue === 6) {
        setTimeout(() => selectAiPiece(), 3000)
    } else if (numOfPlayers === 1 && turn !== 'green' && (activePieces[turn] !== 0)) {
        setTimeout(() => selectActiveAiPiece(), 4000)
    }
}

// to handle dice roll and randomly assign diceValue
function handleDiceRoll() {
    diceEl.classList.add('animate__animated','animate__shakeX')
    diceSound.play()
    diceValue = Math.floor(Math.random() * 6) + 1
    diceFaceWipe = `d${diceValue}`
    if (diceValue === 6) {
        count6 += 1
    }
    setTimeout(() => diceEl.className = 'dice', 500)
}

// to select an AI piece from the depot
function selectAiPiece() {
    if (numOfPlayers === 1 && turn !== 'green') {
        let depotIndex 
        piecePosition[turn].forEach(index => {
            if (board[index] !== '') {
                depotIndex = index
            }
        })
        if ((activePieces[turn] + piecesWon[turn]) < 4) {
        handleDepot(pathEls[depotIndex])
        }
    }
}

// to make the first move 
function handleDepot(event) {
    //if dice value is not 6 or if they have already selected their piece, return
    if (diceValue !== 6 || selectedPiece) {
        return
    }
    let pieceIndex
    if (numOfPlayers === 1 && turn !== 'green') {
        pieceIndex = event.id
    } else {
        pieceIndex = parseInt(event.target.parentElement.id)
    }
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
    diceDisabled = false
    render()
    if (diceValue === 6 && count6 !== 3) {
        setTimeout(() => checkAi(), 3000)
    }
}

// select an AI Piece when there is atleast 1 active AI Piece
function selectActiveAiPiece(){
    if (numOfPlayers === 1 && turn !== 'green') {
        let activePieceIndex = []
        pathWay[turn].forEach((pathIdx) => {
            if (board[pathIdx].includes(turn) && pathIdx !== homeSquare[turn]) {
                activePieceIndex.push(pathIdx)
            }
        })
        if(outOfBounds && activePieces[turn] > 1) {
            handleClick(pathEls[activePieceIndex.at(0)])
        } else {
            handleClick(pathEls[activePieceIndex.at(-1)])
        }
    }
}

//to handle the piece selection by the player
function handleClick(event) {
    let squareIndex
    if (numOfPlayers === 1 && turn !== 'green') {
        squareIndex = parseInt(event.id)
    } else {
        squareIndex = parseInt(event.target.parentElement.id)
    }
    // to make sure the player is clicking on a piece and not empty space
    if (typeof board[squareIndex] !== 'string') {
        return
    }
    if (!board[squareIndex].includes(turn) || selectedPiece) {
        return
    }
    const newPos = playArea.indexOf(squareIndex) + diceValue
    const newSquareIndex = playArea[newPos]
    checkBounds(newSquareIndex)
    if (outOfBounds) {
        if(activePieces[turn] === 1) {
            switchPlayerTurn()
        } 
        render()
        setInterval(() => selectActiveAiPiece(), 3000)
        return
    }
    checkOccupier(newSquareIndex)
    board[squareIndex] = board[squareIndex].replace(turn,'')
    movePiece(newSquareIndex)
    checkForWinner(newSquareIndex)
    render()
    // a player gets an extra roll anytime a 6 is rolled or if they knocked off another player's piece
    if (diceValue !== 6 && !knockOffBonus) {
        switchPlayerTurn()
    } else {
        diceDisabled = false
        selectedPiece = true
        
    }
    if (pieceHome) {
        pieceHome = false // to reset pieceHome for the next turn
        setTimeout(() => render(), 4000)
    }
    else {
        render()
    }
}

// to check if the new position is outOfBounds for the player
function checkBounds(newSquareIndex) {
    outOfBounds = false //to switch-back outOfBounds to false after intial outOfBounds message
    if(newSquareIndex === undefined || pathEls[newSquareIndex].children.length === 4) {
        outOfBounds = true
    } 
}

// check if the same square is occupied by piece of other player
function checkOccupier(newSquareIndex) {
    if (Object.values(squareOne).includes(newSquareIndex) || board[newSquareIndex] === ''){
        return
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

// to move the piece from current position to new position on the board
function movePiece(newSquareIndex) {
    board[newSquareIndex] += turn
}

// check if there is a winner
function checkForWinner(newSquareIndex) {
    if (newSquareIndex !== homeSquare[turn]){
        return
    }
    pieceHome = true
    confetti.start(500)
    piecesWon[turn] += 1
    activePieces[turn] -= 1
    if (piecesWon[turn] === 4) {
        winner = true
        confetti.start(4000)
    }
}

// to switch turn to next player in the turn sequence
function switchPlayerTurn() {
    if (winner) {
        return
    }
    if (turn === 'red') {
        turn = turnSequence[0]
    } else if (numOfPlayers === 4) {
        turn = turnSequence[turnSequence.indexOf(turn) + 1]
    } else  {
        turn = turn === 'green' ? turn = 'blue' : turn = 'green'
    }
    playArea = pathWay[turn]
    count6 = 0
    diceDisabled = false
    selectedPiece = true
    setTimeout(() => checkAi(), 4000)
}

// to check if its Solo Player playing with computer
function checkAi() {
    if (numOfPlayers === 1 && turn !== 'green') {
        handleDice()
    }
}

// to start the game after selecting the numOfPlayers
function startGame() {
    if (numOfPlayers === 0) {
        return
    }
    titleScreenEl.style.display = 'none'
    setTimeout(() => {
        diceDisabled = false
        render()
    }, 1500)
}

// to show the how to play instructions screen 
function howToPlay() {
    instrScreenEl.style.display = ''
    titleScreenEl.style.display = 'none'
}

// to return back to same screen where the how to play button was clicked from
function returnBack() {
    instrScreenEl.style.display = 'none'
    titleScreenEl.style.display = ''
}

/*----------------------------- Event Listeners -----------------------------*/

selectPlayersEl.addEventListener('click', playerSelection)

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

resetBtnEl.addEventListener('click', init)
startBtnEl.addEventListener('click', startGame)
howBtnEl.addEventListener('click', howToPlay)
backBtnEl.addEventListener('click', returnBack)







