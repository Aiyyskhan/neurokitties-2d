import { FC, ReactNode } from "react";
import { SoundButton } from "@/components/SoundButton";

import styles from "./Modal.module.scss";

interface ModalProps {
    children: ReactNode;
    onExit?: () => void;
}

const Modal: FC<ModalProps> = ({ children, onExit }) => {
    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal"]} onClick={(event) => event.stopPropagation()}>
                <div className={styles["modal-content"]}>
                    {children}
                </div>
                {onExit && (
                    <SoundButton className={styles["modal-close"]} onClick={onExit}>✖</SoundButton>
                )}
            </div>
        </div>
    )
}

export default Modal;
