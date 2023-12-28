import { generate } from "random-words";
import { useEffect, useRef, useState } from "react";

import { WordBuffer } from "../components/WordBuffer";
import { Results } from "../components/Results";
import {
    TypingState,
    createTypingState,
    deleteCharacter,
    typeCharacter,
} from "../models/Typing";
import { SPACE_CHARACTER } from "../constants";
import { Report, createReport } from "../models/report";

export const TypingTrainer = () => {
    const [typingState, setTypingState] = useState<TypingState>(
        createTypingState(generate(3)),
    );

    const [report, setReport] = useState<Report>();

    const statusRef = useRef(typingState.status);
    statusRef.current = typingState.status;

    console.log(typingState);

    useEffect(() => {
        function handleInputKeyPress(event: KeyboardEvent) {
            if (statusRef.current === "finished") return;

            const isBackspace = event.key === "Backspace";

            if (isBackspace) {
                setTypingState((prevState) => deleteCharacter(prevState));
                return;
            }

            let character = event.key;

            if (!isAllowedCharacter(character)) return;

            if (character === " ") {
                character = SPACE_CHARACTER;
            }

            setTypingState((prevState) => typeCharacter(prevState, character));
        }

        window.addEventListener("keydown", handleInputKeyPress);

        return () => {
            window.removeEventListener("keydown", handleInputKeyPress);
        };
    }, [setTypingState]);

    useEffect(() => {
        if (typingState.status === "finished") {
            setReport(createReport({ state: typingState }));
        }
    }, [typingState.status]);

    return (
        <div>
            <WordBuffer state={typingState} />

            <Results report={report} />
        </div>
    );
};

function isAllowedCharacter(character: string) {
    return /^[a-z ]$/i.test(character);
}
