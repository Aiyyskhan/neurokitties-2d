import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSolanaNetwork } from "@/context/SolanaNetworkContext";
import { createNFT, MetadataAttributesType, PartialMetadata } from "@/solana/nftManager";
import { KittyAvatar, RefKittyAvatar } from "@/components/KittyAvatar";
import { NetworkSelect } from "@/components/NetworkSelect";
import { SoundButton } from "@/components/SoundButton";
import Modal from "@/components/Modal/Modal";
import type { KittyData } from "@/types/game";
import * as config from '@/config';

import styles from "./NFTmint.module.scss";


interface NFTmintType {
    ref: React.RefObject<KittyData | null>;
}

const NFTmint: FC<NFTmintType> = ({ ref }) => {
    // const { connected, wallet } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const { network, setNetwork, endpoint, setEndpoint } = useSolanaNetwork(); // 'devnet' | 'mainnet'
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const kittyAvatarSnapshot = useRef<RefKittyAvatar | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [progressLines, setProgressLines] = useState<string[]>([]);
    const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle");
    
    useEffect(() => {
        // логика деблокировки клавиши "пробел" со стороны Phaser.js
        const preventPhaserCapture = (event: KeyboardEvent) => {
            event.stopPropagation();
        };
        
        const handleFocus = () => {
            window.addEventListener("keydown", preventPhaserCapture, true);
        };
        
        const handleBlur = () => {
            window.removeEventListener("keydown", preventPhaserCapture, true);
        };

        const textarea = textareaRef.current;
        textarea?.addEventListener("focus", handleFocus);
        textarea?.addEventListener("blur", handleBlur);
        
        return () => {
            textarea?.removeEventListener("focus", handleFocus);
            textarea?.removeEventListener("blur", handleBlur);
        };
    }, []);


    const kitty_id = ref.current!.kitty_id;
    const kitty_generation = ref.current!.generation;
    const kitty_progress = ref.current!.progress;
    const kitty_genome = ref.current!.genome;
    // const population_size = ref.current!.population_size;

    // console.log(`kitty id: ${kitty_id}`);

    const kitty_name = `${config.NFT_METADATA_TMP.NAME} #${kitty_id}`;
    const kitty_symbol = `${config.NFT_METADATA_TMP.SYMBOL} ${kitty_id}`;
    const default_description = `${config.NFT_METADATA_TMP.DESCRIPTION}${kitty_id}`;
    // const genomeJson = JSON.stringify(genome);
    // console.log(`Genome: ${genomeJson}`);    

    const colorArray = [...kitty_genome.COLORS];

    const kitty_attributes: MetadataAttributesType[] = [
        { trait_type: "game", value: "NeuroKitties" }, 
        { trait_type: "version", value:  config.GAME_VERSION },
    ];

    const kitty_extensions = JSON.stringify({
        COLORS: kitty_genome.COLORS,
        BRAIN: kitty_genome.BRAIN,
        // BRAIN_MASK: genome.MUTATION_MASK,
    });

    const addProgress = (line: string) => {
        setProgressLines((prev) => [...prev, line]);
    };

    const getLineStatus = (line: string): "success" | "error" | null => {
        const lower = line.toLowerCase();
        if (lower.startsWith("error") || lower.includes("failed") || lower.includes("problems")) {
            return "error";
        }
        if (lower.includes("uploaded") || lower.includes("nft created")) {
            return "success";
        }
        return null;
    };

    const progressContent = useMemo(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return progressLines.map((line, lineIndex) => {
            if (!line) {
                return <div key={`line-${lineIndex}`} className={styles["mint-progress-line"]}>&nbsp;</div>;
            }
            const parts = line.split(urlRegex);
            const lineStatus = getLineStatus(line);
            return (
                <div key={`line-${lineIndex}`} className={styles["mint-progress-line"]}>
                    <span
                        className={`${styles["mint-progress-icon"]} ${
                            lineStatus ? styles[`mint-progress-icon--${lineStatus}`] : ""
                        }`}
                        aria-hidden="true"
                    >
                        {lineStatus === "success" ? "✔" : lineStatus === "error" ? "✖" : ""}
                    </span>
                    {parts.map((part, partIndex) => {
                        if (part.startsWith("http://") || part.startsWith("https://")) {
                            return (
                                <a
                                    key={`part-${lineIndex}-${partIndex}`}
                                    href={part}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles["mint-progress-link"]}
                                >
                                    {part}
                                </a>
                            );
                        }
                        return <span key={`part-${lineIndex}-${partIndex}`}>{part}</span>;
                    })}
                </div>
            );
        });
    }, [progressLines]);

    const minting = async() => {
        setIsModalOpen(true);
        setProgressLines([]);
        setIsMinting(true);
        setMintStatus("idle");
        try {
            if(kittyAvatarSnapshot.current?.snapshotBase64) {
                if (wallet) { // && connected) {
                    const solanaEndpoint = endpoint || connection.rpcEndpoint;

                    const fullDescription = `Progress: ${kitty_progress}\nGeneration: ${kitty_generation}\nDescription:\n${textareaRef.current?.value as string}`
                    const partMetadata: PartialMetadata = {
                        name: kitty_name,
                        symbol: kitty_symbol,
                        description: fullDescription,
                        attributes: kitty_attributes,
                    }
                    await createNFT(
                        wallet, 
                        solanaEndpoint, 
                        network, 
                        kittyAvatarSnapshot.current.snapshotBase64, 
                        partMetadata,
                        kitty_extensions,
                        addProgress
                    );                
                    setMintStatus("success");
                } else {
                    addProgress("Failed to connect to wallet");
                    throw new Error('Failed to connect to wallet');
                }
            } else {
                addProgress("Problems with snapshotBase64");
                throw new Error('Problems with snapshotBase64');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            addProgress(`Error: ${message}`);
            setMintStatus("error");
        } finally {
            setIsMinting(false);
        }
    }

    return (
        <div className={styles["nft-panel"]}>
            <>
                <div className={styles["nft-data"]}>
                    <div className={styles["nft-img"]}>
                        <KittyAvatar ref={kittyAvatarSnapshot} colorArray={colorArray} />
                    </div>
                    <div className={styles["nft-metadata"]}>
                        <div className={styles["nft-name-symbol"]}>
                            <h1>{kitty_name}</h1>
                            <h3>Progress: {kitty_progress}</h3>
                            <h3>Generation: {kitty_generation}</h3>
                            <h3>Symbol: {kitty_symbol}</h3>
                            {/* <h3>Population size: {population_size}</h3> */}
                        </div>
                        <div className={styles["nft-description"]}>
                            <label>Description:</label>
                            <textarea
                                ref={textareaRef}
                                className={styles["nft-description-textarea"]} 
                                inputMode="text" 
                                defaultValue={default_description} 
                                rows={4} cols={33} 
                            />
                        </div>
                    </div>
                </div>
                <div className={styles["network-switch"]}>
                    <NetworkSelect 
                        network={network} 
                        onChangeNetwork={setNetwork} 
                        endpoint={endpoint} 
                        onChangeEndpoint={setEndpoint}
                    />
                </div>
                <div className={styles["nft-button"]}>
                    <SoundButton className={styles["mint"]} onClick={minting} disabled={isMinting}>MINT</SoundButton>
                </div>
                {isModalOpen && (
                    <Modal onExit={isMinting ? undefined : () => setIsModalOpen(false)}>
                        <div className={styles["mint-progress"]}>
                            <div className={styles["mint-progress-title"]}>
                                <span>Mint progress</span>
                                {isMinting && (
                                    <span className={styles["mint-progress-dots"]} aria-hidden="true">
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </span>
                                )}
                                {!isMinting && mintStatus === "success" && (
                                    <span className={`${styles["mint-progress-status"]} ${styles["mint-progress-status--success"]}`} aria-hidden="true">✔</span>
                                )}
                                {!isMinting && mintStatus === "error" && (
                                    <span className={`${styles["mint-progress-status"]} ${styles["mint-progress-status--error"]}`} aria-hidden="true">✖</span>
                                )}
                            </div>
                            <div className={styles["mint-progress-body"]}>
                                {progressLines.length === 0 ? "Waiting for updates..." : progressContent}
                            </div>
                        </div>
                    </Modal>
                )}
            </>
        </div>
    )
}

export default NFTmint;
