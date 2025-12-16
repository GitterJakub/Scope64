package ch.jb.scope64.viewmodel

import android.app.Application
import android.util.Log
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import ch.jb.scope64.model.GameSummary
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import org.json.JSONObject
import java.util.Calendar
import java.util.TimeZone

class GamesSearchViewModel(application: Application) : AndroidViewModel(application) {

    val isLoading = mutableStateOf(false)
    val errorMessage = mutableStateOf<String?>(null)
    val games = mutableStateListOf<GameSummary>()

    private val context = getApplication<Application>().applicationContext

    fun searchGames(
        username: String,
    ) {
        val user = username.trim()
        if (user.isEmpty()) {
            errorMessage.value = "Bitte einen Lichess-Username eingeben."
            return
        }

        isLoading.value = true
        errorMessage.value = null
        games.clear()

        val params = mutableListOf(
            "max=30",            // z.B. max 30 Partien
            "moves=true",
            "pgnInJson=true",
            "opening=true"
        )


        val url = "https://lichess.org/api/games/user/$user?" +
                params.joinToString("&")

        Log.d("scope64", "Request URL = $url")

        val queue = Volley.newRequestQueue(context)

        val request = object : StringRequest(
            Method.GET,
            url,
            { response ->
                isLoading.value = false
                Log.d("scope64", "Response preview: ${response.take(200)}")
                try {
                    parseNdjsonResponse(response)
                } catch (e: Exception) {
                    Log.e("scope64", "Parsing error", e)
                    errorMessage.value = "Fehler beim Verarbeiten der Daten."
                }
            },
            { error ->
                isLoading.value = false
                Log.e("scope64", "HTTP error: ${error.networkResponse?.statusCode}", error)
                errorMessage.value = when {
                    error.networkResponse?.statusCode == 404 ->
                        "User nicht gefunden (404)."
                    else ->
                        "API-Fehler oder Netzwerkproblem."
                }
            }

        ) {
            override fun getHeaders(): MutableMap<String, String> {
                // Wichtig: NDJSON anfordern, damit pgnInJson greift :contentReference[oaicite:4]{index=4}
                return mutableMapOf(
                    "Accept" to "application/x-ndjson"
                )
            }
        }

        queue.add(request)
    }

    private fun parseNdjsonResponse(
        response: String
    ) {
        response.lineSequence()
            .filter { it.isNotBlank() }
            .forEachIndexed { index, line ->
                try {
                    val obj = JSONObject(line)

                    val id = obj.getString("id")
                    val createdAt = obj.optLong("createdAt")

                    val players = obj.getJSONObject("players")

                    val white = players.getJSONObject("white")
                    val black = players.getJSONObject("black")

                    val whiteUser = white.optJSONObject("user")
                    val blackUser = black.optJSONObject("user")

                    val whiteName = whiteUser?.optString("name")
                        ?: whiteUser?.optString("id")
                        ?: "White"
                    val blackName = blackUser?.optString("name")
                        ?: blackUser?.optString("id")
                        ?: "Black"

                    val whiteRating = if (white.has("rating")) white.getInt("rating") else null
                    val blackRating = if (black.has("rating")) black.getInt("rating") else null

                    val winner = obj.optString("winner", "")
                        .takeIf { it.isNotEmpty() }

                    val moves = obj.optString("moves", "")


                    games += GameSummary(
                        id = id,
                        whiteName = whiteName,
                        blackName = blackName,
                        whiteRating = whiteRating,
                        blackRating = blackRating,
                        winner = winner,
                        moves = moves,
                        createdAt = createdAt
                    )
                } catch (e: Exception) {
                    Log.e("scope64", "Error parsing line $index: $line", e)
                }
            }

        if (games.isEmpty()) {
            errorMessage.value = "Keine Partien mit diesen Filtern gefunden."
        }
    }

}
