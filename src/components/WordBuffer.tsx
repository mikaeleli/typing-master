import { Fragment, useRef } from "react";
import { WordState } from "../models/Word";
import clsx from "clsx";

import styles from "./WordBuffer.module.css";

const SPACE_CHARACTER = String.fromCharCode(160);

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
                        <Fragment key={wordState.id}>
                            <span className={clsx(styles.word)}>
                                {wordState.characters.map(
                                    (characterState, characterIndex) => {
                                        const isCurrentCharacter =
                                            isCurrentWord &&
                                            characterIndex ===
                                                wordState.characterIndex;

                                        return (
                                            <span
                                                key={characterState.id}
                                                className={clsx(
                                                    styles.character,
                                                    {
                                                        [styles.currentCharacter]:
                                                            isCurrentCharacter,
                                                        [styles.error]:
                                                            characterState.status ===
                                                            "incorrect",
                                                        [styles.correct]:
                                                            characterState.status ===
                                                            "correct",
                                                    },
                                                )}
                                            >
                                                {characterState.character}
                                            </span>
                                        );
                                    },
                                )}
                            </span>

                            {wordIndex !== words.length - 1 && (
                                <span
                                    className={clsx(styles.character, {
                                        [styles.currentCharacter]:
                                            isCurrentWord &&
                                            wordState.characterIndex ===
                                                wordState.characters.length,
                                    })}
                                >
                                    {SPACE_CHARACTER}
                                </span>
                            )}
                        </Fragment>
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
