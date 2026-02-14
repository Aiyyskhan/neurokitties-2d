import { useEffect, useState } from "react";
import { Select, SelectOption } from "@/components/Select";
import { SolanaCluster } from "@/solana/types";
import { SOLANA } from "@/config";

import styles from "./NetworkSelect.module.scss";

const OPTIONS: SelectOption<SolanaCluster>[] = [
  { value: "devnet", label: "Devnet" },
  { value: "mainnet", label: "Mainnet" },
];

type Props = {
  network: SolanaCluster;
  onChangeNetwork: (next: SolanaCluster) => void;
  endpoint: string;
  onChangeEndpoint: (e: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function NetworkSelect({
  network,
  onChangeNetwork,
  endpoint,
  onChangeEndpoint,
  disabled = false,
  className,
  label = "Network:",
}: Props) {
  const [localEndpoint, setLocalEndpoint] = useState<string>(endpoint);

  useEffect(() => {
    setLocalEndpoint(endpoint);
  }, [endpoint]);

  const commitEndpoint = (next: string) => {
    // avoid sending an empty endpoint (ConnectionProvider expects a valid URL)
    if (!next) return;
    onChangeEndpoint(next);
  };

  const defaultEndpoint = network === "mainnet" ? SOLANA.MAINNET : SOLANA.DEVNET;

  return (
    <div className={[styles.select, className].filter(Boolean).join(" ")}>
      {/* {label && (
        <div className={styles.select__label}>
          {label}
        </div>
      )} */}
      
      <Select<SolanaCluster>
        label={label}
        value={network}
        options={OPTIONS}
        onChange={onChangeNetwork}
        className={styles["inner-select"]}
        disabled={disabled}
      />

      <div
        className={styles.select__hint}
        data-risk={network === "mainnet" ? "high" : "low"}
        aria-live="polite"
      >
        {network === "mainnet" 
          ? "Mainnet uses real SOL!" 
          : "Devnet uses test SOL"}
      </div>

      <div className={styles["network-endpoint"]}>
          <label>RPC Endpoint:</label>
            <input
              value={localEndpoint}
              onChange={(e) => setLocalEndpoint(e.target.value)}
              onBlur={() => {
                if (!localEndpoint || !localEndpoint.trim()) {
                  // restore and apply the current default for the selected network
                  setLocalEndpoint(defaultEndpoint);
                  commitEndpoint(defaultEndpoint);
                } else {
                  commitEndpoint(localEndpoint);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!localEndpoint || !localEndpoint.trim()) {
                    setLocalEndpoint(defaultEndpoint);
                    commitEndpoint(defaultEndpoint);
                  } else {
                    commitEndpoint(localEndpoint);
                  }
                }
              }}
              className={styles["network-endpoint-input"]}
              inputMode="url"
            />
      </div>
    </div>
  );
}
