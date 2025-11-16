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
        dateFrom: String?,
        dateTo: String?,
        ratingMin: Int?,
        ratingMax: Int?
    ) {
        val user = username.trim()
        if (user.isEmpty()) {
            errorMessage.value = "Bitte einen Lichess-Username eingeben."
            return
        }

        isLoading.value = true
        errorMessage.value = null
        games.clear()

        val sinceMs = parseDateToMillis(dateFrom)
        val untilMs = parseDateToMillis(dateTo)

        val params = mutableListOf(
            "max=30",            // z.B. max 30 Partien
            "moves=true",
            "pgnInJson=true",
            "opening=true"
        )

        if (sinceMs != null) params += "since=$sinceMs"
        if (untilMs != null) params += "until=$untilMs"

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
                    parseNdjsonResponse(response, ratingMin, ratingMax)
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
        response: String,
        ratingMin: Int?,
        ratingMax: Int?
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

                    // Rating-Filter (optional)
                    if (!ratingPassesFilter(whiteRating, blackRating, ratingMin, ratingMax)) {
                        return@forEachIndexed
                    }

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


    private fun ratingPassesFilter(
        whiteRating: Int?,
        blackRating: Int?,
        ratingMin: Int?,
        ratingMax: Int?
    ): Boolean {
        // Wenn kein Filter gesetzt ist: alles durchlassen
        if (ratingMin == null && ratingMax == null) return true

        val wr = whiteRating ?: 0
        val br = blackRating ?: 0

        val minOk = ratingMin?.let { wr >= it || br >= it } ?: true
        val maxOk = ratingMax?.let { wr <= it || br <= it } ?: true

        return minOk && maxOk
    }

    private fun parseDateToMillis(date: String?): Long? {
        if (date.isNullOrBlank()) return null
        return try {
            val parts = date.split("-")
            if (parts.size != 3) return null
            val year = parts[0].toInt()
            val month = parts[1].toInt() - 1 // Calendar: 0-basiert
            val day = parts[2].toInt()

            val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
            cal.set(year, month, day, 0, 0, 0)
            cal.set(Calendar.MILLISECOND, 0)
            cal.timeInMillis
        } catch (e: Exception) {
            null
        }
    }
}
