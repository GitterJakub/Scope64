# Scope64 – Lichess Game Explorer (Android)

Scope64 ist eine **native Android-App**, mit der Schachpartien von **Lichess.org** gesucht, gefiltert und im Detail analysiert werden können.  
Die App wurde mit **Kotlin** und **Jetpack Compose** entwickelt und richtet sich an mobile Endgeräte (Android).

---

## 🎯 Ziel der App

- Suche nach **Lichess-Spielern** (z. B. *DrNykterstein*)
- Anzeige der **neusten Partien**
- Filter nach **Datum** und **Ratingbereich**
- Detailansicht einer Partie mit:
    - Schachbrett
    - Schrittweiser Zugnavigation (vor / zurück)
    - Darstellung der Partie anhand der echten Lichess-Züge

---

## 🧱 Architektur & Konzept

Die App folgt einem **klaren, einfachen Architekturansatz**, der für ein Studienprojekt gut nachvollziehbar ist:

- **UI**: Jetpack Compose (State-driven UI)
- **State Management**: ViewModel (`AndroidViewModel`)
- **Navigation**: Eigene einfache Screen-State-Navigation (sealed class)
- **Networking**: Volley
- **Schachlogik**: chesslib (SAN-Züge, Brettzustand)

### Screen-Struktur

- `HomeScreen`
    - Suchformular (Username, Datum, Rating-Range)
- `ResultsScreen`
    - Liste der gefundenen Partien
- `GameDetailScreen`
    - Schachbrett
    - Zugliste & Navigation

---

## 🛠 Tech Stack

### Sprache & Frameworks
- **Kotlin**
- **Jetpack Compose**
- **Material 3**

### Libraries
- **Volley** – HTTP & API Requests
- **chesslib** – Schachlogik (SAN-Parsing, Brettzustände)
- **AndroidX Lifecycle ViewModel**
- **Compose BOM**

Alle Dependencies werden über den **Version Catalog (`libs.versions.toml`)** verwaltet.

---

## 🌐 Lichess API

Die App verwendet die offizielle **Lichess API**:

---

## ♟ Schachbrett & Züge

- Die Züge werden von Lichess im **SAN-Format** geliefert
    - z. B. `e4`, `Nf3`, `O-O`
- Die Library **chesslib** wird verwendet, um:
    - die Züge korrekt anzuwenden
    - den Brettzustand nach *n* Zügen zu berechnen
- Das UI-Brett wird aus dem chesslib-Board abgeleitet
---

## 📚 Lernziele (MOBA Praktikum)

- Native Mobile App mit Kotlin & Compose
- API-Anbindung & JSON/NDJSON Parsing
- State-getriebene UI
- Modularer Aufbau von Screens & Komponenten
- Vergleich zu Web / React / React Native