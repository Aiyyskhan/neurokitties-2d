import React, { use } from "react";
import { SelectedKittiesContext } from "@/context/GameContext";
import { ValueAdjuster } from "@/components/ValueAdjuster";
import { SoundButton } from "@/components/SoundButton";
import { Tooltip } from "@/components/Tooltip";
import { POPULATION_GENOME } from "@/neuroevolution/genomes";
import { crossover } from "@/neuroevolution/evolution";
import { POPULATION_SIZE } from "@/config";

import styles from "./EvolutionControl.module.scss";

export interface RefEvolutionControl {
    mutationProb: number;
    mutationLev: number;
    brainTransferProb: number;
    brainFraction: number;
}

interface EvolutionControlProps {
    episodeUpdate: () => void;
    ref: React.RefObject<RefEvolutionControl>;
}

const EvolutionControl: React.FC<EvolutionControlProps> = ({ episodeUpdate, ref }) => {
    const selectedKittiesContext = use(SelectedKittiesContext);
    
    const evolutionStart = () => {        
        const selectedKitties = selectedKittiesContext?.selectedKitties;
        const selectedKittiesId = selectedKitties?.map( k => k.id ) as number[];

        if (selectedKitties) {
            const new_pop_genome = crossover(
                POPULATION_GENOME, selectedKittiesId, POPULATION_SIZE,
                ref.current.mutationProb, 
                ref.current.mutationLev, 
                ref.current.brainTransferProb, 
                ref.current.brainFraction, 
                false
            )
            POPULATION_GENOME.length = 0;
            new_pop_genome.forEach((genome) => {
                POPULATION_GENOME.push(genome);
            })
            new_pop_genome.length = 0;
            episodeUpdate();
        } else {
            console.log("Нужно выбрать минимум одного котика!");            
        }
    }

    return (
        <div className={styles["evolution-settings-container"]}>
            <div className={styles["setting"]}>
                <Tooltip 
                    text="how often the NeuroKitty’s brain mutates"
                    style={{
                        "--tooltip-top": "calc(100% + 8px)",
                        "--tooltip-left": "40%",
                    } as React.CSSProperties}
                >
                    <span>Mutation probability:</span>
                </Tooltip>
                <ValueAdjuster valueRef={ref} valueName="mutationProb"/>
            </div>

            <div className={styles["setting"]}>
                <Tooltip 
                    text="how strong those mutations are"
                    style={{
                        "--tooltip-top": "calc(100% + 8px)",
                        "--tooltip-left": "40%",
                    } as React.CSSProperties}
                >
                    <span>Mutation level:</span>
                </Tooltip>
                <ValueAdjuster valueRef={ref} valueName="mutationLev"/>
            </div>

            <div className={styles["setting"]}>
                <Tooltip 
                    text="chance of inheriting traits from the selected leader"
                    style={{
                        "--tooltip-top": "calc(100% + 8px)",
                        "--tooltip-left": "40%",
                    } as React.CSSProperties}
                >
                    <span>Leader brain influence probability:</span>
                </Tooltip>
                <ValueAdjuster valueRef={ref} valueName="brainTransferProb"/>
            </div>

            <div className={styles["setting"]}>
                <Tooltip 
                    text="how much of the leader’s brain is transferred"
                    style={{
                        "--tooltip-top": "calc(100% + 8px)",
                        "--tooltip-left": "40%",
                    } as React.CSSProperties}
                >
                    <span>Leader’s brain fraction:</span>
                </Tooltip>
                <ValueAdjuster valueRef={ref} valueName="brainFraction"/>
            </div>

            <div className={styles["buttons"]}>
                <SoundButton className={styles["evolve"]} onClick={evolutionStart}>EVOLVE</SoundButton>
            </div>
        </div>
    );
};

export default EvolutionControl;
