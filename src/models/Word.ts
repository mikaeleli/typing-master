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

export type WordResult = {
    word: string;
    correct: boolean;
    errors: number;
};

export type TypingResults = {
    words: WordResult[];
    startTime: number;
    endTime: number;
    errors: number;
};

// export function calculateWordsPerMinute(results: TypingResults): number {
//     const { words, startTime, endTime } = results;

//     const totalWords = words.length;
//     const minutes = (endTime - startTime) / 1000 / 60;
//     return totalWords / minutes;
// }
