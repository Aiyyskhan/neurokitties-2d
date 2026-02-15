import { createContext, FC, ReactNode, useContext, useState, useEffect, useMemo } from "react";
import { SolanaCluster } from "@/solana/types";
import { SOLANA } from "@/config";

type SolanaNetworkContextType = {
    network: SolanaCluster;
    setNetwork: (n: SolanaCluster) => void;
    endpoint: string;
    setEndpoint: (e: string) => void;
};

const SolanaNetworkContext = createContext<SolanaNetworkContextType | null>(null);

export const SolanaNetworkProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [network, setNetwork] = useState<SolanaCluster>('devnet');
    const defaultEndpointFor = (net: SolanaCluster) => (net === 'mainnet' ? SOLANA.MAINNET : SOLANA.DEVNET);

    const [endpoint, setEndpoint] = useState<string>(() => defaultEndpointFor(network));

    // Keep endpoint in sync with network changes (but allow manual override via setEndpoint)
    // When network changes, reset endpoint to the default for that network.
    // Consumers can still call setEndpoint to override the RPC.
    useEffect(() => {
        setEndpoint(defaultEndpointFor(network));
    }, [network]);

    const value = useMemo(
        () => ({ network, setNetwork, endpoint, setEndpoint }),
        [network, endpoint]
    );

    return (
        <SolanaNetworkContext.Provider value={value}> {/*{ network, setNetwork, endpoint, setEndpoint }}>*/}
            {children}
        </SolanaNetworkContext.Provider>
    );
};

export const useSolanaNetwork = () => {
    const ctx = useContext(SolanaNetworkContext);
    if (!ctx) {
        throw new Error("useSolanaNetwork must be used inside SolanaNetworkProvider");
    }
    return ctx;
};
