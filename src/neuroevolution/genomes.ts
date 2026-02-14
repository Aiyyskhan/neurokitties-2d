import type { GenomeType } from "@/types/game";

export const POPULATION_GENOME: Genome[] = [];


export class Genome implements GenomeType {
    COLORS: number[];
    BRAIN: number[][][];
    // BRAIN_MASK: number[][][];

    private sigma = 2.0;

    constructor(
        public colorCount: number,
        public matrixCount: number,
        public neuronCount: number
    ) {
        this.COLORS = [];
        this.BRAIN = [];
        // this.BRAIN_MASK = [];
    } 

    init() {
        // this.brainMaskInit();
        this._brainInit();
        this._colorsInit();
    }

    crossover(new_genome: Genome, other: Genome, leadBrainFractProb: number, leadBrainFract: number) {
        // new_genome.brainMaskInit();
        this._brainCross(new_genome.BRAIN, other.BRAIN, leadBrainFractProb, leadBrainFract);
        this._colorsCross(new_genome.COLORS, other.COLORS, leadBrainFractProb, leadBrainFract);
    }

    mutate(mutProb: number, mutLevel: number) {
        this._brainMutate(mutProb, mutLevel);
        this._colorsMutate(mutProb, mutLevel);
    }

    // brainMaskInit() {
    //     this.BRAIN_MASK.length = 0;
    //     for (let j = 0; j < this.matrixCount; j++) {
    //         const matrices: number[][] = [];
    //         for (let k = 0; k < this.neuronCount; k++) {
    //             const row: number[] = []
    //             for (let l = 0; l < this.neuronCount; l++) {
    //                 row.push(Math.random() < 0.5 ? 1.0 : 0.0);    
    //             }
    //             matrices.push(row.slice());
    //         }
    //         this.BRAIN_MASK.push(matrices.slice());
    //     }
    //     // console.log(`BRAIN_MASK length: ${this.BRAIN_MASK.length}`);        
    // }

    private _colorsInit() {
        for (let i = 0; i < this.colorCount; i++) {
            this.COLORS.push(Math.random());          
        }
    }

    private _brainInit() {
        for (let j = 0; j < this.matrixCount; j++) {
            const matrices: number[][] = [];
            for (let k = 0; k < this.neuronCount; k++) {
                const row: number[] = []
                for (let l = 0; l < this.neuronCount; l++) {
                    if (Math.random() < 0.5) {
                        // row.push(this.BRAIN_MASK[j][k][l] * this.gaussianRandom(0, this.sigma)); //Math.random());
                        row.push(this.gaussianRandom(0, this.sigma));
                    } else {
                        row.push(0.0);
                    }
                }
                matrices.push(row.slice());
            }
            this.BRAIN.push(matrices.slice());
        }
    }

    private _colorsMutate(mutProb: number, mutLevel: number) {
        for (let i = 0; i < this.colorCount; i++) {
            const p = Math.random();
            if (p < mutProb) {
                this.COLORS[i] = Math.random() * mutLevel + this.COLORS[i] * (1 - mutLevel); 
            }
        }
    }

    private _brainMutate(mutProb: number, mutLevel: number) {
        for (const j in this.BRAIN) {
            const p_matrices: number[][] = this.BRAIN[j];
            
            // if (Math.random() < 0.3) {
            // if (Math.random() < mutProb) {
                for (const k in p_matrices) {
                    const p_row: number[] = p_matrices[k];

                    // if (Math.random() < 0.3) {
                        for (const l in p_row) {
                            if (Math.random() < mutProb) {
                                // this.BRAIN[j][k][l] = p_row[l] + this.BRAIN_MASK[j][k][l] * this.gaussianRandom(0, this.sigma) * mutLevel;
                                this.BRAIN[j][k][l] = p_row[l] + this.gaussianRandom(0, this.sigma) * mutLevel;
                            } 
                            // this.BRAIN[j][k][l] = p_row[l] + this.BRAIN_MASK[j][k][l] * this.gaussianRandom(0, this.sigma) * mutLevel;
                            // this.BRAIN[j][k][l] = p_row[l] + this.gaussianRandom(0, this.sigma) * mutLevel;
                        }
                    // }
                }
            // }
        }
    }

    private _colorsCross(new_colors: number[], otherColors: number[], leadBrainFractProb: number, leadBrainFract: number) {
        for (const idx in this.COLORS) {
            const pr = Math.random();
            if (pr < leadBrainFractProb) {
                new_colors.push(this.COLORS[idx] * leadBrainFract + otherColors[idx] * (1 - leadBrainFract));
                // new_colors.push(this.COLORS[idx]);
            } else {
                new_colors.push(otherColors[idx]);
            }
        }
    }

