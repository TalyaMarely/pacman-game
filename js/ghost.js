'use strict'

const GHOST = '&#9781;'

var gGhosts = []
var gIntervalGhosts

function createGhost(board, location) {
    const ghost = {
        location: location,
        currCellContent: board[location.i][location.j],
        color: getRandomColor()
    }

    gGhosts.push(ghost)
    board[location.i][location.j] = GHOST
}

function createGhosts(board) {
    gGhosts = []

    const positions = [
        { i: 1, j: 1 },
        { i: 1, j: 4 },
        { i: 1, j: 8 }
    ]

    for (var i = 0; i < 3; i++) {
        createGhost(board, positions[i])
    }

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}
function moveGhosts() {
    for (var i = gGhosts.length - 1; i >= 0; i--) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    const moveDiff = getMoveDiff();
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) {
            gBoard[ghost.location.i][ghost.location.j] =
                ghost.currCellContent

            renderCell(ghost.location, ghost.currCellContent)

            const ghostIdx = gGhosts.indexOf(ghost)
            gGhosts.splice(ghostIdx, 1)

            return
        }

        gameOver()
        return
    }

    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

    renderCell(ghost.location, ghost.currCellContent)

    ghost.location = nextLocation
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const color = gPacman.isSuper ? 'blue' : ghost.color

    return `<span style="color: ${color}">${GHOST}</span>`
}

function getRandomColor() {
    const colors = ['red', 'pink', 'orange', 'cyan', 'purple']

    const randomIdx = getRandomIntInclusive(0, colors.length - 1)

    return colors[randomIdx]
}

function eatGhost(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]

        if (ghost.location.i === location.i &&
            ghost.location.j === location.j) {

            const cellContent = ghost.currCellContent

            gGhosts.splice(i, 1)

            return cellContent
        }
    }

    return EMPTY
}


function renderGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function reviveGhosts() {
    while (gGhosts.length < 3) {
        const emptyCells = []

        for (var i = 1; i < gBoard.length - 1; i++) {
            for (var j = 1; j < gBoard[i].length - 1; j++) {
                if (gBoard[i][j] === EMPTY ||
                    gBoard[i][j] === FOOD) {
                    emptyCells.push({ i: i, j: j })
                }
            }
        }

        if (emptyCells.length === 0) return

        const randomIdx = getRandomIntInclusive(
            0, emptyCells.length - 1
        )

        createGhost(gBoard, emptyCells[randomIdx])
    }

    renderGhosts()
}