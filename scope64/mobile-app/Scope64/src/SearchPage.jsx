import React, { useState } from "react";
import "./SearchPage.css";

export default function SearchPage({ onUserFound }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch(e) {
        e.preventDefault();

        const q = username.trim();
        if (!q) {
            setError("Bitte einen Lichess-Namen eingeben.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const user = await fetchLichessUser(q);
            onUserFound(q, user);
        } catch (err) {
            setError(err?.message ?? "Unbekannter Fehler.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <header className="header">
                <div className="header-inner">
                    <img
                        src="/logo.png"
                        alt="scope64 logo"
                        className="app-logo"
                    />
                    <strong>Scope64</strong>
                </div>
            </header>

            <main className="main">
                <section className="card">
                    <h2>Spieler suchen</h2>
                    <p className="muted">
                        Gib einen Lichess-Username ein.
                    </p>

                    <form onSubmit={handleSearch} className="form">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="z.B. DrNykterstein"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                        />

                        {error && <div className="error">⚠️ {error}</div>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Suche..." : "Suchen"}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}


/** Lichess: GET /api/user/{username} */
async function fetchLichessUser(username) {
    const url = `https://lichess.org/api/user/${encodeURIComponent(username)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            // KEIN Content-Type bei GET setzen -> vermeidet oft Preflight/CORS Ärger
        },
    });

    if (res.status === 404) {
        throw new Error("User nicht gefunden (404). Prüfe den Namen.");
    }
    if (!res.ok) {
        throw new Error(`Lichess API Fehler (${res.status}). Bitte später erneut versuchen.`);
    }

    return await res.json();
}