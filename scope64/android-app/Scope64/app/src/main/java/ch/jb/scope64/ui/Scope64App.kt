package ch.jb.scope64.ui

import ch.jb.scope64.viewmodel.GamesSearchViewModel
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import ch.jb.scope64.ui.home.HomeScreen
import androidx.lifecycle.viewmodel.compose.viewModel
import ch.jb.scope64.model.GameSummary
import ch.jb.scope64.ui.detail.GameDetailScreen
import ch.jb.scope64.ui.results.ResultsScreen

sealed class Screen {
    object Search : Screen()
    object Results : Screen()
    data class GameDetail(val game: GameSummary) : Screen()
}

@Composable
fun Scope64App() {
    val viewModel: GamesSearchViewModel = viewModel()
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Search) }

    when (val screen = currentScreen) {
        is Screen.Search -> {
            HomeScreen(
                onSearch = { name ->
                    viewModel.searchGames(name)
                    currentScreen = Screen.Results
                }
            )
        }

        is Screen.Results -> {
            ResultsScreen(
                games = viewModel.games,
                isLoading = viewModel.isLoading.value,
                errorMessage = viewModel.errorMessage.value,
                onBack = { currentScreen = Screen.Search },
                onGameClick = { game ->
                    currentScreen = Screen.GameDetail(game)
                }
            )
        }

        is Screen.GameDetail -> {
            GameDetailScreen(
                game = screen.game,
                onBack = { currentScreen = Screen.Results }
            )
        }
    }
}