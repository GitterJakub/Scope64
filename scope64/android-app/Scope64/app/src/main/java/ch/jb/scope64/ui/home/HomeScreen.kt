package ch.jb.scope64.ui.home

import RatingRangeSlider
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * HomeScreen als Suchmaske:
 * - Name/Username
 * - Datumsbereich (von/bis, optional)
 * - Ratingbereich (min/max, optional)
 */
@Composable
fun HomeScreen(
    onSearch: (
        nameOrUser: String
    ) -> Unit = { _ -> }
) {
    var nameOrUser by remember { mutableStateOf("") }

    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0F0F0F))
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.Start
    ) {
        // Titel
        Text(
            text = "Scope 64",
            color = Color.White,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Find Games & Players on Lichess",
            color = Color.Gray,
            fontSize = 14.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Chess Player / Lichess-Username",
            color = Color.White,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = nameOrUser,
            onValueChange = { nameOrUser = it },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            placeholder = {
                Text(
                    "e.g. DrNykterstein",
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Error
        errorMessage?.let { msg ->
            Text(
                text = msg,
                color = Color(0xFFFF5252),
                fontSize = 14.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        // Buttons
        Button(
            onClick = {
                val trimmedName = nameOrUser.trim()
                if (trimmedName.isEmpty()) {
                    errorMessage = "Please enter at least one player/username."
                } else {
                    errorMessage = null

                    onSearch(
                        trimmedName
                    )
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Text("Search")
        }

        TextButton(
            onClick = {
                // Reset Filter
                nameOrUser = ""
                errorMessage = null
            },
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Text("Reset filter")
        }
    }
}
