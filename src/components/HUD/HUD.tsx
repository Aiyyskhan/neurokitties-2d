import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SelectedKittiesContext, ChampionKittiesContext } from "@/context/GameContext";
import { Modal } from "@/components/Modal";
import { EvolutionControl, RefEvolutionControl } from "@/components/EvolutionControl";
import { NFTmint } from "@/components/NFTmint";
import { KittyExport } from "@/components/KittyExport";
import { SelectedInfo } from "@/components/SelectedInfo";
import { RefPhaserGame } from "@/components/PhaserGame";
import { SoundButton } from "@/components/SoundButton";
import { InfoPanel } from "@/components/InfoPanel";
import { ManualPanel } from '@/components/ManualPanel';
import { ExitPanel } from "@/components/ExitPanel";
import { Tooltip } from "@/components/Tooltip";
import { clearPopulation, POPULATION_GENOME } from "@/neuroevolution/genomes";
import GameScene from "@/scenes/Game";
import type { SelectedKitty, KittyData } from "@/types/game";
import * as config from '@/config';

import styles from './HUD.module.scss';

interface HUDProps {
    ref: React.RefObject<RefPhaserGame | null>;
}

const HUD: React.FC<HUDProps> = ({ ref }) => {
    const { connected } = useWallet();
    const [generation, setGeneration] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [panelState, setPanelState] = useState<'NFT' | 'EXPORT' | 'EVO' | 'INFO' | 'HIDE'>('HIDE');
    const [manualShow, setManualShow] = useState<boolean>(false);
    const [exitPanelShow, setExitPanelShow] = useState<boolean>(false);
    const [info, setInfo] = useState<string | null>(null);

    const selectedKittiesContext = use(SelectedKittiesContext);
    const selectedKitties = selectedKittiesContext?.selectedKitties;
    const setSelectedKitties = selectedKittiesContext?.setSelectedKitties;

    const championKittiesContext = use(ChampionKittiesContext);
    const championKitties = championKittiesContext?.championKitties;
    const setChampionKitties = championKittiesContext?.setChampionKitties;

    const bg_music = useRef(new Audio(config.SOUNDS.ADDITIONAL_BG.SOURCE));

    const evolutionParameters = useRef<RefEvolutionControl>({
        mutationProb: config.MUTATION_PROB,
        mutationLev: config.MUTATION_LEVEL,
        brainTransferProb: config.BRAIN_TRANSFER_PROB,
        brainFraction: config.BRAIN_FRACTION,
    });
    const selectedKittyData = useRef<KittyData | null>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                scene.createKitties();
                scene.addingRemovingKitties(
                    (arr: SelectedKitty[]) => { setSelectedKitties!(arr) }, 
                    (arr: number[]) => { setChampionKitties!(arr) }
                );
                scene.activityStart();            
            }
        }
    }, [ref])

    useEffect(() => {
        if (bg_music.current && !bg_music.current.paused) {
            return; // Если уже играет, ничего не делаем
        }
        bg_music.current.loop = true;
        bg_music.current.volume = config.SOUNDS.ADDITIONAL_BG.VOLUME;
        
        bg_music.current.play().catch((error) => {
            console.warn("Ошибка воспроизведения музыки:", error);
        });
        
        return () => {
            if (bg_music.current) {
                bg_music.current.pause();
            }
        }
    }, [bg_music, ref]);

    useEffect(() => {
        const modalOpenInHud = (isPaused && panelState !== 'HIDE') || manualShow || exitPanelShow;
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                scene.handleModalInputLock(modalOpenInHud);
            }
        }

        return () => {
            if (ref.current) {
                const scene = ref.current.scene as GameScene;
                if (scene && scene.scene.key === 'GameScene') {
                    scene.handleModalInputLock(false);
                }
            }
        };
    }, [isPaused, panelState, manualShow, exitPanelShow, ref]);

    const handlePauseToggle = () => {
        setIsPaused((prev) => !prev);
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                scene.handlePause(!isPaused);
            }
        }
    };

    const handleEvoPanel = () => {
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                if (panelState === 'EVO') {
                    setPanelState('HIDE');
                } else {
                    if (selectedKitties && selectedKitties.length > 0) {
                        setPanelState('EVO');
                    } else {
                        const info = "No selected kitties";
                        console.log(info);
                        setPanelState('INFO');
                        setInfo(info);
                    }
                }
            }
        }
    };

    const prepareSelectedKittyData = (): boolean => {
        if (selectedKitties && selectedKitties.length > 0) {
            const firstSelectedKittyId = selectedKitties[0].id;
            const firstSelectedKittyProgress = selectedKitties[0].progress;
            selectedKittyData.current = { 
                kitty_id: firstSelectedKittyId, 
                generation: generation,
                progress: firstSelectedKittyProgress,
                genome: POPULATION_GENOME[firstSelectedKittyId],
                population_size: config.POPULATION_SIZE,
            };
            return true;
        } else {
            const info = "No NeuroKitty selected. Please select a NeuroKitty.";
            console.log(info);
            setPanelState('INFO');
            setInfo(info);
            return false;
        }
    };

    const handleNftPanel = () => {
        if (prepareSelectedKittyData()) {
            setPanelState('NFT');
        }
    };

    const handleExportPanel = () => {
        if (prepareSelectedKittyData()) {
            setPanelState('EXPORT');
        }
    };

    const generationUpdate = () => {
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                scene.createKitties();
                scene.addingRemovingKitties(
                    (arr: SelectedKitty[]) => { setSelectedKitties!(arr) }, 
                    (arr: number[]) => { setChampionKitties!(arr) }
                );
                setGeneration(generation + 1);
                handleEvoPanel();
                handlePauseToggle();
            }
        }
    }

    const handleExitPanel = () => {
        setExitPanelShow(true);
    }

    const exitGame = () => {
        if (ref.current) {
            const scene = ref.current.scene as GameScene;
            if (scene && scene.scene.key === 'GameScene') {
                if (bg_music.current) {
                    bg_music.current.pause();
                }
                scene.exit();
                if (POPULATION_GENOME.length > 0) {
                    clearPopulation();
                }
            }
        }
    }

    return (
        <>
            <div className={styles.hud}>
                <div className={styles["hud-info"]}>
                    <div className={styles["hud-info-episode-score"]}>
                        <Tooltip 
                            text="current population generation" 
                            style={{
                                "--tooltip-top": "calc(100% + 8px)",
                                "--tooltip-left": "50%",
                            } as React.CSSProperties}
                        >
                            <span>GENERATION: {generation}</span>
                        </Tooltip>                        
                        <Tooltip 
                            text="NeuroKitties that reached the finish" 
                            style={{
                                "--tooltip-top": "calc(100% + 8px)",
                                "--tooltip-left": "50%",
                            } as React.CSSProperties}
                        >
                            <span>CHAMPIONS: {championKitties?.length}</span>
                        </Tooltip>
                    </div>
                    <div className={styles["hud-info-selected-kitties"]}>
                        <Tooltip 
                            text="IDs of currently selected NeuroKitties" 
                            style={{
                                "--tooltip-top": "calc(100% + 8px)",
                                "--tooltip-left": "20%",
                            } as React.CSSProperties}
                        >
                            <SelectedInfo /> 
                        </Tooltip>
                    </div>
                </div>
                
                <div className={styles["hud-controls"]}>
                    {
                        isPaused ? (
                            <>
                                { selectedKitties && selectedKitties.length > 0 &&
                                    <div className={styles["hud-controls-btn"]}>
                                        <div className={styles["hud-controls-btn-evo"]}>
                                            <SoundButton onClick={handleEvoPanel}>
                                                EVO
                                            </SoundButton>
                                        </div>
                                    </div>
                                }
                                { connected ? (
                                    <div className={styles["hud-controls-btn"]}>
                                        <div className={styles["hud-controls-btn-nft"]}>
                                            <SoundButton onClick={handleNftPanel}>
                                                NFT
                                            </SoundButton>
                                        </div>
                                    </div>
                                ) : ( selectedKitties && selectedKitties.length > 0 &&
                                    <div className={styles["hud-controls-btn"]}>
                                        <div className={styles["hud-controls-btn-export"]}>
                                            <SoundButton onClick={handleExportPanel}>
                                                EXPORT
                                            </SoundButton>
                                        </div>
                                    </div>
                                )}
                                <div className={styles["hud-controls-btn"]}>
                                    <div className={styles["hud-controls-btn-start"]}>
                                        <SoundButton onClick={handlePauseToggle}>
                                            START
                                        </SoundButton>
                                    </div>
                                </div>                                
                            </>
                        ) : (
                            <div className={styles["hud-controls-btn"]}>
                                <div className={styles["hud-controls-btn-pause"]}>
                                    <SoundButton onClick={handlePauseToggle}>
                                        PAUSE
                                    </SoundButton>
                                </div>
                            </div>
                        )
                    }
                    <div className={styles["hud-controls-btn"]}>
                        <div className={styles["hud-controls-btn-manual"]}>
                            <SoundButton onClick={() => setManualShow(true)}>
                                MANUAL
                            </SoundButton>
                        </div>                        
                    </div>
                    <div className={styles["hud-controls-btn"]}>
                        <div className={styles["hud-controls-btn-exit"]}>
                            <SoundButton onClick={handleExitPanel}>
                                EXIT
                            </SoundButton>
                        </div>
                    </div>
                </div>
            </div>
            {
                isPaused && panelState === 'NFT' && (
                    <Modal onExit={() => setPanelState('HIDE')}>
                        <NFTmint ref={selectedKittyData} />
                    </Modal>
                )
            }
            {
                isPaused && panelState === 'EXPORT' && (
                    <Modal onExit={() => setPanelState('HIDE')}>
                        <KittyExport ref={selectedKittyData} />
                    </Modal>
                )
            }
            {
                isPaused && panelState === 'INFO' && (
                    <Modal onExit={() => setPanelState('HIDE')}>
                        <InfoPanel info={info} />
                    </Modal>
                )
            }
            {
                isPaused && panelState === 'EVO' && (
                    <Modal onExit={() => handleEvoPanel()}>
                        <EvolutionControl episodeUpdate={generationUpdate} ref={evolutionParameters}/>
                    </Modal>
                )
            }
            {
                manualShow && (
                    <Modal onExit={() => setManualShow(false)}>
                        <ManualPanel />
                    </Modal>
                )
            }
            {
                exitPanelShow && (
                    <Modal>
                        <ExitPanel onExit={exitGame} onCancel={() => setExitPanelShow(false)} />
                    </Modal>
                )
            }
        </>
    );
};

export default HUD;
