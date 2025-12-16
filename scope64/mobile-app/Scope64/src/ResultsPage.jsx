import React, { useEffect, useState } from "react";
import "./ResultsPage.css";

export default function ResultsPage({ username, userJson, onBack, onOpenDetail }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [games, setGames] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const list = await fetchLastGames(username, 10);
                if (!cancelled) setGames(list);
            } catch (e) {
                if (!cancelled) setError(e?.message ?? "Fehler beim Laden der Spiele.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [username]);

    return (
        <div className="page">
            <header className="header">
                <div className="header-inner header-row">
                    <strong>Resultate</strong>
                    <span className="spacer" />
                    <button className="btn btn-small" onClick={onBack}>Neue Suche</button>
                </div>

                <div className="header-inner muted">
                    {userJson?.username ? `User: ${userJson.username}` : `User: ${username}`}
                </div>
            </header>

            <main className="main">
                {loading && <div className="card">Lade letzte 10 Spiele…</div>}
                {error && <div className="card error">⚠️ {error}</div>}

                {!loading && !error && (
                    <div className="list">
                        {games.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => onOpenDetail?.(g)}
                                className="result-item"
                            >
                                <div className="result-title">
                                    {getPgnTag(g.pgn, "White") || "White"} vs {getPgnTag(g.pgn, "Black") || "Black"}
                                </div>

                                <div className="result-meta">
                                    <span className="pill">{resultLabel(g)}</span>
                                    {getModeLabel(g) && <span className="pill">{getModeLabel(g)}</span>}
                                    <span className="spacer" />
                                    <span className="muted">{formatDate(g.createdAt)}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}



async function fetchLastGames(username, max = 10) {
    const url =
        `https://lichess.org/api/games/user/${encodeURIComponent(username)}` +
        `?max=${max}&pgnInJson=true&clocks=true&evals=false&opening=true`;

    const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/x-ndjson" },
    });

    if (res.status === 404) throw new Error("User nicht gefunden (404).");
    if (!res.ok) throw new Error(`Lichess API Fehler (${res.status}).`);

    const text = await res.text();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    const games = [];
    for (const line of lines) {
        try { games.push(JSON.parse(line)); } catch {
            // Ignoriere fehlerhafte Zeilen
        }
    }
    return games;
}

function resultLabel(g) {
    if (g.winner === "white") return "1-0";
    if (g.winner === "black") return "0-1";
    return "½-½";
}

// (Datumformat DD.MM.YYYY)
function formatDate(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

function getPgnTag(pgn, tagName) {
    if (!pgn) return "";
    const re = new RegExp(`\\[${tagName}\\s+"([^"]*)"\\]`, "i");
    const m = pgn.match(re);
    return m?.[1]?.trim() ?? "";
}

function getModeLabel(g) {
    // perf ist meist spezifischer; wenn perf==speed, nur einmal anzeigen
    const perf = (g.perf ?? "").trim();
    const speed = (g.speed ?? "").trim();

    if (perf && speed && perf.toLowerCase() === speed.toLowerCase()) return perf;
    return perf || speed || "";
}
