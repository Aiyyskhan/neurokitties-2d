import { use, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletContextProvider from '@/context/WalletContext';
import AuthContext, { AuthContextProvider } from '@/context/AuthContext';
import { GameContextProvider } from '@/context/GameContext';
import { SolanaNetworkProvider } from '@/context/SolanaNetworkContext';
import { RefPhaserGame, PhaserGame } from '@/components/PhaserGame';
import { Preload } from '@/components/Preload';
import { Login } from '@/components/Login';
import { HUD } from '@/components/HUD';
import { Menu } from '@/components/Menu';
import * as config from '@/config';

import musicOn from '/assets/ui/musicOn.png';
import musicOff from '/assets/ui/musicOff.png';

import styles from './App.module.scss';

const Game: React.FC = () => {
    const phaserRef = useRef<RefPhaserGame | null>(null);
    const bg_music = useRef(new Audio(config.SOUNDS.MAIN_BG.SOURCE));
    const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

    const toggleMusic = () => {
        if (musicEnabled) {
            bg_music.current.pause();
        } else {
            bg_music.current.play();
        }
        setMusicEnabled(!musicEnabled);
    }

    const [gameState, setGameState] = useState<'PRELOAD' | 'MENU' | 'PLAYING'>('PRELOAD');

    useEffect(() => {
        bg_music.current.loop = true;
        bg_music.current.volume = config.SOUNDS.MAIN_BG.VOLUME_0;
        return () => {
            bg_music.current.pause();
        }
    }, [bg_music]);

    const currentScene = (scene: Phaser.Scene) => {
        if (scene.scene.key === 'MainMenu') {
            if (bg_music.current && musicEnabled) {
                bg_music.current.play();
                bg_music.current.volume = config.SOUNDS.MAIN_BG.VOLUME_0;
            }
            setGameState('MENU');
        } else if (scene.scene.key === 'GameScene') {
            bg_music.current.volume = config.SOUNDS.MAIN_BG.VOLUME_1;
            setGameState('PLAYING');
        }
    }

    return (
        <div className={styles.app} id="app">
            {gameState === 'PRELOAD' && <Preload />}
            <GameContextProvider>
                {gameState === 'MENU' && <Menu ref={phaserRef} />}
                {gameState === 'PLAYING' && <HUD ref={phaserRef} />}
                {(gameState === 'MENU' || gameState === 'PLAYING') && <button className={styles.musicToggle} onClick={toggleMusic}>
                    <span
                        className={styles.musicIcon}
                        style={{
                            maskImage: `url(${musicEnabled ? musicOn : musicOff})`,
                            WebkitMaskImage: `url(${musicEnabled ? musicOn : musicOff})`,
                        }}
                    />
                </button>}
            </GameContextProvider>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} gameConfig={ config.gameConfig } parentElement={"game-container"} />
        </div>
    );
}

const AuthManager: React.FC = () => {
    const { connected } = useWallet();
    const authContext = use(AuthContext);
    const isLoggedIn = authContext?.isLoggedIn;

    return (
        <>
            {connected || isLoggedIn ? <Game /> : <Login />}
        </>
    );
};

const App: React.FC = () => (
    <SolanaNetworkProvider>
        <WalletContextProvider>
            <AuthContextProvider>
                <AuthManager />
            </AuthContextProvider>
        </WalletContextProvider>
    </SolanaNetworkProvider>
);

export default App;