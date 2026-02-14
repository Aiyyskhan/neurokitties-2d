import React from "react";
import styles from "./Tooltip.module.scss";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function Tooltip({ text, children, style }: TooltipProps) {
  return (
    <span className={styles.tooltip} style={style}>
      <span className={styles.tooltip__trigger} tabIndex={0}>
        {children}
      </span>

      <span className={styles.tooltip__bubble} role="tooltip">
        {text}
      </span>
    </span>
  );
}
