import clsx from "clsx";
import styles from "./Word.module.css";

type Props = {
    word: string;
    isCurrentWord: boolean;
};

export const Word = (props: Props) => {
    const { word } = props;

    return (
        <span
            className={clsx(styles.word, {
                [styles.highlight]: props.isCurrentWord,
            })}
        >
            {word}
        </span>
    );
};
