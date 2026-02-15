import { FC, useEffect, useMemo, useState } from "react";
import { SoundButton } from "@/components/SoundButton";
import type { KittyData } from "@/types/game";

import styles from "./KittyExport.module.scss";

interface KittyExportProps {
    ref: React.RefObject<KittyData | null>;
}

type FileSystemWindow = Window & {
    showSaveFilePicker?: (options?: {
        suggestedName?: string;
        types?: Array<{
            description: string;
            accept: Record<string, string[]>;
        }>;
    }) => Promise<{
        createWritable: () => Promise<{
            write: (data: string) => Promise<void>;
            close: () => Promise<void>;
        }>;
    }>;
};

const WINDOWS_PATH_REGEX = /^[a-zA-Z]:[\\/](?:[^<>:"|?*\n\r]+[\\/])*[^<>:"|?*\n\r]+\.json$/;
const UNIX_PATH_REGEX = /^\/(?:[^/\0]+\/)*[^/\0]+\.json$/;
const RELATIVE_PATH_REGEX = /^(?:\.{1,2}[\\/])?(?:[^<>:"|?*\n\r\\/]+[\\/])*[^<>:"|?*\n\r\\/]+\.json$/;

const isValidJsonPath = (value: string): boolean => {
    const path = value.trim();

    if (!path || !path.toLowerCase().endsWith(".json")) {
        return false;
    }

    return WINDOWS_PATH_REGEX.test(path) || UNIX_PATH_REGEX.test(path) || RELATIVE_PATH_REGEX.test(path);
};

const getFileNameFromPath = (path: string): string => {
    const normalized = path.trim();
    const parts = normalized.split(/[\\/]/).filter(Boolean);
    return parts[parts.length - 1] || "kitty-export.json";
};

const makeShortUniqueId = (): string => {
    return Math.random().toString(36).slice(2, 6);
};

const getDefaultExportFileName = (kittyData: KittyData): string => {
    const progress = kittyData.progress.toFixed(2).replace(".", "_");
    return `nk${kittyData.kitty_id}_g${kittyData.generation}_p${progress}_${makeShortUniqueId()}.json`;
};

const KittyExport: FC<KittyExportProps> = ({ ref }) => {
    const [savePath, setSavePath] = useState<string>("");
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusText, setStatusText] = useState<string>("");

    const kittyData = ref.current;
    const pathIsValid = useMemo(() => isValidJsonPath(savePath), [savePath]);

    useEffect(() => {
        if (kittyData && !savePath) {
            setSavePath(getDefaultExportFileName(kittyData));
        }
    }, [kittyData, savePath]);

    const exportJson = async () => {
        if (!kittyData || !pathIsValid || isExporting) {
            return;
        }

        setIsExporting(true);
        setStatus("idle");
        setStatusText("");

        const jsonContent = JSON.stringify(kittyData, null, 2);
        const fileName = getFileNameFromPath(savePath);

        try {
            const browserWindow = window as FileSystemWindow;

            if (browserWindow.showSaveFilePicker) {
                const fileHandle = await browserWindow.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [
                        {
                            description: "JSON",
                            accept: {
                                "application/json": [".json"],
                            },
                        },
                    ],
                });

                const writable = await fileHandle.createWritable();
                await writable.write(jsonContent);
                await writable.close();
            } else {
                const blob = new Blob([jsonContent], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

            setStatus("success");
            setStatusText("JSON file has been exported successfully.");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const userCanceled = message.toLowerCase().includes("abort");

            setStatus("error");
            setStatusText(userCanceled ? "Save operation was canceled." : `Failed to export JSON: ${message}`);
        } finally {
            setIsExporting(false);
        }
    };

    if (!kittyData) {
        return <div className={styles["export-panel"]}>No kitty data available for export.</div>;
    }

    return (
        <div className={styles["export-panel"]}>
            <div className={styles["export-title"]}>Export kitty data</div>

            <div className={styles["export-meta"]}>
                <div>- kitty_id: {kittyData.kitty_id}</div>
                <div>- generation: {kittyData.generation}</div>
                <div>- progress: {kittyData.progress}</div>
                <div>- population_size: {kittyData.population_size}</div>
                <div>- genome</div>
            </div>

            <div className={styles["export-path"]}>
                <label htmlFor="kitty-json-path">Save path (.json):</label>
                <input
                    id="kitty-json-path"
                    value={savePath}
                    onChange={(event) => setSavePath(event.target.value)}
                    onKeyDownCapture={(event) => event.stopPropagation()}
                    className={styles["export-path-input"]}
                    inputMode="text"
                    placeholder="./nk_k0_g1_p0_00_ab12.json"
                />
            </div>

            <div className={styles["export-hint"]}>
                {pathIsValid ? "Path is valid." : "Enter a valid file path ending with .json"}
            </div>

            <div className={styles["export-button"]}>
                <SoundButton className={styles["save"]} onClick={exportJson} disabled={!pathIsValid || isExporting}>
                    {isExporting ? "EXPORTING..." : "EXPORT JSON"}
                </SoundButton>
            </div>

            {statusText && (
                <div className={`${styles["export-status"]} ${styles[`export-status--${status}`]}`}>
                    {statusText}
                </div>
            )}
        </div>
    );
};

export default KittyExport;
