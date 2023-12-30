import { generate } from "random-words";
import { useEffect, useRef, useState } from "react";

import { WordBuffer } from "../components/WordBuffer";
import { Results } from "../components/Results";
import {
    TypingState,
    createTypingState,
    handleKeystroke,
} from "../models/Typing";
import { Report, createReport } from "../models/report";

export const TypingTrainer = () => {
    const [typingState, setTypingState] = useState<TypingState>(
        createTypingState(generate(20)),
    );

    const [report, setReport] = useState<Report>();

    const statusRef = useRef(typingState.status);
    statusRef.current = typingState.status;

    console.log(typingState);

    useEffect(() => {
        function handleInputKeyPress(event: KeyboardEvent) {
            if (statusRef.current === "finished") return;

            if (!isAllowedEvent(event)) return;

            setTypingState((prevState) => {
                if (prevState.status === "finished") return prevState;

                const newState = handleKeystroke(prevState, event.key);

                if (newState.status === "finished") {
                    setReport(createReport({ state: newState }));
                }

                return newState;
            });
        }

        window.addEventListener("keydown", handleInputKeyPress);

        return () => {
            window.removeEventListener("keydown", handleInputKeyPress);
        };
    }, []);

    return (
        <div>
            <WordBuffer state={typingState} />

            <Results report={report} />
        </div>
    );
};

function isAllowedEvent(event: KeyboardEvent) {
    return (
        event.key === "Backspace" ||
        event.key === " " ||
        /^[a-z]$/i.test(event.key)
    );
}
