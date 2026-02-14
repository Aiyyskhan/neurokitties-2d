import React, { useState, useRef } from "react";
import { RefEvolutionControl } from "@/components/EvolutionControl";
import * as config from '@/config';

import styles from "./ValueAdjuster.module.scss";

interface ValueAdjusterProps {
    valueRef: React.RefObject<RefEvolutionControl>;
    valueName: "mutationProb" | "mutationLev" | "brainTransferProb" | "brainFraction";
}

const ValueAdjuster: React.FC<ValueAdjusterProps> = ({ valueRef, valueName }) => {
    const [value, setValue] = useState(valueRef.current[valueName]);
    const changeSound = useRef(new Audio(config.SOUNDS.BTN.VALUE_ADJUST_SOURCE));

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const deltaStep = config.VALUE_ADJUST_AUTOCHANGE.STEP; // Шаг изменения значения
    const minValue = config.VALUE_ADJUST_AUTOCHANGE.MIN; // Минимальное значение
    const maxValue = config.VALUE_ADJUST_AUTOCHANGE.MAX; // Максимальное значение
    const delay = config.VALUE_ADJUST_AUTOCHANGE.DELAY; // Задержка перед автоинкрементом/автодекрементом
    const interval = config.VALUE_ADJUST_AUTOCHANGE.INTERVAL; // Интервал автоинкремента/автодекремента

    // Функция для изменения значений
    const handleChange = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
        const newValue = Math.max(minValue, Math.min(maxValue, valueRef.current[valueName] + delta)); // Ограничиваем от 0 до 1
        if (newValue !== valueRef.current[valueName]) {
            changeSound.current.currentTime = 0;
            changeSound.current.play();
            changeSound.current.volume = config.SOUNDS.BTN.VOLUME;
        }
        valueRef.current[valueName] = newValue;
        setter(valueRef.current[valueName]);
        // console.log("value ref:", valueRef.current);        
    };

    const startAutoChange = (increment: boolean) => {
        handleChange(setValue, increment ? deltaStep : -deltaStep);
        
        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                handleChange(setValue, increment ? deltaStep : -deltaStep);
            }, interval);
        }, delay);
    };

    const stopAutoChange = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <div className={styles["controls"]}>
            <button
                onMouseDown={() => startAutoChange(false)}
                onMouseUp={stopAutoChange}
                onMouseLeave={stopAutoChange}
            >-</button>
            <span>{value.toFixed(2)}</span>
            <button
                onMouseDown={() => startAutoChange(true)}
                onMouseUp={stopAutoChange}
                onMouseLeave={stopAutoChange}
            >+</button>
        </div>
    );
};

export default ValueAdjuster;
