'use strict'

const PACMAN = '😮';
var gPacmanDirection = 'right'
var gPacman;
var gSuperTimeout

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }


    board[gPacman.location.i][gPacman.location.j] = PACMAN

}

function movePacman(ev) {

    if (!gGame.isOn) return
    
    const nextLocation = getNextLocation(ev)

    if (!nextLocation) return
    
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    

    if (nextCell === WALL) return

    switch (ev.code) {
        case 'ArrowUp': gPacmanDirection = 'up'; break
        case 'ArrowDown': gPacmanDirection = 'down'; break
        case 'ArrowLeft': gPacmanDirection = 'left'; break
        case 'ArrowRight': gPacmanDirection = 'right'; break
    }

    if (nextCell === FOOD) {
        updateScore(1)
        gGame.foodCount--
        playSound('eat.mp3')
    }
    else if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        gGame.foodCount--
        activateSuper()
        playSound('eat.mp3')
    }
    else if (nextCell === CHERRY) {
        console.log('CHERRY FOUND!')
        console.log('Score before:', gGame.score)
        updateScore(10)
        playSound('eat.mp3')
    }
    else if (nextCell === GHOST) {
        if (!gPacman.isSuper) {
            gameOver()
            renderCell(gPacman.location, EMPTY)
            return
        }

        const cellContent = eatGhost(nextLocation)
        playSound('eat.mp3')
        if (cellContent === FOOD) {
            updateScore(1)
            gGame.foodCount--
        }
    }

    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    renderCell(gPacman.location, EMPTY)


    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    renderCell(gPacman.location, getPacmanHTML())

    if (gGame.foodCount === 0) {
        victory()
    }
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}

function activateSuper() {
    gPacman.isSuper = true

    renderGhosts()

    clearTimeout(gSuperTimeout)

    gSuperTimeout = setTimeout(function () {
        if (!gGame.isOn) return

        gPacman.isSuper = false

        reviveGhosts()
        renderGhosts()
    }, 5000)
}

function getPacmanHTML() {
    const rotations = {
        right: 90,
        down: 180,
        left: 270,
        up: 0
    }

    return `<span style="display: inline-block; transform: rotate(${rotations[gPacmanDirection]}deg)">${PACMAN}</span>`
}