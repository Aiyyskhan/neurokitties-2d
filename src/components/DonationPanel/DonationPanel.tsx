import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sendDonation } from "@/solana/nftManager";
import { useSolanaNetwork } from "@/context/SolanaNetworkContext";
import { SoundButton } from "@/components/SoundButton";
import * as config from '@/config';

import styles from './DonationPanel.module.scss';

const DonationPanel: React.FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const { network } = useSolanaNetwork(); // 'devnet' | 'mainnet'
    const [amount, setAmount] = useState(config.DONATION.SOLANA_AMOUNT.toString());

    const donationSolana = async () => {
        if (wallet && wallet.connected) {
            console.log("Donating...");
            await sendDonation(
                wallet, 
                connection.rpcEndpoint, 
                network, 
                config.DONATION.SOLANA_WALLET, 
                parseFloat(amount)
            );
        }
    }

    const donationBoosty = async () => {
        console.log("Donating...");
        window.open(config.DONATION.BOOSTY_URL, "_blank");
    }

    return (
        <div className={styles["donationPanel"]}>
            <h2 className={styles["donationPanel__title"]}>Like the project?</h2>
            <p className={styles["donationPanel__description"]}>You can support it with a donation.</p>
            { 
                wallet.connected ? (
                    <>
                        <p className={styles["donationPanel__description"]}>Solana wallet address:</p>
                        <p className={styles["donationPanel__address"]}>{config.DONATION.SOLANA_WALLET}</p>
                        <input
                            className={styles["donationPanel__input"]}
                            type="number"
                            placeholder="SOL"
                            min={0.01}
                            step={0.01}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <SoundButton className={styles["donationPanel__button"]} onClick={donationSolana}>
                            DONATE
                        </SoundButton>
                    </>
                ) : (
                    <>
                        <SoundButton className={styles["donationPanel__button"]} onClick={donationBoosty}>
                            BOOSTY
                        </SoundButton>
                    </>
                )
            }
            <p className={styles["donationPanel__description"]}>Thank you for your support!</p>
            <p className={styles["donationPanel__description"]}>Even a small contribution makes a big difference!</p>
        </div>
    );
}

export default DonationPanel;