    private _brainCross(new_brain: number[][][], otherBrain: number[][][], leadBrainFractProb: number, leadBrainFract: number) {
        // console.log(`BRAIN length: ${this.BRAIN.length}`);
        for (const j in this.BRAIN) {
            const new_matrices: number[][] = [];
            const p0_matrices: number[][] = this.BRAIN[j];
            const p1_matrices: number[][] = otherBrain[j];
            
            // if (!this.BRAIN_MASK[j]) {
            //     console.warn(`BRAIN_MASK[${j}] is undefined`);
            //     continue;
            // }

            // if (Math.random() < 0.8) {
                for (const k in p0_matrices) {
                    const new_row: number[] = [];
                    const p0_row: number[] = p0_matrices[k];
                    const p1_row: number[] = p1_matrices[k];

                    // if (!this.BRAIN_MASK[j][k]) {
                    //     console.warn(`BRAIN_MASK[${j}][${k}] is undefined`);
                    //     continue;
                    // }
                    
                    // const pr = Math.random();
                    // if (pr < 0.5) {
                        for (const l in p0_row) {
                            // if (this.BRAIN_MASK[j][k][l] === undefined) {
                            //     console.warn(`BRAIN_MASK[${j}][${k}][${l}] is undefined`);
                            //     new_row.push(p1_row[l]); // Default to p1_row value
                            //     continue;
                            // }

                            if (Math.random() < leadBrainFractProb) {
                                // new_row.push(p0_row[l]);
                                new_row.push(p0_row[l] * leadBrainFract + p1_row[l] * (1 - leadBrainFract));
                            } else {
                                // const pr = Math.random();
                                // if (pr < 0.5) {
                                //     new_row.push(
                                        // p0_row[l] * leadBrainFract * this.BRAIN_MASK[j][k][l] + p1_row[l] * (1 - leadBrainFract * this.BRAIN_MASK[j][k][l])
                                        // p0_row[l] * leadBrainFract + p1_row[l] * (1 - leadBrainFract)
                                //     );
                                // } else {
                                    new_row.push(p1_row[l]);
                                // }
                            }

                            // new_row.push(
                            //     // p0_row[l] * leadBrainFract * this.BRAIN_MASK[j][k][l] + p1_row[l] * (1 - leadBrainFract * this.BRAIN_MASK[j][k][l])
                            //     p0_row[l] * leadBrainFract + p1_row[l] * (1 - leadBrainFract)
                            // );
                        }
                        new_matrices.push(new_row.slice());
                    // } else {
                    //     for (const l in p0_row) {
                    //         // if (this.BRAIN_MASK[j][k][l] === undefined) {
                    //         //     console.warn(`BRAIN_MASK[${j}][${k}][${l}] is undefined`);
                    //         //     new_row.push(p1_row[l]); // Default to p1_row value
                    //         //     continue;
                    //         // }
                    //         new_row.push(p1_row[l]);
                    //     }
                    //     new_matrices.push(new_row.slice());
                    // }
                }
            // } else {
            //     for (const k in p1_matrices) {
            //         const new_row: number[] = [];
            //         // const p0_row: number[] = p0_matrices[k];
            //         const p1_row: number[] = p1_matrices[k];
            //         for (const l in p1_row) {
            //             new_row.push(p1_row[l]);
            //         }
            //         new_matrices.push(new_row.slice());
            //     }
            // }
            new_brain.push(new_matrices.slice());
        }
    }

    gaussianRandom(mean = 0, stdDev = 1): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // избегаем 0
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
    }

    destroy() {
        this.COLORS.length = 0;
        this.BRAIN.length = 0;
        // this.BRAIN_MASK.length = 0;
    }
}

export const initRandomPopulation = (popSize: number, colorCount: number, matrixCount: number, neuronCount: number): boolean => {
    for (let i = 0; i < popSize; i++) {
        const genome = new Genome(colorCount, matrixCount, neuronCount);
        genome.init();
        POPULATION_GENOME.push(genome);
    }
    return true;
}

export const clearPopulation = (): boolean => {
    if (POPULATION_GENOME.length > 0) {
        console.log("Genomes clear");
        
        POPULATION_GENOME.forEach(genome => genome.destroy());
        POPULATION_GENOME.length = 0;
    }
    return true;
}

