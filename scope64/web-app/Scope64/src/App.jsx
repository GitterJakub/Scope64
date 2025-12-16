import React, { useState } from "react";
import SearchPage from "./SearchPage.jsx";
import ResultsPage from "./ResultsPage.jsx";
import DetailPage from "./DetailPage.jsx";

export default function App() {
    const [view, setView] = useState("search"); // search | results | detail
    const [username, setUsername] = useState("");
    const [userJson, setUserJson] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);

    function handleUserFound(name, user) {
        setUsername(name);
        setUserJson(user);
        setView("results");
    }

    if (view === "search") {
        return <SearchPage onUserFound={handleUserFound} />;
    }

    if (view === "results") {
        return (
            <ResultsPage
                username={username}
                userJson={userJson}
                onBack={() => setView("search")}
                onOpenDetail={(game) => { setSelectedGame(game); setView("detail"); }}
            />
        );
    }

    return (
        <DetailPage
            game={selectedGame}
            username={username}
            onBack={() => setView("results")}
        />
    );
}
