import { generate } from "random-words";
import { useMemo, useState } from "react";
import { Word } from "../components/Word";

import styles from "./TypingTrainer.module.css";
import { CurrentWord } from "../components/CurrentWord";
import {
    WordState,
    createWordState,
    getCurrentCharacterState,
    getWordString,
} from "../models/Word";
import { WordBuffer } from "../components/WordBuffer";

const GO_TO_NEXT_WORD_CHAR = " ";

type CharacterEntry = {
    character: string;
    status: "correct" | "incorrect";
    context: {
        word: string;
        characterIndex: number;
    };
};

export const TypingTrainer = () => {
    const [characterEntries, setCharacterEntries] = useState<CharacterEntry[]>(
        []
    );

    const words = useMemo(() => {
        return generate(10);
    }, []);

    const mikki = useMemo(() => {
        return generate(10).map(createWordState);
    }, []);

    const [wordIndex, setWordIndex] = useState(0);

    const [wordState, setWordState] = useState<WordState>(
        createWordState(words[wordIndex])
    );

    // console.log({ ...wordState });
    console.log(characterEntries);

    const handleInputKeyPress = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const char = event.target.value[event.target.value.length - 1];

        const shouldGoToNextWord =
            char === GO_TO_NEXT_WORD_CHAR &&
            !wordState.characters.some(
                (characterState) => characterState.status === "pending"
            );

        if (shouldGoToNextWord) {
            const newWordIndex = (wordIndex + 1) % words.length;

            setWordIndex(newWordIndex);
            setWordState(createWordState(words[newWordIndex]));
            return;
        }

        const currentCharacterState = getCurrentCharacterState(wordState);

        if (!currentCharacterState) {
            return;
        }

        const charToMatch = currentCharacterState.character;

        setCharacterEntries((prevState) => {
            return [
                ...prevState,
                {
                    character: char,
                    status: char === charToMatch ? "correct" : "incorrect",
                    context: {
                        word: getWordString(wordState),
                        characterIndex: wordState.characterIndex,
                    },
                },
            ];
        });

        if (char !== charToMatch) {
            setWordState((prevState) => ({
                ...prevState,
                characters: prevState.characters.map(
                    (characterState, index) => {
                        if (index !== prevState.characterIndex) {
                            return characterState;
                        }

                        return {
                            ...characterState,
                            status: "incorrect",
                        };
                    }
                ),
            }));
            return;
        }

        setWordState((prevState) => {
            return {
                ...prevState,
                characterIndex: prevState.characterIndex + 1,
                characters: prevState.characters.map(
                    (characterState, index) => {
                        if (index !== prevState.characterIndex) {
                            return characterState;
                        }

                        const newStatus =
                            characterState.status === "pending"
                                ? "correct"
                                : characterState.status;

                        return {
                            ...characterState,
                            status: newStatus,
                        };
                    }
                ),
            };
        });
    };

    return (
        <div>
            <WordBuffer
                currentWordIndex={wordIndex}
                words={mikki}
                onChange={handleInputKeyPress}
            />

            <div className={styles.wordLine}>
                {words.map((word, index) => (
                    <Word
                        word={word}
                        isCurrentWord={index === wordIndex}
                        key={index}
                    />
                ))}
            </div>

            <CurrentWord wordState={wordState} />
        </div>
    );
};
