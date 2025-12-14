import { SafeAreaView, View, Text, FlatList, StyleSheet } from "react-native";

const PLAYER_NAME = "DrNykterstein";

const GAMES = [
  { id: "1", opponent: "Firouzja2003", result: "Win", color: "White", timeControl: "Blitz 3+0", date: "2025-11-10", moves: 42, ratingChange: "+7" },
  { id: "2", opponent: "Hikaru", result: "Loss", color: "Black", timeControl: "Blitz 3+0", date: "2025-11-09", moves: 31, ratingChange: "-5" },
  { id: "3", opponent: "AlirezaChess", result: "Win", color: "Black", timeControl: "Rapid 10+0", date: "2025-11-08", moves: 55, ratingChange: "+6" },
  { id: "4", opponent: "GM_Anish", result: "Draw", color: "White", timeControl: "Blitz 5+0", date: "2025-11-07", moves: 60, ratingChange: "+1" },
  { id: "5", opponent: "RandomGM", result: "Win", color: "White", timeControl: "Bullet 1+0", date: "2025-11-06", moves: 29, ratingChange: "+4" },
  { id: "6", opponent: "StrongIM", result: "Win", color: "Black", timeControl: "Blitz 3+2", date: "2025-11-05", moves: 48, ratingChange: "+5" },
  { id: "7", opponent: "ChessFan99", result: "Loss", color: "White", timeControl: "Blitz 3+0", date: "2025-11-04", moves: 25, ratingChange: "-6" },
  { id: "8", opponent: "SuperGM", result: "Win", color: "Black", timeControl: "Rapid 15+10", date: "2025-11-03", moves: 67, ratingChange: "+8" },
  { id: "9", opponent: "BulletMaster", result: "Draw", color: "White", timeControl: "Bullet 1+0", date: "2025-11-02", moves: 40, ratingChange: "0" },
  { id: "10", opponent: "TestUser", result: "Win", color: "Black", timeControl: "Blitz 3+0", date: "2025-11-01", moves: 33, ratingChange: "+3" },
];

const ResultBadge = ({ result }: { result: string }) => {
  let backgroundColor = "#999";

  if (result === "Win") backgroundColor = "#4caf50";
  if (result === "Loss") backgroundColor = "#f44336";
  if (result === "Draw") backgroundColor = "#ff9800";

  return (
      <View style={[styles.resultBadge, { backgroundColor }]}>
        <Text style={styles.resultBadgeText}>{result}</Text>
      </View>
  );
};

const GameItem = ({ game }: { game: any }) => {
  return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.opponentText}>vs {game.opponent}</Text>
          <ResultBadge result={game.result} />
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Color: </Text>
          <Text style={styles.value}>{game.color}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Time control: </Text>
          <Text style={styles.value}>{game.timeControl}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Moves: </Text>
          <Text style={styles.value}>{game.moves}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Date: </Text>
          <Text style={styles.value}>{game.date}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>Rating change: </Text>
          <Text style={styles.value}>{game.ratingChange}</Text>
        </View>
      </View>
  );
};

export default function Index() {
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.playerName}>{PLAYER_NAME}</Text>
          <Text style={styles.subtitle}>Last 10 games (static prototype)</Text>
        </View>

        <FlatList
            data={GAMES}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <GameItem game={item} />}
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  opponentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  resultBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resultBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  cardRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  label: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    color: "#e5e7eb",
    fontSize: 13,
  },
});
