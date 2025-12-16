import {useEffect, useMemo, useState} from "react";
import {View, Text, StyleSheet, ActivityIndicator, FlatList, Pressable, Linking} from "react-native";
import {useLocalSearchParams, router} from "expo-router";

type LichessGame = {
    id: string;
    createdAt?: number;
    lastMoveAt?: number;
    speed?: string; // bullet/blitz/rapid/classical...
    perf?: string;
    status?: string;
    players?: {
        white?: { user?: { id?: string; name?: string }; rating?: number };
        black?: { user?: { id?: string; name?: string }; rating?: number };
    };
    winner?: "white" | "black";
};

// Helpers (oben im File, unter den types)

function formatDate(ms?: number) {
    if (!ms) return "";
    const d = new Date(ms);
    // Simple, ohne i18n lib:
    return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
}

function normalizeName(x?: string) {
    return (x ?? "").trim().toLowerCase();
}

function getMyColor(game: LichessGame, me: string): "white" | "black" | null {
    const white = normalizeName(game.players?.white?.user?.id || game.players?.white?.user?.name);
    const black = normalizeName(game.players?.black?.user?.id || game.players?.black?.user?.name);
    const my = normalizeName(me);

    if (white && white === my) return "white";
    if (black && black === my) return "black";
    return null;
}

function getOpponentName(game: LichessGame, me: string) {
    const myColor = getMyColor(game, me);
    if (!myColor) {
        // fallback
        const w = game.players?.white?.user?.name ?? "White";
        const b = game.players?.black?.user?.name ?? "Black";
        return `${w} vs ${b}`;
    }
    const opp =
        myColor === "white"
            ? game.players?.black?.user?.name ?? "Opponent"
            : game.players?.white?.user?.name ?? "Opponent";
    return opp;
}

function getResultForMe(game: LichessGame, me: string): "W" | "L" | "D" | "?" {
    const myColor = getMyColor(game, me);
    if (!myColor) return "?";
    if (!game.winner) return "D"; // oft bei draws / unfinished: best-effort
    if (game.winner === myColor) return "W";
    return "L";
}

function pillText(game: LichessGame) {
    // speed ist meistens bullet/blitz/rapid/classical…
    return (game.speed ?? game.perf ?? "game").toUpperCase();
}


function parseNdjson(text: string): any[] {
    return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
            try {
                return JSON.parse(l);
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

async function fetchLastGames(username: string, max = 10): Promise<LichessGame[]> {
    const url = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?max=${max}&moves=false&pgnInJson=true&clocks=false&opening=false`;

    const res = await fetch(url, {
        headers: {
            // Lichess liefert Games als NDJSON
            Accept: "application/x-ndjson",
        },
    });

    if (res.status === 429) throw new Error("Zu viele Requests (429). Bitte kurz warten und erneut versuchen.");
    if (!res.ok) throw new Error(`API Fehler (${res.status}).`);

    const body = await res.text();
    const games = parseNdjson(body) as LichessGame[];
    return games;
}

export default function ResultsPage() {
    const {username} = useLocalSearchParams<{ username?: string }>();
    const user = useMemo(() => (username ?? "").trim(), [username]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [games, setGames] = useState<LichessGame[]>([]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user) throw new Error("Kein Username übergeben.");
                const data = await fetchLastGames(user, 10);
                if (!cancelled) setGames(data);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Unbekannter Fehler.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user]);

    const renderItem = ({item}: { item: LichessGame }) => {
        const opp = getOpponentName(item, user);
        const meColor = getMyColor(item, user);
        const result = getResultForMe(item, user);

        const date = formatDate(item.createdAt ?? item.lastMoveAt);
        const speed = pillText(item);

        const myRating =
            meColor === "white" ? item.players?.white?.rating : meColor === "black" ? item.players?.black?.rating : undefined;
        const oppRating =
            meColor === "white" ? item.players?.black?.rating : meColor === "black" ? item.players?.white?.rating : undefined;
        const myName =
            meColor === "white" ? item.players?.white?.user?.name : meColor === "black" ? item.players?.black?.user?.name : undefined;
        const oppName =
            meColor === "white" ? item.players?.black?.user?.name : meColor === "black" ? item.players?.white?.user?.name : undefined;


        return (
            <Pressable
                style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
                onPress={() =>
                    router.push({
                        pathname: "/game/[id]",
                        params: {id: item.id, username: user},
                    })}
            >
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{opp}</Text>

                    <View style={styles.pills}>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>{speed}</Text>
                        </View>

                        <View
                            style={[styles.pill, result === "W" ? styles.pillWin : result === "L" ? styles.pillLoss : styles.pillDraw]}>
                            <Text style={styles.pillText}>{result}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    {!!date && <Text style={styles.metaText}>{date}</Text>}
                    {(myRating || oppRating) && (
                        <Text style={styles.metaText}>
                            {myRating ? `${myName} ${myRating}` : "You ?"} · {oppRating ? `${oppName} ${oppRating}` : "Opp ?"}
                        </Text>
                    )}
                </View>

                <Text style={styles.cardLink}>lichess.org/{item.id}</Text>
            </Pressable>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>
                <Text style={styles.title}>Last games</Text>
                <Text style={styles.subtitle}>{user}</Text>
            </View>

            {loading && (
                <View style={styles.center}>
                    <ActivityIndicator/>
                    <Text style={styles.muted}>Loading games…</Text>
                </View>
            )}

            {!!error && (
                <View style={styles.center}>
                    <Text style={styles.error}>{error}</Text>
                </View>
            )}

            {!loading && !error && (
                <FlatList
                    data={games}
                    keyExtractor={(g) => g.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, paddingTop: 16},
    header: {paddingHorizontal: 16, paddingBottom: 8},
    backBtn: {paddingVertical: 6},
    backText: {fontSize: 16},
    title: {fontSize: 24, fontWeight: "700", marginTop: 4},
    subtitle: {fontSize: 14, color: "#666", marginTop: 2},

    center: {flex: 1, alignItems: "center", justifyContent: "center", padding: 16},
    muted: {marginTop: 10, color: "#666"},
    error: {color: "#b00020", textAlign: "center"},

    listContent: {padding: 16, gap: 12},

    card: {
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 14,
        padding: 14,
    },
    cardPressed: {opacity: 0.85},
    cardTitle: {fontSize: 16, fontWeight: "700"},
    cardMeta: {marginTop: 6, color: "#444"},
    cardLink: {marginTop: 8, color: "#666"},
    cardTopRow: {flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10},
    pills: {flexDirection: "row", gap: 8, alignItems: "center"},

    pill: {
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    pillText: {fontSize: 12, fontWeight: "700"},

    pillWin: {borderColor: "#cfe9d8"},
    pillLoss: {borderColor: "#f2c9c9"},
    pillDraw: {borderColor: "#e6e6e6"},

    metaRow: {marginTop: 10, flexDirection: "row", justifyContent: "space-between", gap: 10},
    metaText: {color: "#555", fontSize: 13},

});
