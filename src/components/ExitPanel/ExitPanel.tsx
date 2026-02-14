import React from "react";
import { SoundButton } from "@/components/SoundButton";
import styles from "./ExitPanel.module.scss";

interface ExitPanelProps {
  onExit: () => void;
  onCancel: () => void;
}

const ExitPanel: React.FC<ExitPanelProps> = ({ onExit, onCancel }) => {
  return (
    <div className={styles.exitPanel}>
      <h2 className={styles["exitPanel-title"]}>Exit Game</h2>

      <p className={styles["exitPanel-text"]}>
        Are you sure you want to exit the game?
      </p>

      <div className={styles["exitPanel-actions"]}>
        <SoundButton onClick={onCancel} className={styles["exitPanel-btn"]}>
            No, Stay
        </SoundButton>
        <SoundButton onClick={onExit} className={`${styles["exitPanel-btn"]} ${styles["exitPanel-btn-danger"]}`}>
            Yes, Exit
        </SoundButton>
      </div>
    </div>
  );
};

export default ExitPanel;
