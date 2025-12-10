// App.jsx (oder App.js)
import TrafficLight from "./light/TrafficLight";
import Info from "./Info.jsx";
import "./App.css";

function App() {
    return (
        <div className="app">
            <Info />

            {/* Ampel 1: automatisch mit Timer */}
            <TrafficLight auto={true} />

            {/* Ampel 2: manuell, initial um zwei Schritte versetzt */}
            <TrafficLight auto={false} offset={2} />
        </div>
    );
}

export default App;
