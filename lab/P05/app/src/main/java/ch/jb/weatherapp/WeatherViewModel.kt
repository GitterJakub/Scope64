package ch.jb.weatherapp

import android.app.Application
import android.util.Log
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.beust.klaxon.Klaxon

class WeatherViewModel(application: Application) : AndroidViewModel (application) {

    // STATE
    val placeName = mutableStateOf("Zürich")
    val description = mutableStateOf("…")
    val temperatureNow = mutableStateOf<Double?>(null)

    val days = mutableStateListOf<String>()
    val maxT = mutableStateListOf<Double>()
    val minT = mutableStateListOf<Double>()

    private val endpoint = "https://api.open-meteo.com/v1/forecast?latitude=47.37&longitude=8.55" +
            "&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FZurich"

    init {
        loadWeatherData()
    }

    private fun loadWeatherData() {
        val ctx = getApplication<Application>().applicationContext
        val q = Volley.newRequestQueue(ctx)

        val req = StringRequest(
            Request.Method.GET,
            endpoint,
            { response ->
                try {
                    Log.d("WeatherVM", "OK: len=${response.length}")
                    val parsed = Klaxon().parse<ch.jb.weatherapp.data.WeatherResponse>(response)
                    val cw = parsed?.current_weather
                    val dl = parsed?.daily

                    temperatureNow.value = cw?.temperature
                    description.value = weatherCodeTitle(cw?.weathercode)

                    days.clear(); maxT.clear(); minT.clear()
                    if (dl?.time != null && dl.temperature_2m_max != null && dl.temperature_2m_min != null) {
                        // gleiche Länge annehmen — Open-Meteo liefert synchronisierte Arrays
                        for (i in dl.time.indices) {
                            days.add(dl.time[i])
                            maxT.add(dl.temperature_2m_max[i])
                            minT.add(dl.temperature_2m_min[i])
                        }
                    }
                } catch (e: Exception) {
                    Log.e("WeatherVM", "Parse error: ${e.message}")
                }
            },
            { err ->
                Log.e("WeatherVM", "HTTP error: $err")
            }
        )
        q.add(req)
    }

    fun weatherCodeTitle(weatherCode: Int?) : String {
        return when (weatherCode) {
            0 -> "Clear sky"
            1 -> "Mainly clear"
            2, 3 -> "Partly Cloudy"
            in 40..49 -> "Fog or Ice Fog"
            in 50..59 -> "Drizzle"
            in 60..69 -> "Rain"
            in 70..79 -> "Snow Fall"
            in 80..84 -> "Rain Showers"
            85, 86 -> "Snow Showers"
            87, 88 -> "Shower(s) of Snow Pellets"
            89, 90 -> "Hail"
            in 91..99 -> "Thunderstorm"
            else -> "unknown $weatherCode"
        }
    }
}