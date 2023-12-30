import { nanoid } from "nanoid";
import { SPACE_CHARACTER } from "../constants";

// TODO: Add skipping functionality - if the user presses the space bar, skip the current word and mark the characters as incorrect

export type TypingNode = {
    id: string;
    value: string;
    type: "character" | "space";
    status: "not-typed" | "correct" | "incorrect" | "skipped";
};

export type TypingEntry = {
    character: string;
    characterId: string;
    status: "correct" | "incorrect" | "corrected" | "skipped";
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

function typeCharacter(
    state: NotStartedTypingState | InProgressTypingState,
    character: string,
): InProgressTypingState {
    const characterNode = state.nodes[state.current];

    // const isSkipping =
    //     character === SPACE_CHARACTER && characterNode.type !== "space";
    //
    // if (isSkipping) {
    //     return skipWord(state);
    // }

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

    return {
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
    };
}

function deleteCharacter(state: InProgressTypingState): InProgressTypingState {
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

function skipWord(state: InProgressTypingState): InProgressTypingState {
    // if next node is a space, skip it
    // if next node is a character, skip until the next character
    const nextCurrent = state.nodes.findIndex(
        (node, index) => index >= state.current && node.type === "space",
    );

    if (nextCurrent === -1) return state;

    return {
        ...state,
        current: nextCurrent + 1,
        nodes: state.nodes.map((node, index) => {
            if (index < state.current || index > nextCurrent) return node;

            return {
                ...node,
                status: "skipped",
            };
        }),
    };
}

enum Keys {
    Backspace = "Backspace",
    Space = " ",
}

type Action = "type" | "delete" | "skip" | "noop";

function getNextAction(state: TypingState, character: string): Action {
    if (state.status === "finished") return "noop";

    if (character === Keys.Backspace) {
        const canDelete = state.current > 0;

        if (!canDelete) return "noop";

        return "delete";
    }

    if (character === Keys.Space) {
        console.log("got space");
        // user can't skip the first letter
        if (state.current === 0) return "noop";

        const hasNextWord = state.nodes.some(
            (node, index) => index >= state.current && node.type === "space",
        );

        if (!hasNextWord) return "noop";

        return "skip";
    }

    return "type";
}

function matchAction(
    state: InProgressTypingState,
    action: Action,
    character: string,
): InProgressTypingState {
    switch (action) {
        case "noop":
            return state;
        case "type":
            return typeCharacter(state, character);
        case "skip":
            return skipWord(state);
        case "delete":
            return deleteCharacter(state);
        default:
            assertNever(action);
    }
}

export function handleKeystroke(
    state: NotStartedTypingState | InProgressTypingState,
    character: string,
): TypingState {
    const action = getNextAction(state, character);

    if (action === "noop") return state;

    if (state.status === "not-started") state = startTyping(state);

    const nextState = matchAction(state, action, character);

    const isFinished = nextState.current === nextState.nodes.length;

    if (isFinished) return finishTyping(nextState);

    return nextState;
}

function assertNever(x: never): never {
    throw new Error(`Unexpected object: ${x}`);
}
