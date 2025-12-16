import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import {router} from "expo-router";

type LichessUser = {
    id: string;
    username: string;
    title?: string;
    perfs?: Record<string, { rating?: number }>;
    createdAt?: number;
    seenAt?: number;
    profile?: { bio?: string; country?: string; firstName?: string; lastName?: string };
    count?: { all?: number; rated?: number; win?: number; loss?: number; draw?: number };
};

async function fetchLichessUser(username: string): Promise<LichessUser> {
    const clean = username.trim();
    if (!clean) throw new Error("Bitte einen Username eingeben.");

    const url = `https://lichess.org/api/user/${encodeURIComponent(clean)}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (res.status === 404) throw new Error("User nicht gefunden.");
    if (res.status === 429) throw new Error("Zu viele Requests (429). Bitte kurz warten und erneut versuchen.");
    if (!res.ok) throw new Error(`API Fehler (${res.status}).`);

    return (await res.json()) as LichessUser;
}

export default function SearchPage() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<LichessUser | null>(null);

    const onSearch = async () => {
        setError(null);
        setUser(null);
        setLoading(true);

        try {
            const u = await fetchLichessUser(username);
            setUser(u);
            router.push({ pathname: "/results", params: { username: u.id } });
        } catch (e: any) {
            setError(e?.message ?? "Unbekannter Fehler.");
        } finally {
            setLoading(false);
        }
    };

    const disabled = loading || username.trim().length === 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scope64</Text>
            <Text style={styles.subtitle}>Search Lichess Player</Text>

            <TextInput
                style={styles.input}
                placeholder="e.g. DrNykterstein"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                onSubmitEditing={onSearch}
                returnKeyType="search"
            />

            <Pressable
                style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && !disabled && styles.buttonPressed]}
                onPress={onSearch}
                disabled={disabled}
            >
                {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Search</Text>}
            </Pressable>

            {!!error && <Text style={styles.error}>{error}</Text>}

            {!!user && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        {user.title ? `${user.title} ` : ""}
                        {user.username}
                    </Text>
                    {!!user.profile?.country && <Text style={styles.cardText}>Country: {user.profile.country}</Text>}
                    {!!user.count?.all && <Text style={styles.cardText}>Games: {user.count.all}</Text>}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 8 },
    subtitle: { fontSize: 16, textAlign: "center", color: "#666", marginBottom: 24 },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 12,
    },

    button: { backgroundColor: "#111", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
    buttonPressed: { opacity: 0.85 },
    buttonDisabled: { opacity: 0.4 },
    buttonText: { color: "white", fontSize: 16, fontWeight: "600" },

    error: { marginTop: 12, color: "#b00020", textAlign: "center" },

    card: { marginTop: 16, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 12, padding: 14 },
    cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
    cardText: { fontSize: 14, color: "#444" },
});
