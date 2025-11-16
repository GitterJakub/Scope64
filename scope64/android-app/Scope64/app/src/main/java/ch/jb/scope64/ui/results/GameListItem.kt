package ch.jb.scope64.ui.results

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.jb.scope64.model.GameSummary
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun GameListItem(
    game: GameSummary,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val dateText = formatDate(game.createdAt)
    val resultText = when (game.winner) {
        "white" -> "1–0"
        "black" -> "0–1"
        else -> "½–½"
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(Color(0xFF1A1A1A), RoundedCornerShape(16.dp))
            .padding(12.dp)
            .clickable { onClick() }
    ) {
        Column {
            Text(
                "${game.whiteName} (${game.whiteRating ?: "-"})",
                color = Color.White,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp
            )
            Text(
                "${game.blackName} (${game.blackRating ?: "-"})",
                color = Color.White,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp
            )

            Spacer(Modifier.height(4.dp))

            Text(
                "Result: $resultText · Moves: ${game.moves.split(" ").size}",
                color = Color.Gray,
                fontSize = 12.sp
            )

            Text(
                dateText,
                color = Color.Gray,
                fontSize = 12.sp
            )
        }
    }
}

private fun formatDate(millis: Long): String {
    if (millis == 0L) return "-"
    val sdf = SimpleDateFormat("dd.MM.yyyy HH:mm", Locale.getDefault())
    return sdf.format(Date(millis))
}
