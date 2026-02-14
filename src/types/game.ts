export type SelectedKitty = {
    id: number;
    progress: number;
};

export type GenomeType = {
    COLORS: number[];
    BRAIN: number[][][];
    // BRAIN_MASK: number[][][];
};

export interface KittyData {
    kitty_id: number;
    generation: number;
    progress: number;
    genome: GenomeType;
    population_size: number;
}