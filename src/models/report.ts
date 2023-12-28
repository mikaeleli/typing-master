import { SPACE_CHARACTER, WORD_LENGTH } from "../constants";
import { FinishedTypingState, TypingEntry } from "./Typing";

type ReportInput = {
    state: FinishedTypingState;
};

export type Report = {
    wpm: number;
    accuracy: number;
    duration: number;
};

function getMinutesFromMilliseconds(milliseconds: number): number {
    return milliseconds / 1000 / 60;
}

function calculateGrossWordsPerMinute(
    keystrokes: TypingEntry[],
    duration: number,
): number {
    const words = keystrokes.length / WORD_LENGTH;

    const minutes = getMinutesFromMilliseconds(duration);

    return words / minutes;
}

function calculateNetWordsPerMinute(
    grossWpm: number,
    uncorrectedErrors: number,
    duration: number,
): number {
    const minutes = getMinutesFromMilliseconds(duration);

    return grossWpm - uncorrectedErrors / minutes;
}

function calculateAccuracy(keystrokes: TypingEntry[]): number {
    const characterKeystrokes = keystrokes.filter(
        (keystroke) => keystroke.character !== SPACE_CHARACTER,
    );

    const totalKeystrokes = characterKeystrokes.length;

    const correctKeystrokes = characterKeystrokes.filter(
        (keystroke) => keystroke.status === "correct",
    ).length;

    console.log("calculateAccuracy", {
        correctCharacters: correctKeystrokes,
        totalKeyStrokes: totalKeystrokes,
    });

    return (correctKeystrokes / totalKeystrokes) * 100;
}

export function createReport({ state }: ReportInput): Report {
    const duration = state.endTime - state.startTime;
    const wpm = calculateNetWordsPerMinute(
        calculateGrossWordsPerMinute(state.keystrokes, duration),
        state.keystrokes.filter((keystroke) => keystroke.status === "incorrect")
            .length,
        duration,
    );
    const accuracy = calculateAccuracy(state.keystrokes);

    return {
        wpm,
        accuracy,
        duration,
    };
}
