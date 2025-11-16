package ch.jb.scope64.ui.results

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.jb.scope64.model.GameSummary

@Composable
fun ResultsScreen(
    games: List<GameSummary>,
    isLoading: Boolean,
    errorMessage: String?,
    onBack: () -> Unit,
    onGameClick: (GameSummary) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0F0F))
            .padding(16.dp)
    ) {
        // Top Bar
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextButton(onClick = onBack) {
                Text("< Back", color = Color.Cyan)
            }
            Spacer(Modifier.width(8.dp))
            Text(
                "Search Results",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(Modifier.height(16.dp))

        when {
            isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            errorMessage != null -> {
                Text(errorMessage, color = Color(0xFFFF5252))
            }

            games.isEmpty() -> {
                Text("No games found.", color = Color.Gray)
            }

            else -> {
                val latest10 = games
                    .sortedByDescending { it.createdAt }
                    .take(10)

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(latest10) { game ->
                        GameListItem(
                            game = game,
                            onClick = { onGameClick(game) }
                        )
                    }
                }
            }
        }
    }
}
