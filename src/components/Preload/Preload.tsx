import { Spinner } from "@/components/Spinner";
import styles from "./Preload.module.scss";

const Preload: React.FC = () => {
    return (
        <div className={styles["preload"]}>
            <Spinner className={styles["spinner"]} />
        </div>
    );
}

export default Preload;