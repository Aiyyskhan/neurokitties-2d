import styles from "./Spinner.module.scss"

const Spinner = ({ className = '' }) => {
    return (
        <>
            <div className={`${styles["spinner"]} ${className}`}></div>
        </>
    );
};

export default Spinner;  