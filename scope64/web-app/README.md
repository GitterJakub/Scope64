## scope64 – Chess Web App (Lichess)

Diese Web-Applikation ist eine mobile-optimierte React-Anwendung zur Anzeige
von Schachpartien über die **Lichess API**.  
Sie ist als Web-Variante der zuvor entwickelten Kotlin-App umgesetzt.

---

## ✨ Features

- 🔍 **SearchPage**
    - Suche nach einem Lichess-Benutzernamen
    - Validierung des Users über die Lichess API

- 📄 **ResultsPage**
    - Anzeige der letzten 10 Partien des Spielers
    - Spieler-Namen werden direkt aus dem PGN extrahiert
    - Anzeige von Ergebnis, Spielmodus (z. B. Bullet, Blitz) und Datum
    - Mobile-optimierte, scrollbare Liste

- ♟️ **DetailPage**
    - Anzeige einer einzelnen Partie
    - Schachbrett mit Vor- / Zurück-Navigation der Züge
    - Brett dreht automatisch, wenn der gesuchte Spieler Schwarz ist
    - Anzeige der vollständigen PGN-Daten
    - Spieler-Namen werden aus dem PGN gelesen

- 🎨 **Styling**
    - Separate CSS-Dateien pro Page (`SearchPage.css`, `ResultsPage.css`, `DetailPage.css`)
    - Mobile-First Layout
    - Einheitliches Card- und Header-Design
    - `box-sizing: border-box` zur Vermeidung von Layout-Problemen

- 🖼️ **App Icon / Favicon**
    - Eigenes App-Icon „scope64“
    - Favicon wird im Browser-Tab angezeigt
    - Logo wird zusätzlich in der UI (SearchPage) verwendet

---

## 🧩 Technischer Aufbau

- **Framework:** React (Vite)
- **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)
- **API:** Lichess REST API
    - `/api/user/{username}`
    - `/api/games/user/{username}` (NDJSON)
- **Schachlogik:** `chess.js`
- **Styling:** Klassisches CSS mit `className`
- **Assets:** PNG/SVG Icons im `/public`-Ordner

---

## 📁 Projektstruktur (vereinfacht)

```text
src/
├─ App.jsx
├─ main.jsx
├─ SearchPage.jsx
├─ SearchPage.css
├─ ResultsPage.jsx
├─ ResultsPage.css
├─ DetailPage.jsx
├─ DetailPage.css
└─ index.css

public/
├─ favicon.png
└─ logo.png
