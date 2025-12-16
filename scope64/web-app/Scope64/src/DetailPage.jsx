import React, {useMemo, useState} from "react";
import "./DetailPage.css";
import {Chess} from "chess.js";

export default function DetailPage({game, username, onBack}) {
    const [ply, setPly] = useState(0);

    const {moves, fens} = useMemo(() => {
        if (!game?.pgn) return {moves: [], fens: [START_FEN]};

        const chess = new Chess();
        chess.loadPgn(game.pgn);

        const hist = chess.history(); // SAN
        const fensArr = [START_FEN];

        const replay = new Chess();
        for (const m of hist) {
            replay.move(m);
            fensArr.push(replay.fen());
        }

        return {moves: hist, fens: fensArr};
    }, [game]);

    const maxPly = Math.max(0, fens.length - 1);
    const fen = fens[Math.min(ply, maxPly)] ?? START_FEN;

    const pgn = game?.pgn ?? "";

    const whitePgnName = getPgnTag(pgn, "White");
    const blackPgnName = getPgnTag(pgn, "Black");

    const me = normalizeName(username); // username kommt aus App.jsx rein
    const whiteN = normalizeName(whitePgnName);
    const blackN = normalizeName(blackPgnName);

    const myColor =
        me && me === whiteN ? "white" :
            me && me === blackN ? "black" :
                null;

    const orientation = myColor === "black" ? "black" : "white";



    function clamp(next) {
        return Math.max(0, Math.min(maxPly, next));
    }

    function playingPlayer(playingColor) {
        if (playingColor === "white") {
            return whitePgnName || "White";
        } else if (playingColor === "black") {
            return blackPgnName || "Black";
        } else {
            return "Unknown";
        }
    }

    if (!game) {
        return (
            <div className="page">
                <header className="header">
                    <div className="header-inner header-row">
                        <strong>Detail</strong>
                        <span className="spacer"/>
                        <button className="btn btn-small" onClick={onBack}>Zurück</button>
                    </div>
                </header>
                <main className="main">
                    <div className="card">Kein Spiel ausgewählt.</div>
                </main>
            </div>
        );
    }

    return (
        <div className="page">
            <header className="header">
                <div className="header-inner header-row">
                    <strong>Spiel-Detail</strong>
                    <span className="spacer"/>
                    <button className="btn btn-small" onClick={onBack}>Zurück</button>
                </div>

                <div className="header-inner muted">
                    {whitePgnName || "White"} vs {blackPgnName || "Black"} · {resultLabel(game)}
                    {myColor && <> · {playingPlayer(myColor)} ist: <strong>{myColor}</strong></>}
                </div>

            </header>

            <main className="main">
                <section className="card board-card">
                    <Board fen={fen} orientation={orientation} />

                    <div className="controls">
                        <button className="btn btn-icon" onClick={() => setPly(0)} disabled={ply === 0}>⏮</button>
                        <button className="btn btn-icon" onClick={() => setPly((p) => clamp(p - 1))}
                                disabled={ply === 0}>◀
                        </button>

                        <div className="move-indicator">
                            <div className="move-title">Zug {ply} / {maxPly}</div>
                            <div className="move-sub muted">{ply > 0 ? moves[ply - 1] : "Startposition"}</div>
                        </div>

                        <button className="btn btn-icon" onClick={() => setPly((p) => clamp(p + 1))}
                                disabled={ply === maxPly}>▶
                        </button>
                        <button className="btn btn-icon" onClick={() => setPly(maxPly)} disabled={ply === maxPly}>⏭
                        </button>
                    </div>
                </section>

                <section className="card">
                    <div className="card-title-row">
                        <strong>PGN</strong>
                        <span className="spacer"/>
                        <button
                            className="btn btn-small"
                            onClick={() => navigator.clipboard?.writeText(game.pgn)}
                            type="button"
                        >
                            Kopieren
                        </button>
                    </div>

                    <pre className="pgn">{game.pgn}</pre>
                </section>
            </main>
        </div>
    );
}

function Board({ fen, orientation = "white" }) {
    const squares = fenToSquares(fen); // 8x8

    // Wenn schwarz: Reihenfolge umdrehen (robust + keine CSS-Tricks nötig)
    const rows = orientation === "black" ? [...squares].reverse() : squares;

    return (
        <div className="board">
            {rows.flatMap((row, r) => {
                const cols = orientation === "black" ? [...row].reverse() : row;

                return cols.map((p, c) => {
                    const isDark = (r + c) % 2 === 1;
                    return (
                        <div
                            key={`${r}-${c}`}
                            className={`square ${isDark ? "dark" : "light"}`}
                        >
                            <span className="piece">{pieceToUnicode(p)}</span>
                        </div>
                    );
                });
            })}
        </div>
    );
}


const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function fenToSquares(fen) {
    const [placement] = fen.split(" ");
    const rows = placement.split("/");
    return rows.map((row) => {
        const out = [];
        for (const ch of row) {
            if (/\d/.test(ch)) out.push(...Array(Number(ch)).fill(null));
            else out.push(ch);
        }
        return out;
    });
}

function pieceToUnicode(p) {
    if (!p) return "";
    const map = {
        K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
        k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
    };
    return map[p] ?? "";
}

function resultLabel(g) {
    if (g.winner === "white") return "1-0";
    if (g.winner === "black") return "0-1";
    return "½-½";
}

function getPgnTag(pgn, tagName) {
    if (!pgn) return "";
    // Match z.B. [White "DrNykterstein"]
    const re = new RegExp(`\\[${tagName}\\s+"([^"]*)"\\]`, "i");
    const m = pgn.match(re);
    return m?.[1]?.trim() ?? "";
}

function normalizeName(s) {
    return (s ?? "").trim().toLowerCase();
}
