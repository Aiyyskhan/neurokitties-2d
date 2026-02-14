import React, { use, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import AuthContext from '@/context/AuthContext';
import { SoundButton } from '@/components/SoundButton';
import { Modal } from '@/components/Modal';
import { ManualPanel } from '@/components/ManualPanel';

import styles from "./Login.module.scss"

const Login: React.FC = () => {
    const [manualShow, setManualShow] = useState<boolean>(false);
    const authContext = use(AuthContext);
    const setIsLoggedIn = authContext?.setIsLoggedIn;

    return (
        <div className={styles['login-panel']}>
            <h1>NeuroKitties welcome you!</h1>
            <div className={styles["login-panel__btns"]}> 
                <div className={styles["login-panel__btn"]}>
                    <SoundButton>
                        <WalletMultiButton />
                    </SoundButton>
                </div>
                <div className={styles["login-panel__btn"]}>
                    <SoundButton onClick={() => { setIsLoggedIn?.(true); }}>
                        Without Wallet
                    </SoundButton>
                </div>
                <div className={styles["login-panel__btn"]}>
                    <SoundButton onClick={() => setManualShow(true)}>
                        Manual
                    </SoundButton>
                </div>
                {manualShow && (
                    <Modal onExit={() => setManualShow(false)}>
                        <ManualPanel />
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Login;