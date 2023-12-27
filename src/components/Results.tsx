import dayjs from "dayjs";
import { TypingReport } from "../models/Word";
import styles from "./Results.module.css";

type Props = {
    results: TypingReport | undefined;
};

export const Results = (props: Props) => {
    const { results } = props;

    if (!results) {
        return null;
    }

    return (
        <div className={styles.results}>
            <table>
                <caption>Results</caption>

                <thead>
                    <tr>
                        <th>WPM</th>
                        <th>Accuracy (Words)</th>
                        <th>Accuracy (Keystrokes)</th>
                        <th>Errors</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{results.wordsPerMinute.toFixed(2)}</td>
                        <td>{results.accuracy.words.toFixed(2)}%</td>
                        <td>{results.accuracy.keystrokes.toFixed(2)}%</td>
                        <td>{results.errors}</td>
                        <td>{dayjs(results.time).format("mm:ss")}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
