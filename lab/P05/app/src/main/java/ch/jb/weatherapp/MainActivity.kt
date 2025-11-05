package ch.jb.weatherapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.jb.weatherapp.ui.theme.WeatherAppTheme
import androidx.lifecycle.viewmodel.compose.viewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WeatherAppTheme {
                WeatherScreen()
            }
        }
    }
}

@Composable
fun WeatherScreen(model: WeatherViewModel = viewModel()) {

    val temp = model.temperatureNow.value
    val desc = model.description.value
    val place = model.placeName.value

    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(id = R.drawable.zurich),
            contentDescription = "Weather App",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(top = 150.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            Text(
                text = desc,
                fontSize = 16.sp,
                color = Color.White,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(top = 4.dp)
            )
            Text(
                text = place,
                fontSize = 16.sp,
                fontStyle = FontStyle.Italic,
                color = Color.White,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(top = 8.dp)
            )
            Text(
                text = temp?.let { String.format("%.1f °C", it) } ?: "— °C",
                fontSize = 96.sp,
                color = Color.White,
                textAlign = TextAlign.Center,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )

            // (Optional) Mini-Vorschau Nächste Tage ↓/↑ — passt zur Übung “Next Days” :contentReference[oaicite:12]{index=12}
            if (model.days.isNotEmpty()) {
                Column(modifier = Modifier.padding(top = 24.dp)) {
                    for (i in 0 until minOf(3, model.days.size)) {
                        Text(
                            text = "${model.days[i]}  ↓ ${String.format("%.1f", model.minT[i])}°  ↑ ${String.format("%.1f", model.maxT[i])}°",
                            fontSize = 16.sp,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}


@Preview(showBackground = false, showSystemUi = true)
@Composable
fun WeatherScreenPreview() {
    WeatherAppTheme {
        WeatherScreen()
    }
}