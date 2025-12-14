# React Native VS Android Compose

## State
- React Native: ``useReducer``, `dispatch` (Reducer musst pure sein)
- Android Compose: State über ``remember { mutableStateOf(...) }`` oder ``by mutableStateOf(...)`` (State kann mutierbar sein)
bei Änderungen wird die Composable Funktion neu ausgeführt

## UI Definition
- React Native: JSX (ähnlich wie HTML) + Core Components (View, Text, ScrollView, etc.)
- Android Compose: deklarativ über @Composable Funktionen (ähnlich wie React Komponenten) + Modifier-Kette

## Networking
- React Native: `fetch` API
- Android Compose: Servercall via Volley im ViewModel