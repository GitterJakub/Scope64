import androidx.compose.material3.RangeSlider
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.*
import androidx.compose.ui.unit.dp

@Composable
fun RatingRangeSlider(
    onRatingChange: (Int?, Int?) -> Unit
) {
    val minLimit = 100f
    val maxLimit = 4000f

    // Startvalues for the range
    var ratingRange by remember { mutableStateOf(minLimit..2200f) }

    Column {
        Text(
            text = "Rating (optional)",
            color = Color.White,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium
        )

        Spacer(Modifier.height(8.dp))

        // Display of the actual range
        Text(
            text = "${ratingRange.start.toInt()} – ${ratingRange.endInclusive.toInt()}",
            fontSize = 14.sp,
            color = Color.Gray
        )

        Spacer(Modifier.height(12.dp))

        RangeSlider(
            value = ratingRange,
            onValueChange = { newRange ->
                ratingRange = newRange
                onRatingChange(
                    newRange.start.toInt(),
                    newRange.endInclusive.toInt()
                )
            },
            valueRange = minLimit..maxLimit,
            modifier = Modifier.fillMaxWidth()
        )
    }
}
