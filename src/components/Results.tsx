import dayjs from "dayjs";
import styles from "./Results.module.css";
import { Report } from "../models/report";

type Props = {
    report: Report | undefined;
};

export const Results = (props: Props) => {
    const { report } = props;

    if (!report) {
        return null;
    }

    return (
        <div className={styles.results}>
            <table>
                <caption>Results</caption>

                <thead>
                    <tr>
                        <th>WPM</th>
                        <th>Accuracy</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{report.wpm.toFixed(2)}</td>
                        <td>{report.accuracy.toFixed(2)}%</td>
                        <td>{dayjs(report.duration).format("mm:ss")}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
