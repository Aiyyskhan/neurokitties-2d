import { useEffect, useLayoutEffect, useRef } from 'react';
import { EventBus } from '@/EventBus';
import styles from "./PhaserGame.module.scss";

export interface RefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface PhaserGameProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    gameConfig: Phaser.Types.Core.GameConfig;
    parentElement: string;
    ref: React.RefObject<RefPhaserGame | null>
}

const PhaserGame: React.FC<PhaserGameProps> = ({ currentActiveScene, gameConfig, parentElement, ref }) => {
    const gameInstance = useRef<Phaser.Game | null>(null);

    const updateRef = (scene: Phaser.Scene | null, ref: React.RefObject<RefPhaserGame | null>) => {
        ref.current = { game: gameInstance.current, scene };
    }

    useLayoutEffect(() =>
    {
        if (gameInstance.current === null)
        {
            gameInstance.current = new Phaser.Game({ ...gameConfig, parent: parentElement });

            updateRef(null, ref);
        }

        return () =>
        {
            if (gameInstance.current)
            {
                gameInstance.current?.destroy(true);
                gameInstance.current = null;
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        const onSceneReady = (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {
                currentActiveScene(scene_instance);
            }

            updateRef(scene_instance, ref);
            
        }

        EventBus.on('current-scene-ready', onSceneReady);

        return () =>
        {
            EventBus.off('current-scene-ready', onSceneReady);
        }
    }, [currentActiveScene, ref]);

    return (
        <div className={styles["game-container"]} id={parentElement}></div>
    );
};

export default PhaserGame;