import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FullMetadata, getNFTs } from "@/solana/nftManager";
import { Genome, POPULATION_GENOME } from "@/neuroevolution/genomes";
import { Spinner } from "@/components/Spinner";
import { SoundButton } from "@/components/SoundButton";
import type { GenomeType } from "@/types/game";
import * as config from '@/config';

import styles from "./NFTgallery.module.scss";

const NFTgallery: React.FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [nfts, setNfts] = useState<FullMetadata[]>([]);
    const [nftsDone, setNftsDone] = useState<boolean>(false);

    useEffect(() => {
        if (wallet.connected) {
            if (wallet) {
                const solanaEndpoint = connection.rpcEndpoint;
                getNFTs(wallet, solanaEndpoint).then((nfts) => {
                    if (nfts) {
                        setNfts(nfts);
                        setNftsDone(true);
                    }
                }).catch((err) => {
                    console.error("Failed to get NFTs:", err);
                });
            } else {
                return;
            }
        }
    }, [wallet, connection]);

    const selectNft = (idx: number) => {
        const nft = nfts[idx];
        console.log(`Idx: ${idx}`);
        console.log(`Name: ${nft.name}`);
        console.log(`Symbol: ${nft.symbol}`);
        console.log(`Descr: ${nft.description}`);
        // console.log(`Attr: ${nft.attributes}`);
        // console.log(`Prop: ${nft.properties}`);

        const genomeTrait = nft.attributes.find(trait => trait.trait_type === "genome");
        const genomeStr = genomeTrait?.value;
        // console.log(`Genome str: ${genomeStr}`);
        
        if (genomeStr) {
            const genome: GenomeType = JSON.parse(genomeStr)
            const colorCount: number = config.COLOR_COUNT;
            const matricesCount: number = config.MATRICES_COUNT;
            const neuronCount: number = config.NEURON_COUNT;

            const new_genome: Genome = new Genome(colorCount, matricesCount, neuronCount);

            new_genome.BRAIN = deepCloneArray(genome.BRAIN);
            // new_genome.BRAIN_MASK = deepCloneArray(genome.BRAIN_MASK);
            new_genome.COLORS = deepCloneArray(genome.COLORS)
            // console.log(`COLORS: ${genome.COLORS} type: ${typeof genome.COLORS}`);
            
            POPULATION_GENOME.push(new_genome);
        }
    }

    const deepCloneArray = <T,>(arr: T[]): T[] => {
        return arr.map(item => Array.isArray(item) ? (deepCloneArray(item as unknown as T[]) as unknown as T) : item);
    }

    return (
        <div className={styles["nft-gallery"]}>
            {
                nftsDone ? (
                    <div className={styles["nft-gallery-grid"]}>
                        {nfts.map((nft, index) => (
                        <div key={index} className={styles["nft-card"]}>
                            <div className={styles["nft-card-left"]}>
                                <img src={nft.image} alt={nft.name} />
                                <div className={styles["nft-selection-btn"]}>
                                    <SoundButton onClick={() => {selectNft(index)}}>SELECT</SoundButton>
                                </div>
                            </div>
                            <div className={styles["nft-card-right"]}>
                                <h3 className={styles["nft-name"]}>{nft.name}</h3>
                                {/* <p className={styles["nft-description"]}>Idx: {index}</p> */}
                                <p className={styles["nft-description"]}>{nft.description}</p>
                            </div>                            
                        </div>
                        ))}
                    </div>
                ) : (
                    <>
                    <h2 className={styles["nft-gallery-title"]}>your NFTs loading...</h2>
                    <Spinner />
                    </>
                )
            }
        </div>
    );
};

export default NFTgallery;
