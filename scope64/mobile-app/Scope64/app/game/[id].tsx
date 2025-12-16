import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Linking, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ChessBoard from "../../components/ChessBoard";
import { Chess } from "chess.js";

type GameExport = {
    id: string;
    createdAt?: number;
    lastMoveAt?: number;
    speed?: string;
    perf?: string;
    status?: string;
    winner?: "white" | "black";
    players?: {
        white?: { user?: { id?: string; name?: string }; rating?: number };
        black?: { user?: { id?: string; name?: string }; rating?: number };
    };
    moves?: string;
    pgn?: string; // kann je nach Parametern vorhanden sein
};

function formatDate(ms?: number) {
    if (!ms) return "";
    const d = new Date(ms);
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}
${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

async function fetchGameExport(id: string): Promise<GameExport> {
    const url = `https://lichess.org/game/export/${encodeURIComponent(id)}?pgnInJson=true`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (res.status === 429) {
        // Lichess: bei 429 eine volle Minute warten
        throw new Error("Zu viele Requests (429). Bitte 1 Minute warten und erneut versuchen.");
    }
    if (!res.ok) throw new Error(`API Fehler (${res.status}).`);

    return (await res.json()) as GameExport;
}

function normalizeName(x?: string) {
    return (x ?? "").trim().toLowerCase();
}

function getMyColor(game: any, me: string): "white" | "black" | null {
    const white = normalizeName(game.players?.white?.user?.id || game.players?.white?.user?.name);
    const black = normalizeName(game.players?.black?.user?.id || game.players?.black?.user?.name);
    const my = normalizeName(me);

    if (white && white === my) return "white";
    if (black && black === my) return "black";
    return null;
}



export default function GameDetailPage() {
    const { id, username } = useLocalSearchParams<{ id?: string; username?: string }>();
    const gameId = useMemo(() => (id ?? "").trim(), [id]);
    const user = useMemo(() => (username ?? "").trim(), [username]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [game, setGame] = useState<GameExport | null>(null);
    const [moveIndex, setMoveIndex] = useState(0);

    const myColor = game ? getMyColor(game, user) : null;
    const flipped = myColor === "black";


    const moves = useMemo(() => {
        if (!game?.moves) return [];
        return game.moves.split(" ");
    }, [game]);

    const fen = useMemo(() => {
        const chess = new Chess();
        for (let i = 0; i < moveIndex; i++) {
            chess.move(moves[i]);
        }
        return chess.fen();
    }, [moves, moveIndex]);


    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                if (!gameId) throw new Error("Kein Game-ID übergeben.");
                const data = await fetchGameExport(gameId);
                if (!cancelled) setGame(data);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Unbekannter Fehler.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [gameId]);

    const openOnLichess = () => Linking.openURL(`https://lichess.org/${gameId}`);

    const white = game?.players?.white?.user?.name ?? "White";
    const black = game?.players?.black?.user?.name ?? "Black";
    const speed = (game?.speed ?? game?.perf ?? "game").toUpperCase();
    const date = formatDate(game?.createdAt ?? game?.lastMoveAt);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>
                <Text style={styles.title}>Game Details</Text>
                {!!user && <Text style={styles.subtitle}>{user}</Text>}
            </View>

            {loading && (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.muted}>Loading game…</Text>
                </View>
            )}

            {!!error && (
                <View style={styles.center}>
                    <Text style={styles.error}>{error}</Text>
                    <Pressable style={styles.primaryBtn} onPress={openOnLichess}>
                        <Text style={styles.primaryBtnText}>Open on Lichess</Text>
                    </Pressable>
                </View>
            )}

            {!loading && !error && game && (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {white} vs {black}
                        </Text>

                        <View style={styles.row}>
                            <Text style={styles.meta}>{speed}</Text>
                            {!!date && <Text style={styles.meta}>{date}</Text>}
                        </View>

                        <Text style={styles.meta}>
                            Result:{" "}
                            {game.winner === "white" ? "1-0" : game.winner === "black" ? "0-1" : "½-½ / ?"}
                        </Text>

                        <Text style={styles.meta}>
                            Ratings: {game.players?.white?.rating ?? "?"} – {game.players?.black?.rating ?? "?"}
                        </Text>
                    </View>

                    <View style={{ marginVertical: 16 }}>
                        <ChessBoard fen={fen} flipped={flipped} />
                    </View>

                    <View style={styles.navRow}>
                        <Pressable
                            style={styles.navBtn}
                            onPress={() => setMoveIndex(0)}
                        >
                            <Text>⏮</Text>
                        </Pressable>

                        <Pressable
                            style={styles.navBtn}
                            onPress={() => setMoveIndex(Math.max(0, moveIndex - 1))}
                        >
                            <Text>◀</Text>
                        </Pressable>

                        <Text style={styles.moveText}>
                            {moveIndex}/{moves.length}
                        </Text>

                        <Pressable
                            style={styles.navBtn}
                            onPress={() =>
                                setMoveIndex(Math.min(moves.length, moveIndex + 1))
                            }
                        >
                            <Text>▶</Text>
                        </Pressable>

                        <Pressable
                            style={styles.navBtn}
                            onPress={() => setMoveIndex(moves.length)}
                        >
                            <Text>⏭</Text>
                        </Pressable>
                    </View>


                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Moves</Text>
                        <Text style={styles.mono}>
                            {game.moves ? game.moves : "No moves field found."}
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>PGN</Text>
                        <Text style={styles.mono}>
                            {game.pgn ? game.pgn : "No PGN field found (try pgnInJson=true)."}
                        </Text>
                    </View>

                    <Pressable style={styles.primaryBtn} onPress={openOnLichess}>
                        <Text style={styles.primaryBtnText}>Open on Lichess</Text>
                    </Pressable>
                </ScrollView>
            )}
        </View>
    );
}



const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 16 },
    header: { paddingHorizontal: 16, paddingBottom: 8 },
    backBtn: { paddingVertical: 6 },
    backText: { fontSize: 16 },
    title: { fontSize: 24, fontWeight: "700", marginTop: 4 },
    subtitle: { fontSize: 14, color: "#666", marginTop: 2 },

    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
    muted: { marginTop: 10, color: "#666" },
    error: { color: "#b00020", textAlign: "center", marginBottom: 12 },

    content: { padding: 16, gap: 12, paddingBottom: 24 },

    card: { borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 14, padding: 14 },
    cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },

    row: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 6 },
    meta: { color: "#444" },

    sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
    mono: { fontFamily: "monospace", color: "#222", lineHeight: 18 },

    primaryBtn: { marginTop: 6, backgroundColor: "#111", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
    primaryBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
    navRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    navBtn: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
    moveText: {
        fontWeight: "600",
    }

});
