# P02 MOBA App Design

-------

## Problem Statement for Scope64
Many chess players and enthusiasts want to view or replay their own or other people's games on the go.
Existing chess platforms such as Lichess and Chess.com are comprehensive, but they are not optimised for quickly searching for and replaying individual games by a specific player.

It is particularly difficult for learners and coaches to quickly find past games and go through them visually step by step.

-------

## Customer Hypothesis
Chess players, students, and trainers want a faster and simpler way to search and replay specific games from Lichess players on mobile and web.
If there is an app with a clean interface focused only on search and replay, users will save time and analyze games more effectively, especially on mobile devices.

-------

## Persona
- **Name:** Lukas Weber
- **Age:** 24
- **Occupation:** Computer science student / amateur chess player
- **Goals:** Wants to replay games played by strong players in order to improve his own openings. Wants to watch his own games or those of his friends on his mobile phone.

- **Frustrations:** Lichess offers too many options -> difficult to find specific games quickly when on the go. Chess websites are often confusing on mobile devices.

- **Needs:** An app where he can simply enter players -> list of recent games -> click -> replay directly. No distractions, no unnecessary overhead - pure functionality.

-------
## User Story and Steps
As a chess enthusiast,
I want to search for a Lichess player and view their latest games,
so that I can replay their moves and learn from their playing style.
### Steps:
1. User opens the app.

2. Enters a player name (e.g. “MagnusCarlsen”).

3. App retrieves the latest games via Lichess API.

4. User selects one game from the list.

5. App displays the board and allows move-by-move replay.