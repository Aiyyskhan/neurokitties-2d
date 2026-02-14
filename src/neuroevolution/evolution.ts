import { Genome } from "./genomes";


export const crossover = (
    pop_genome: Genome[], selected_indices: Set<number> | number[], popSize: number, 
    brainMutProb: number, brainMutLevel: number, leadBrainFractProb: number, leadBrainFract: number, 
    cloning: boolean
) => {
    const selected_indicesArray: number[] = [...selected_indices];
    const elite_size = selected_indicesArray.length;

    if (elite_size < 1) {
        console.log("нужно выбрать хотя бы одного котика!");
    }

    const new_pop_genome: Genome[] = [];
    for (let i = 0; i < popSize; i++) {
        const elite_idx = i % elite_size;
        const elite_id = selected_indicesArray[elite_idx];
        const elite_genome = pop_genome[elite_id];
        
        if (i < elite_size || cloning) {
            new_pop_genome.push(elite_genome);
            continue;
        }

        let p1_genome!: Genome;
        if (elite_size === 1) {
            const p1_candidates = pop_genome.filter((_g, cand_id) => cand_id !== elite_id);
            const p1_candidates_size = p1_candidates.length;
            const p1_idx = (i - elite_size) % p1_candidates_size;
            p1_genome = p1_candidates[p1_idx];
        } else {
            // const pr = Math.random();
            // if (pr < 0.75) {
            //     const p1_candidates_indices = selected_indicesArray.filter(cand_id => cand_id !== elite_id);
            //     const p1_candidates_size = p1_candidates_indices.length;
            //     const p1_idx = (i - elite_size) % p1_candidates_size;
            //     const p1_id = p1_candidates_indices[p1_idx];
            //     p1_genome = pop_genome[p1_id];
            // } else {
            //     const p1_candidates = pop_genome.filter((_g, cand_id) => cand_id !== elite_id);
            //     const p1_candidates_size = p1_candidates.length;
            //     const p1_idx = (i - elite_size) % p1_candidates_size;
            //     p1_genome = p1_candidates[p1_idx];
            // }
            const p1_candidates_indices = selected_indicesArray.filter(cand_id => cand_id !== elite_id);
            const p1_candidates_size = p1_candidates_indices.length;
            const p1_idx = (i - elite_size) % p1_candidates_size;
            const p1_id = p1_candidates_indices[p1_idx];
            p1_genome = pop_genome[p1_id];
        }

        const new_genome = new Genome(elite_genome.colorCount, elite_genome.matrixCount, elite_genome.neuronCount);

        elite_genome.crossover(new_genome, p1_genome, leadBrainFractProb, leadBrainFract);

        if (i >= elite_size) {
            // console.log(`mutating genome ${i}`);            
            new_genome.mutate(brainMutProb, brainMutLevel);
        }

        new_pop_genome.push(new_genome);
    }

    return new_pop_genome;
}

// export const crossover = (
//     pop_genome: Genome[], selected_indices: Set<number> | number[], popSize: number, 
//     brainMutProb: number, brainMutLevel: number, leadBrainFractProb: number, leadBrainFract: number, 
//     cloning: boolean
// ) => {
//     const selected_indicesArray: number[] = [...selected_indices];
//     if (selected_indicesArray.length < 1) {
//         console.log("нужно выбрать хотя бы одного котика!");
//     }
//     const new_pop_genome: Genome[] = [];

//     let idx_0 = 0;
//     let idx_1 = 0;
//     for (let i = 0; i < popSize; i++) {
//         const p0_id = selected_indicesArray[idx_0]
//         let p0_genome = pop_genome[p0_id];

//         let p1_genome!: Genome;
//         if (i === 0 || cloning) {
//             p1_genome = pop_genome[p0_id];
//         } else {
//             if (selected_indicesArray.length > 1) {
//                 const p1_candidates_indices = selected_indicesArray.filter(cand_id => cand_id !== p0_id);
//                 // const p1_id = p1_candidates_indices[Math.floor(Math.random() * p1_candidates_indices.length)];
//                 const p1_id = p1_candidates_indices[idx_1];
//                 p1_genome = pop_genome[p1_id];

//                 idx_1++;
//                 if (idx_1 === p1_candidates_indices.length) idx_1 = 0;
//             } else {
//                 const p1_candidates = pop_genome.filter((_g, cand_id) => cand_id !== p0_id);
//                 // p1_genome = p1_candidates[Math.floor(Math.random() * p1_candidates.length)];
//                 p1_genome = p1_candidates[idx_1];

//                 idx_1++;
//                 if (idx_1 === p1_candidates.length) idx_1 = 0;
//             }
//         }

//         const new_genome = new Genome(p0_genome.colorCount, p0_genome.matrixCount, p0_genome.neuronCount);

//         p0_genome.crossover(new_genome, p1_genome, leadBrainFractProb, leadBrainFract);

//         if (i !== 0) {
//             // console.log(`mutating genome ${i}`);            
//             new_genome.mutate(brainMutProb, brainMutLevel);
//         }

//         new_pop_genome.push(new_genome);

//         idx_0++;
//         if (idx_0 === selected_indicesArray.length) idx_0 = 0;
//     }

//     return new_pop_genome;
// }