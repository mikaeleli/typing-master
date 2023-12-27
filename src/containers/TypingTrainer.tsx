import { generate } from "random-words";
import { useEffect, useState } from "react";

import {
    CharacterEntry,
    TypingReport,
    createTypingReport,
    createWordState,
    getCurrentCharacterState,
    getWordString,
} from "../models/Word";
import { WordBuffer } from "../components/WordBuffer";
import { Results } from "../components/Results";

const GO_TO_NEXT_WORD_CHAR = " ";

const startTime = Date.now();

export const TypingTrainer = () => {
    const [characterEntries, setCharacterEntries] = useState<CharacterEntry[]>(
        [],
    );
    const [words, setWords] = useState(() => generate(10).map(createWordState));
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [results, setResults] = useState<TypingReport>();

    const currentWordState = words[currentWordIndex];

    const isLastWord = currentWordIndex === words.length - 1;
    const currentCharacterState = getCurrentCharacterState(currentWordState);
    const isFinished = isLastWord && currentCharacterState === undefined;

    const handleInputKeyPress = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isFinished) {
            return;
        }

        const inputCharacter =
            event.target.value[event.target.value.length - 1];

        const shouldGoToNextWord =
            inputCharacter === GO_TO_NEXT_WORD_CHAR &&
            !currentWordState.characters.some(
                (characterState) => characterState.status === "pending",
            );

        if (shouldGoToNextWord) {
            setCurrentWordIndex((oldWordIndex) => oldWordIndex + 1);
            return;
        }

        if (!currentCharacterState) {
            return;
        }

        const charToMatch = currentCharacterState.character;

        setCharacterEntries((prevState) => {
            return [
                ...prevState,
                {
                    character: inputCharacter,
                    status:
                        inputCharacter === charToMatch
                            ? "correct"
                            : "incorrect",
                    context: {
                        word: getWordString(currentWordState),
                        characterIndex: currentWordState.characterIndex,
                    },
                },
            ];
        });

        const isCorrectCharacter = inputCharacter === charToMatch;

        setWords((prevState) =>
            prevState.map((oldWordState) => {
                const isCurrentWord = oldWordState.id === currentWordState.id;

                if (!isCurrentWord) {
                    return oldWordState;
                }

                return {
                    ...oldWordState,
                    characterIndex: oldWordState.characterIndex + 1,
                    characters: oldWordState.characters.map(
                        (characterState, characterIndex) => {
                            if (
                                characterIndex !== oldWordState.characterIndex
                            ) {
                                return characterState;
                            }

                            const newStatus = isCorrectCharacter
                                ? characterState.status === "pending"
                                    ? "correct"
                                    : characterState.status
                                : "incorrect";

                            return {
                                ...characterState,
                                status: newStatus,
                            };
                        },
                    ),
                };
            }),
        );
    };

    useEffect(() => {
        if (isFinished) {
            setResults(
                createTypingReport({
                    startTime,
                    endTime: Date.now(),
                    keystrokes: characterEntries,
                    words,
                }),
            );
        }
    }, [isFinished, characterEntries, words]);

    return (
        <div>
            <WordBuffer
                currentWordIndex={currentWordIndex}
                words={words}
                onChange={handleInputKeyPress}
            />

            <Results results={results} />
        </div>
    );
};
