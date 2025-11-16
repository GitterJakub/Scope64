package ch.jb.scope64.ui.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.jb.scope64.model.GameSummary
import ch.jb.scope64.chess.Board
import ch.jb.scope64.chess.ChessBoard
import ch.jb.scope64.chess.computeBoardForMove

@Composable
fun GameDetailScreen(
    game: GameSummary,
    onBack: () -> Unit
) {
    val moves = remember(game.id) {
        game.moves
            .split(" ")
            .map { it.trim() }
            .filter { it.isNotBlank() }
    }

    var currentIndex by remember { mutableStateOf(0) } // wie viele Züge angewendet sind

    val board: Board = remember(game.id, currentIndex) {
        computeBoardForMove(moves, currentIndex)
    }

    val totalMoves = moves.size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0F0F))
            .padding(16.dp)
    ) {
        // Topbar
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack) {
                Text("< Back", color = Color.Cyan)
            }
            Spacer(Modifier.width(8.dp))
            Text(
                "${game.whiteName} vs ${game.blackName}",
                color = Color.White,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(Modifier.height(16.dp))

        // Brett
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f),
            contentAlignment = Alignment.Center
        ) {
            ChessBoard(board = board)
        }

        Spacer(Modifier.height(16.dp))

        // Move Info
        Text(
            text = "Move: $currentIndex / $totalMoves",
            color = Color.Gray,
            fontSize = 14.sp
        )

        if (currentIndex > 0 && currentIndex <= moves.size) {
            Text(
                text = "Last move: ${moves[currentIndex - 1]}",
                color = Color.Gray,
                fontSize = 14.sp
            )
        }

        Spacer(Modifier.height(16.dp))

        // Controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Button(
                onClick = { currentIndex = 0 },
                enabled = currentIndex > 0
            ) { Text("|<") }

            Button(
                onClick = { if (currentIndex > 0) currentIndex-- },
                enabled = currentIndex > 0
            ) { Text("<") }

            Button(
                onClick = { if (currentIndex < totalMoves) currentIndex++ },
                enabled = currentIndex < totalMoves
            ) { Text(">") }

            Button(
                onClick = { currentIndex = totalMoves },
                enabled = currentIndex < totalMoves
            ) { Text(">|") }
        }

        Spacer(Modifier.height(16.dp))

        // MoveList

        Text(
            text = game.moves,
            color = Color.Gray,
            fontSize = 14.sp
        )
    }
}
