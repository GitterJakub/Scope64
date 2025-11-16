package ch.jb.scope64.chess

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.sp

@Composable
fun ChessBoard(board: Board, modifier: Modifier = Modifier) {
    val light = Color(0xFFEEEED2)
    val dark = Color(0xFF769656)

    Column(
        modifier = modifier
            .fillMaxSize()
    ) {
        for (row in 0..7) {
            Row(Modifier.weight(1f)) {
                for (col in 0..7) {
                    val isLight = (row + col) % 2 == 0
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxSize()
                            .background(if (isLight) light else dark),
                        contentAlignment = Alignment.Center
                    ) {
                        val piece = board[row][col]
                        if (piece != null) {
                            Text(
                                text = pieceToUnicode(piece),
                                fontSize = 28.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun pieceToUnicode(piece: Piece): String {
    return when (piece.color) {
        PieceColor.WHITE -> when (piece.type) {
            PieceType.KING -> "♔"
            PieceType.QUEEN -> "♕"
            PieceType.ROOK -> "♖"
            PieceType.BISHOP -> "♗"
            PieceType.KNIGHT -> "♘"
            PieceType.PAWN -> "♙"
        }
        PieceColor.BLACK -> when (piece.type) {
            PieceType.KING -> "♚"
            PieceType.QUEEN -> "♛"
            PieceType.ROOK -> "♜"
            PieceType.BISHOP -> "♝"
            PieceType.KNIGHT -> "♞"
            PieceType.PAWN -> "♟"
        }
    }
}
