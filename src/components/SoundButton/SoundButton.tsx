import { useRef } from "react";
import * as config from '@/config';

import styles from "./SoundButton.module.scss";

interface SoundButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}

const SoundButton: React.FC<SoundButtonProps> = ({ children, onClick, className, disabled }) => {
	const pressSound = useRef(new Audio(config.SOUNDS.BTN.PRESS_SOURCE));
	const releaseSound = useRef(new Audio(config.SOUNDS.BTN.RELEASE_SOURCE));

	const handleInteraction = (isPressing: boolean) => {
		if (disabled) return;
		const sound = isPressing ? pressSound.current : releaseSound.current;
		sound.currentTime = 0;
		sound.play();
		sound.volume = config.SOUNDS.BTN.VOLUME;
	};

	return (
		<div
			className={`${styles.button} ${disabled ? styles.disabled : ""} ${className || ""}`}
			onMouseDown={() => handleInteraction(true)}
			onMouseUp={() => handleInteraction(false)}
			onClick={disabled ? undefined : onClick}
			aria-disabled={disabled}
		>
			{children}
		</div>
	);
};

export default SoundButton;
