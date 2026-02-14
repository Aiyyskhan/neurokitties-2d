import { use, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AuthContext from "@/context/AuthContext";
import { Modal } from "@/components/Modal";
import { RefPhaserGame } from "@/components/PhaserGame";
import { SoundButton } from "@/components/SoundButton";
import { useSolanaNetwork } from "@/context/SolanaNetworkContext";
import { NetworkSelect } from "@/components/NetworkSelect";
import { NFTgallery } from "@/components/NFTgallery";
import { DonationPanel } from "@/components/DonationPanel";
import { ThanksPanel } from "@/components/ThanksPanel";
import { initRandomPopulation, POPULATION_GENOME } from "@/neuroevolution/genomes";
import { crossover } from "@/neuroevolution/evolution";
import MainMenu from "@/scenes/MainMenu";
import * as config from '@/config';

import styles from "./Menu.module.scss";

interface MenuProps { 
    ref: React.RefObject<RefPhaserGame | null>
}

const Menu: React.FC<MenuProps> = ({ ref }) => {
    const { connected } = useWallet();
    const [nftsPanel, setNftsPanel] = useState<boolean>(false);
    const [nftsShow, setNftsShow] = useState<boolean>(false);
    const { network, setNetwork, endpoint, setEndpoint } = useSolanaNetwork();
    const [donationShow, setDonationShow] = useState<boolean>(false);
    const [thanksShow, setThanksShow] = useState<boolean>(false);
    const authContext = use(AuthContext);
    // const isLoggedIn = authContext?.isLoggedIn;
    const setIsLoggedIn = authContext?.setIsLoggedIn;

    const startGame = () => {
        if (ref.current) {
            const scene = ref.current.scene as MainMenu;
            if (scene && scene.scene.key === 'MainMenu') {
                const popSize: number = config.POPULATION_SIZE;
                const colorCount: number = config.COLOR_COUNT;
                const matricesCount: number = config.MATRICES_COUNT;
                const neuronCount: number = config.NEURON_COUNT;
                
                const pop_genome_len = POPULATION_GENOME.length;
                if (pop_genome_len > 0) {
                    console.log(`pop genome len: ${pop_genome_len}`);
                    
                    const indicesArray: number[] = [...Array(pop_genome_len).keys()];
                    const new_pop_genome = crossover(
                        POPULATION_GENOME, indicesArray, popSize, 
                        config.MUTATION_PROB, config.MUTATION_LEVEL, config.BRAIN_TRANSFER_PROB, config.BRAIN_FRACTION, 
                        pop_genome_len === 1
                    )
                    POPULATION_GENOME.length = 0;
                    new_pop_genome.forEach((genome) => {
                        POPULATION_GENOME.push(genome);
                    })
                    new_pop_genome.length = 0;
                } else {
                    initRandomPopulation(popSize, colorCount, matricesCount, neuronCount);
                }
                scene.startGame();
            }
        }
    }

    return (
        <div className={styles.menu}>
            <div className={styles["menu-btns"]}>
                <div className={styles["menu-btn"]}>
                    <SoundButton onClick={startGame}>PLAY</SoundButton>
                </div>
                {connected &&
                    <div className={styles["menu-btn"]}>
                        <SoundButton onClick={() => setNftsPanel(true)}>NFTs</SoundButton>
                    </div>
                }
                <div className={styles["menu-btn"]}>
                    <SoundButton onClick={() => setThanksShow(true)}>THANKS</SoundButton>
                </div>
                <div className={styles["menu-btn"]}>
                    <SoundButton onClick={() => setDonationShow(true)}>DONATE</SoundButton>
                </div>
                {connected ? (
                    <div className={styles["menu-btn"]}>
                        <SoundButton >
                            <WalletMultiButton />
                        </SoundButton>
                    </div>
                ) : (
                    <div className={styles["menu-btn"]}>
                        <SoundButton onClick={() => { setIsLoggedIn?.(false); }}>
                            BACK
                        </SoundButton>
                    </div>
                )}
                {nftsPanel && (
                    <Modal onExit={() => { setNftsShow(false); setNftsPanel(false); }}>
                        {!nftsShow ? (
                            <div className={styles["nfts-panel-start"]}>
                                <NetworkSelect
                                    network={network}
                                    onChangeNetwork={setNetwork}
                                    endpoint={endpoint}
                                    onChangeEndpoint={setEndpoint}
                                />
                                <SoundButton onClick={() => setNftsShow(true)}>LOAD NFTs</SoundButton>
                            </div>
                        ) : (
                            <NFTgallery />
                        )}
                    </Modal>
                )}
                {thanksShow && (
                    <Modal onExit={() => setThanksShow(false)}>
                        <ThanksPanel />
                    </Modal>
                )}
                {donationShow && (
                    <Modal onExit={() => setDonationShow(false)}>
                        <DonationPanel />
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Menu;