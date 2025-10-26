import kotlin.random.Random

fun main() {
    val rows = 5
    val cols = 5

    val oldBoard = Array(rows) { IntArray(cols) }
    val newBoard = Array(rows) { IntArray(cols) }

    initRandom(oldBoard)

    println("OLD BOARD (Generation 0):")
    printBoard(oldBoard)

    computeNextGeneration(oldBoard, newBoard)

    println("\nNEW BOARD (Generation 1):")
    printBoard(newBoard)
}

/**
 * Fills board mit random 0/1 values.
 */
fun initRandom(board: Array<IntArray>) {
    for (row in board.indices) {
        for (column in board[row].indices) {
            board[row][column] = Random.nextInt(0, 2)
        }
    }
}

/**
 * Pretty prints the board in the console.
 * alive as '[]' and dead as '.'
 */
fun printBoard(board: Array<IntArray>) {
    for (r in board.indices) {
        for (c in board[r].indices) {
            if (board[r][c] == 1) {
                print("[] ")
            } else {
                print(".  ")
            }
        }
        println()
    }
}

/**
 * Iteration from Conway's Game of Life.
 */
fun computeNextGeneration(oldBoard: Array<IntArray>, newBoard: Array<IntArray>) {
    val rows = oldBoard.size
    val cols = oldBoard[0].size

    for (row in 0 until rows) {
        for (column in 0 until cols) {
            val aliveNeighbors = countAliveNeighbors(oldBoard, row, column)

            val currentCell = oldBoard[row][column]

            newBoard[row][column] = when {
                currentCell == 1 && (aliveNeighbors == 2 || aliveNeighbors == 3) -> 1
                currentCell == 0 && aliveNeighbors == 3 -> 1
                else -> 0
            }
        }
    }
}

/**
 * counts the alive neighbors over (row, col).
 */
fun countAliveNeighbors(board: Array<IntArray>, row: Int, col: Int): Int {
    val rows = board.size
    val cols = board[0].size

    var count = 0

    for (dr in -1..1) {
        for (dc in -1..1) {
            if (dr == 0 && dc == 0) continue // dont count yourself

            val rr = row + dr
            val cc = col + dc

            // Check if inside the board
            if (rr in 0 until rows && cc in 0 until cols) {
                count += board[rr][cc]
            }
        }
    }

    return count
}
