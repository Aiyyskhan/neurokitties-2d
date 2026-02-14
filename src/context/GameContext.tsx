import { createContext, FC, ReactNode, useState } from "react";
import type { SelectedKitty } from "@/types/game";

interface SelectedKittiesContextType {
    selectedKitties: SelectedKitty[];
    setSelectedKitties: React.Dispatch<React.SetStateAction<SelectedKitty[]>>;
}

interface ChampionKittiesContextType {
    championKitties: number[];
    setChampionKitties: React.Dispatch<React.SetStateAction<number[]>>;
}

// контекст выбранных котиков
export const SelectedKittiesContext = createContext<SelectedKittiesContextType | null>(null);

// контекст чемпионов
export const ChampionKittiesContext = createContext<ChampionKittiesContextType | null>(null);

export const GameContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedKitties, setSelectedKitties] = useState<SelectedKitty[]>([]);
    const [championKitties, setChampionKitties] = useState<number[]>([]);

    return (
        <ChampionKittiesContext value={{ championKitties, setChampionKitties }}>
        <SelectedKittiesContext value={{ selectedKitties, setSelectedKitties }}>
            {children}
        </SelectedKittiesContext>
        </ChampionKittiesContext>
    )
}