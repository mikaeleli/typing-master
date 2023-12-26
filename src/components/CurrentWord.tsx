import clsx from "clsx";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import styles from "./CurrentWord.module.css";
import { CharacterState, WordState } from "../models/Word";

type Props = {
    wordState: WordState;
};

export const CurrentWord = (props: Props) => {
    const { wordState } = props;

    const characters = useMemo(
        () => enrichWithUniqueKey(wordState.characters),
        [wordState.characters]
    );

    return (
        <span className={clsx(styles.currentWord)}>
            {characters.map((characterState, index) => {
                const isCurrentCharacter = index === wordState.characterIndex;

                return (
                    <span
                        key={characterState.uniqueKey}
                        className={clsx(styles.character, {
                            [styles.currentCharacter]: isCurrentCharacter,
                            [styles.error]:
                                characterState.status === "incorrect",
                        })}
                    >
                        {characterState.character}
                    </span>
                );
            })}

            <span className={styles.character}>␣</span>
        </span>
    );
};

type WithUniqueKey<T> = T & {
    uniqueKey: string;
};

function enrichWithUniqueKey(
    array: Array<CharacterState>
): Array<WithUniqueKey<CharacterState>> {
    return array.map((item) => ({
        ...item,
        uniqueKey: nanoid(),
    }));
}
