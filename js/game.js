'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '⚡'
const CHERRY = '🍒'


var gCherryInterval
var gGame = {
    score: 0,
    isOn: false,
    foodCount: 0
}
var gBoard

function init() {
    clearTimeout(gSuperTimeout)
    gGame.score = 0
    document.querySelector('h2 span').innerText = gGame.score

    document.querySelector('.game-over-modal').style.display = 'none'
    document.querySelector('.victory-modal').style.display = 'none'

    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    gGame.foodCount = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === FOOD || gBoard[i][j] === SUPER_FOOD) {
                gGame.foodCount++
            }
        }
    }

    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].currCellContent === FOOD ||
            gGhosts[i].currCellContent === SUPER_FOOD) {
            gGame.foodCount++
        }
    }

    renderBoard(gBoard, '.board-container')
    for (var i = 0; i < gGhosts.length; i++) {
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
    gGame.isOn = true
    clearInterval(gCherryInterval)
    gCherryInterval = setInterval(createCherry, 15000)
}


function buildBoard() {
    const SIZE = 10
    const board = []
    gGame.foodCount = 0

    for (var i = 0; i < SIZE; i++) {
        board.push([])

        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL

            }
            if (board[i][j] === FOOD) {
                gGame.foodCount++
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[1][SIZE - 2] = SUPER_FOOD
    board[SIZE - 2][1] = SUPER_FOOD
    board[SIZE - 2][SIZE - 2] = SUPER_FOOD

    return board
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over')
    gGame.isOn = false

    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)

    playSound('game over.mp3')

    document.querySelector('.game-over-modal').style.display = 'block'
}

function victory() {
    gGame.isOn = false

    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)

    playSound('win.mp3')

    document.querySelector('.victory-modal').style.display = 'block'
}

function createCherry() {
    if (!gGame.isOn) return

    const emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i: i, j: j })
            }
        }
    }

    if (emptyCells.length === 0) return

    const randomIdx = getRandomIntInclusive(
        0, emptyCells.length - 1
    )

    const location = emptyCells[randomIdx]

    gBoard[location.i][location.j] = CHERRY
    renderCell(location, CHERRY)
}

function playSound(fileName) {
    const audio = new Audio('sounds/' + fileName)
    audio.play()
}