package ch.jb.scope64.model

data class GameSummary(
    val id: String,
    val whiteName: String,
    val blackName: String,
    val whiteRating: Int?,
    val blackRating: Int?,
    val winner: String?,      // "white", "black" or null (Remis)
    val moves: String,
    val createdAt: Long
)

