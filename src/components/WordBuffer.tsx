import { useRef } from "react";
import { WordState } from "../models/Word";
import clsx from "clsx";

import styles from "./WordBuffer.module.css";

type Props = {
    words: Array<WordState>;
    currentWordIndex: number;

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const WordBuffer = (props: Props) => {
    const { words, currentWordIndex, onChange } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div
                className={styles.wordBuffer}
                onClick={() => {
                    inputRef.current?.focus();
                }}
            >
                {words.map((wordState, wordIndex) => {
                    const isCurrentWord = currentWordIndex === wordIndex;

                    return (
                        <span
                            key={wordState.id}
                            className={clsx(styles.word, {
                                [styles.currentWord]: isCurrentWord,
                            })}
                        >
                            {wordState.characters.map(
                                (characterState, characterIndex) => {
                                    const isCurrentCharacter =
                                        isCurrentWord &&
                                        characterIndex ===
                                            wordState.characterIndex;

                                    return (
                                        <span
                                            key={characterState.id}
                                            className={clsx(styles.character, {
                                                [styles.currentCharacter]:
                                                    isCurrentCharacter,
                                                [styles.error]:
                                                    characterState.status ===
                                                    "incorrect",
                                            })}
                                        >
                                            {characterState.character}
                                        </span>
                                    );
                                }
                            )}
                        </span>
                    );
                })}
            </div>

            <input
                ref={inputRef}
                onChange={onChange}
                className="sr-only"
                autoFocus
            />
        </>
    );
};
