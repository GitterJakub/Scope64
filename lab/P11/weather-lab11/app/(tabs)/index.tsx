import React, { useEffect, useReducer } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";

type Daily = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
};

type WeatherData = {
    current_weather?: { temperature: number; windspeed: number; time: string };
    daily?: Daily;
};

type State = {
    status: "idle" | "loading" | "success" | "error";
    location: { name: string; lat: number; lon: number };
    data: WeatherData | null;
    error: string | null;
};

type Action =
    | { type: "LOAD_START" }
    | { type: "LOAD_SUCCESS"; payload: WeatherData }
    | { type: "LOAD_ERROR"; payload: string }
    | { type: "SET_LOCATION"; payload: State["location"] };

const initialState: State = {
    status: "idle",
    location: { name: "Zürich", lat: 47.37, lon: 8.55 },
    data: null,
    error: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, status: "loading", error: null };
        case "LOAD_SUCCESS":
            return { ...state, status: "success", data: action.payload };
        case "LOAD_ERROR":
            return { ...state, status: "error", error: action.payload };
        case "SET_LOCATION":
            return { ...state, location: action.payload };
        default:
            return state;
    }
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
        `&longitude=${lon}` +
        `&daily=temperature_2m_max,temperature_2m_min` +
        `&current_weather=true` +
        `&timezone=Europe%2FZurich`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

export default function WeatherScreen() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const load = async () => {
        dispatch({ type: "LOAD_START" });
        try {
            const data = await fetchWeather(state.location.lat, state.location.lon);
            dispatch({ type: "LOAD_SUCCESS", payload: data });
        } catch (e: any) {
            dispatch({ type: "LOAD_ERROR", payload: e?.message ?? "Unknown error" });
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dailyRows =
        state.data?.daily?.time?.map((date, i) => ({
            id: date,
            date,
            min: state.data!.daily!.temperature_2m_min[i],
            max: state.data!.daily!.temperature_2m_max[i],
        })) ?? [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weather – {state.location.name}</Text>

            <Button title="Reload" onPress={load} />

            {state.status === "loading" && (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text>Loading...</Text>
                </View>
            )}

            {state.status === "error" && (
                <Text style={styles.error}>Error: {state.error}</Text>
            )}

            {state.status === "success" && state.data?.current_weather && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Current</Text>
                    <Text>Temp: {state.data.current_weather.temperature}°C</Text>
                    <Text>Wind: {state.data.current_weather.windspeed} km/h</Text>
                    <Text>Time: {state.data.current_weather.time}</Text>
                </View>
            )}

            <Text style={styles.subtitle}>Next days</Text>
            <FlatList
                data={dailyRows}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.rowDate}>{item.date}</Text>
                        <Text>{item.min}° / {item.max}°</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
    title: { fontSize: 22, fontWeight: "600" },
    subtitle: { fontSize: 18, fontWeight: "600", marginTop: 8 },
    center: { paddingVertical: 12, alignItems: "center", gap: 8 },
    error: { color: "crimson" },
    card: { padding: 12, borderWidth: 1, borderRadius: 10 },
    cardTitle: { fontWeight: "700", marginBottom: 6 },
    row: { paddingVertical: 10, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between" },
    rowDate: { fontWeight: "600" },
});
