package ch.jb.scope64.chess

import android.util.Log
import com.github.bhlangonijr.chesslib.Board as LibBoard
import com.github.bhlangonijr.chesslib.Piece as LibPiece
import com.github.bhlangonijr.chesslib.Square as LibSquare

// deine eigenen Types
enum class PieceType { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN }
enum class PieceColor { WHITE, BLACK }
data class Piece(val type: PieceType, val color: PieceColor)

typealias Board = Array<Array<Piece?>>

fun computeBoardForMove(moves: List<String>, moveCount: Int): Board {
    val libBoard = LibBoard() // Standard-Startstellung

    val limit = moveCount.coerceIn(0, moves.size)

    for (i in 0 until limit) {
        val san = moves[i].trim()
        if (san.isEmpty()) continue

        try {
            libBoard.doMove(san)  // chesslib versteht SAN direkt: "e4", "Nf3", "O-O", ...
        } catch (e: Exception) {
            Log.e("scope64", "Fehler bei SAN-Zug '$san' an Index $i", e)
            break
        }
    }

    // chesslib -> dein UI-Board
    val uiBoard: Board = Array(8) { arrayOfNulls<Piece>(8) }

    for (row in 0..7) {
        for (col in 0..7) {
            val fileChar = ('a'.code + col).toChar()      // a..h
            val rankChar = ('8'.code - row).toChar()      // 8..1
            val squareName = "${fileChar.uppercaseChar()}$rankChar"  // "A1", "E4", ...

            val square = LibSquare.valueOf(squareName)
            val libPiece = libBoard.getPiece(square)

            if (libPiece != LibPiece.NONE) {
                uiBoard[row][col] = mapLibPiece(libPiece)
            }
        }
    }

    return uiBoard
}

private fun mapLibPiece(libPiece: LibPiece): Piece {
    val color = if (libPiece.name.startsWith("WHITE")) PieceColor.WHITE else PieceColor.BLACK

    val type = when (libPiece) {
        LibPiece.WHITE_PAWN, LibPiece.BLACK_PAWN -> PieceType.PAWN
        LibPiece.WHITE_KNIGHT, LibPiece.BLACK_KNIGHT -> PieceType.KNIGHT
        LibPiece.WHITE_BISHOP, LibPiece.BLACK_BISHOP -> PieceType.BISHOP
        LibPiece.WHITE_ROOK, LibPiece.BLACK_ROOK -> PieceType.ROOK
        LibPiece.WHITE_QUEEN, LibPiece.BLACK_QUEEN -> PieceType.QUEEN
        LibPiece.WHITE_KING, LibPiece.BLACK_KING -> PieceType.KING
        else -> PieceType.PAWN
    }

    return Piece(type, color)
}
