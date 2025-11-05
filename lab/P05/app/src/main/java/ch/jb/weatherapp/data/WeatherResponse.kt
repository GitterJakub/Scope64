package ch.jb.weatherapp.data


data class WeatherResponse(
    val timezone: String?,
    val current_weather: CurrentWeather?,
    val daily: Daily?
)
