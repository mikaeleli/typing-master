import { nanoid } from "nanoid";
import { SPACE_CHARACTER } from "../constants";

export type TypingNode = {
    id: string;
    value: string;
    type: "character" | "space";
    status: "not-typed" | "correct" | "incorrect";
};

export type TypingEntry = {
    character: string;
    characterId: string;
    status: "correct" | "incorrect" | "corrected";
    context: {
        index: number;
    };
};

type BaseTypingState = {
    current: number;
    nodes: TypingNode[];
    keystrokes: TypingEntry[];
};

type NotStartedTypingState = BaseTypingState & {
    status: "not-started";
    startTime: undefined;
    endTime: undefined;
};

type InProgressTypingState = BaseTypingState & {
    status: "in-progress";
    startTime: number;
    endTime: undefined;
};

export type FinishedTypingState = BaseTypingState & {
    status: "finished";
    startTime: number;
    endTime: number;
};

export type TypingState =
    | NotStartedTypingState
    | InProgressTypingState
    | FinishedTypingState;

function createTypingNode(value: string): TypingNode {
    return {
        id: nanoid(),
        value,
        type: value === SPACE_CHARACTER ? "space" : "character",
        status: "not-typed",
    };
}

function createWordNodes(word: string): TypingNode[] {
    return word.split("").map(createTypingNode);
}

export const createTypingState = (words: string[]): NotStartedTypingState => {
    const nodes = words.flatMap((word, index) => {
        const wordNodes = createWordNodes(word);
        const spaceNode = createTypingNode(SPACE_CHARACTER);

        const isLastWord = index === words.length - 1;

        return isLastWord ? wordNodes : [...wordNodes, spaceNode];
    });

    return {
        current: 0,
        nodes,
        status: "not-started",
        startTime: undefined,
        endTime: undefined,
        keystrokes: [],
    };
};

const startTyping = (state: NotStartedTypingState): InProgressTypingState => {
    return {
        ...state,
        status: "in-progress",
        startTime: Date.now(),
    };
};

const finishTyping = (state: InProgressTypingState): FinishedTypingState => {
    return {
        ...state,
        status: "finished",
        endTime: Date.now(),
    };
};

function ensureCorrectStatus(
    nextState: TypingState,
): TypingState | FinishedTypingState {
    if (nextState.status === "finished") return nextState;

    if (nextState.status === "not-started") {
        return startTyping(nextState);
    }

    const isLastCharacter = nextState.current === nextState.nodes.length;

    if (isLastCharacter) {
        return finishTyping(nextState);
    }

    return nextState;
}

export function typeCharacter(
    state: TypingState,
    character: string,
): TypingState {
    if (state.status === "finished") return state;

    const characterNode = state.nodes[state.current];

    const isCorrect = character === characterNode.value;
    const isCorrected =
        isCorrect &&
        !!state.keystrokes.find(
            (keystroke) =>
                keystroke.characterId === characterNode.id &&
                keystroke.status === "incorrect",
        );

    const idToCorrect = isCorrected ? characterNode.id : null;

    const nextKeystrokes = isCorrected
        ? state.keystrokes.map((keystroke) => {
              if (keystroke.characterId !== idToCorrect) return keystroke;

              return {
                  ...keystroke,
                  status: "corrected",
              } satisfies TypingEntry;
          })
        : state.keystrokes;

    return ensureCorrectStatus({
        ...state,
        keystrokes: [
            ...nextKeystrokes,
            {
                character,
                characterId: characterNode.id,
                status: isCorrect ? "correct" : "incorrect",
                context: {
                    index: state.current,
                },
            },
        ],
        current: state.current + 1,
        nodes: state.nodes.map((node, index) => {
            if (index !== state.current) return node;

            return {
                ...node,
                status: isCorrect ? "correct" : "incorrect",
            };
        }),
    });
}

export function deleteCharacter(state: TypingState): TypingState {
    if (state.status === "finished") return state;

    if (state.status === "not-started") return state;

    const { current } = state;

    if (current === 0) return state;

    return {
        ...state,
        current: current - 1,
        nodes: state.nodes.map((node, index) => {
            if (index !== current - 1) return node;

            return {
                ...node,
                status: "not-typed",
            };
        }),
    };
}
