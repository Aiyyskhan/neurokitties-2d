import { FC, ReactNode, useEffect, useMemo } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { useSolanaNetwork } from './SolanaNetworkContext';
// import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';
// import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { 
    // PhantomWalletAdapter,
    SolflareWalletAdapter, 
    TorusWalletAdapter,
    SalmonWalletAdapter,
    LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';


import '@solana/wallet-adapter-react-ui/styles.css';

// import * as config from '../config';

// const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    // const network = config.SOLANA.NET === "mainnet" ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
    const { network, endpoint } = useSolanaNetwork();
    // const walletNetwork = network === "mainnet" ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

    // Use the RPC endpoint from SolanaNetworkContext (can be overridden by UI)
    console.log(`Solana endpoint: ${endpoint}`);
    

    const wallets = useMemo(() => {
        const list = [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/anza-xyz/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            // new UnsafeBurnerWalletAdapter(),
            // new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new SalmonWalletAdapter(),
            new LedgerWalletAdapter(),
        ];

        const seen = new Set<string>();
        return list.filter(w => {
            if (seen.has(w.name)) return false;
            seen.add(w.name);
            return true;
        });
    }, [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;