// TrafficLight.jsx
import { useState, useEffect } from "react";
import Light from "./Light";

// Vier typische Ampel-Phasen
const STEPS = [
    { red: true,  yellow: false, green: false }, // Rot
    { red: true,  yellow: true,  green: false }, // Rot-Gelb
    { red: false, yellow: false, green: true  }, // Grün
    { red: false, yellow: true,  green: false }, // Gelb
];

const TrafficLight = ({ auto, offset = 0 }) => {
    const [step, setStep] = useState(offset % STEPS.length);

    const nextStep = () => {
        setStep((prev) => (prev + 1) % STEPS.length);
    };

    // automatischer Wechsel per Timer (falls auto = true)
    useEffect(() => {
        if (!auto) return;
        const id = setInterval(nextStep, 1000); // alle 1 Sekunde
        return () => clearInterval(id);
    }, [auto]);

    const current = STEPS[step];

    return (
        <div
            className="traffic-light"
            // Wenn nicht automatisch: per Klick umschalten
            onClick={!auto ? nextStep : undefined}
            title={auto ? "Auto-Ampel" : "Klick mich zum Umschalten"}
        >
            <Light color="red"    active={current.red} />
            <Light color="yellow" active={current.yellow} />
            <Light color="green"  active={current.green} />
        </div>
    );
};

export default TrafficLight;
