import { useRef } from "react";
import * as config from '@/config';

import styles from "./SoundButton.module.scss";

interface SoundButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const SoundButton: React.FC<SoundButtonProps> = ({ children, onClick, className }) => {
	const pressSound = useRef(new Audio(config.SOUNDS.BTN.PRESS_SOURCE));
	const releaseSound = useRef(new Audio(config.SOUNDS.BTN.RELEASE_SOURCE));

	const handleInteraction = (isPressing: boolean) => {
		const sound = isPressing ? pressSound.current : releaseSound.current;
		sound.currentTime = 0;
		sound.play();
		sound.volume = config.SOUNDS.BTN.VOLUME;
	};

	return (
		<div
			className={`${styles.button} ${className || ""}`}
			onMouseDown={() => handleInteraction(true)}
			onMouseUp={() => handleInteraction(false)}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default SoundButton;
