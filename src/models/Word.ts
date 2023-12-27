import { nanoid } from "nanoid";

export type CharacterState = {
    id: string;
    character: string;
    status: "correct" | "incorrect" | "pending";
};

export type WordState = {
    id: string;
    characters: CharacterState[];
    characterIndex: number;
};

export type TypingState = {
    words: WordState[];
    wordIndex: number;
    startTime: number;
    endTime?: number;
};

function createCharacterState(character: string): CharacterState {
    return {
        id: nanoid(),
        character,
        status: "pending",
    };
}

export function createWordState(word: string): WordState {
    return {
        id: nanoid(),
        characters: word.split("").map(createCharacterState),
        characterIndex: 0,
    };
}

export function isWordCorrect(word: WordState): boolean {
    return word.characters.every((character) => character.status === "correct");
}

export function getCurrentCharacterState(
    word: WordState
): CharacterState | undefined {
    return word.characters[word.characterIndex];
}

export function getWordString(word: WordState): string {
    return word.characters.map((character) => character.character).join("");
}

export type CharacterEntry = {
    character: string;
    status: "correct" | "incorrect";
    context: {
        word: string;
        characterIndex: number;
    };
};

export type TypingInput = {
    words: WordState[];
    startTime: number;
    endTime: number;
    keystrokes: Array<CharacterEntry>;
};

export type TypingReport = {
    wordsPerMinute: number;
    accuracy: {
        words: number;
        keystrokes: number;
    };
    errors: number;
    time: number;
};

function calculateWordsPerMinute(results: TypingInput): number {
    const { words, startTime, endTime } = results;

    const totalWords = words.length;
    const minutes = (endTime - startTime) / 1000 / 60;
    return totalWords / minutes;
}

function calculateWordsAccuracy(results: TypingInput): number {
    const { words } = results;

    const totalWords = words.length;
    const correctWords = words.filter(isWordCorrect).length;
    return (correctWords / totalWords) * 100;
}

function calculateKeystrokeAccuracy(results: TypingInput): number {
    const { keystrokes } = results;

    const totalKeystrokes = keystrokes.length;

    const correctKeystrokes = keystrokes.filter(
        (keystroke) => keystroke.status === "correct"
    ).length;

    return (correctKeystrokes / totalKeystrokes) * 100;
}

function calculateErrors(results: TypingInput): number {
    const { keystrokes } = results;

    return keystrokes.filter((keystroke) => keystroke.status === "incorrect")
        .length;
}

function calculateTime(results: TypingInput): number {
    const { startTime, endTime } = results;

    return endTime - startTime;
}

export function createTypingReport(input: TypingInput): TypingReport {
    return {
        wordsPerMinute: calculateWordsPerMinute(input),
        accuracy: {
            keystrokes: calculateKeystrokeAccuracy(input),
            words: calculateWordsAccuracy(input),
        },
        errors: calculateErrors(input),
        time: calculateTime(input),
    };
}
