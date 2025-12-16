# Scope64 – React Native (Expo) Mobile App

Diese Version ist der **React-Native-Prototyp** des Scope64 Projekts (Mobile App). Ziel: **Lichess-Spieler suchen**, die **letzten Partien** anzeigen und eine Partie im Detail mit **interaktivem Brett** (Züge vor/zurück) analysieren.

> Abgabe/Sharing: Der Prototyp ist so gehalten, dass er sich gut nach **Expo Snack** copy&paste lässt.

---

## Funktionsumfang

### 1) SearchPage
- Eingabe eines Lichess-Usernamens
- Prüfung/Lookup über die Lichess User API
- UI-States: **Loading**, **Error**, (optional) Profil-Preview
- Weiterleitung (Routing) zur ResultPage nach erfolgreicher Suche

### 2) ResultPage (letzte Partien)
- Lädt die **letzten 10 Games** des Users über die Lichess Games API (NDJSON)
- Darstellung als scrollbare Liste (**FlatList**)
- Pro Game: Gegner, Datum, Speed/Perf (Pill), Result (W/L/D), optional Ratings
- Tap auf ein Game öffnet die DetailPage (Routing)

### 3) DetailPage (Game Analyse)
- Lädt Game-Details per Lichess Game Export Endpoint
- Anzeige von Meta-Infos (Players, Speed, Result, Ratings)
- **Interaktives Brett**:
  - Vor/Zurück durch die Züge
  - Springen zum Anfang/Ende
  - **Board wird gedreht**, wenn der gesuchte User im Game **schwarz** ist

---

## Tech Stack

- **React Native** (Expo)
- **Expo Router** (Navigation / Routing)
- **TypeScript**
- **Fetch API** für HTTP Requests
- **chess.js** für Spiellogik (Moves → FEN → Brettzustand)
- **FlatList** für performante Listen

---

## API / Datenquellen (Lichess)

> Hinweis: Lichess hat Rate Limits. Bei **HTTP 429** muss man entsprechend warten (Backoff), und man sollte Requests nicht „spammen“.

Verwendete Endpoints:
- **User Lookup**: `GET https://lichess.org/api/user/{username}`
- **Games Liste (NDJSON)**: `GET https://lichess.org/api/games/user/{username}?max=10&moves=false&pgnInJson=true...`
- **Game Export (Detail)**: `GET https://lichess.org/game/export/{gameId}?pgnInJson=true` (mit `Accept: application/json`)

---

## Projektstruktur (Beispiel)

```
app/
  (tabs)/
    index.tsx         # SearchPage
  results.tsx         # ResultPage
  game/
    [id].tsx          # DetailPage (Board + Move Controls)

components/
  ChessBoard.tsx      # Board-Rendering (supports `flipped`)
```

---

## Setup & Run (lokal)

1) Dependencies installieren:

```bash
npm install
```

2) App starten:

```bash
npx expo start
```

3) Auf dem Smartphone:
- Expo Go installieren
- QR Code scannen