import { FC, useEffect, useMemo, useRef, useState } from "react";
import { KittyAvatar, RefKittyAvatar } from "@/components/KittyAvatar";
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
            write: (data: string | Blob) => Promise<void>;
            close: () => Promise<void>;
        }>;
    }>;
};

interface ExportedKittyData extends KittyData {
    preview_image: string;
}

const isValidBaseName = (value: string): boolean => {
    return value.trim().length > 0;
};

const makeShortUniqueId = (): string => {
    return Math.random().toString(36).slice(2, 6);
};

const getDefaultExportBaseName = (kittyData: KittyData): string => {
    const normalizedProgress = Number(kittyData.progress.toFixed(2)).toString();
    const progress = normalizedProgress.replace(".", "_");
    return `nk${kittyData.kitty_id}_g${kittyData.generation}_p${progress}_${makeShortUniqueId()}`;
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    return await response.blob();
};

const isUserCanceled = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message : String(error);
    return message.toLowerCase().includes("abort");
};

const shouldUseDownloadFallback = (error: unknown): boolean => {
    if (isUserCanceled(error)) {
        return false;
    }

    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    const domName = error instanceof DOMException ? error.name : "";

    return domName === "SecurityError"
        || domName === "NotAllowedError"
        || message.includes("cross origin")
        || message.includes("showsavefilepicker");
};

const downloadBlob = (filename: string, blob: Blob): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const KittyExport: FC<KittyExportProps> = ({ ref }) => {
    const kittyAvatarSnapshot = useRef<RefKittyAvatar | null>(null);
    const [savePath, setSavePath] = useState<string>("");
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusText, setStatusText] = useState<string>("");

    const kittyData = ref.current;
    const pathIsValid = useMemo(() => isValidBaseName(savePath), [savePath]);

    useEffect(() => {
        if (kittyData && !savePath) {
            setSavePath(getDefaultExportBaseName(kittyData));
        }
    }, [kittyData, savePath]);

    const exportJson = async () => {
        if (!kittyData || !pathIsValid || isExporting) {
            return;
        }

        setIsExporting(true);
        setStatus("idle");
        setStatusText("");

        const snapshotBase64 = kittyAvatarSnapshot.current?.snapshotBase64;
        if (!snapshotBase64) {
            setStatus("error");
            setStatusText("Kitty PNG preview is not ready yet. Try again in a second.");
            setIsExporting(false);
            return;
        }

        const baseName = savePath.trim();
        const jsonFileName = `${baseName}.json`;
        const pngFileName = `${baseName}.png`;
        const exportPayload: ExportedKittyData = {
            ...kittyData,
            preview_image: pngFileName,
        };
        const jsonContent = JSON.stringify(exportPayload, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: "application/json" });
        const pngBlob = await dataUrlToBlob(snapshotBase64);

        try {
            const browserWindow = window as FileSystemWindow;

            if (browserWindow.showSaveFilePicker) {
                try {
                    const jsonHandle = await browserWindow.showSaveFilePicker({
                        suggestedName: jsonFileName,
                        types: [
                            {
                                description: "JSON",
                                accept: {
                                    "application/json": [".json"],
                                },
                            },
                        ],
                    });

                    const jsonWritable = await jsonHandle.createWritable();
                    await jsonWritable.write(jsonContent);
                    await jsonWritable.close();

                    const pngHandle = await browserWindow.showSaveFilePicker({
                        suggestedName: pngFileName,
                        types: [
                            {
                                description: "PNG",
                                accept: {
                                    "image/png": [".png"],
                                },
                            },
                        ],
                    });

                    const pngWritable = await pngHandle.createWritable();
                    await pngWritable.write(pngBlob);
                    await pngWritable.close();
                } catch (pickerError) {
                    if (!shouldUseDownloadFallback(pickerError)) {
                        throw pickerError;
                    }

                    downloadBlob(jsonFileName, jsonBlob);
                    downloadBlob(pngFileName, pngBlob);
                }
            } else {
                downloadBlob(jsonFileName, jsonBlob);
                downloadBlob(pngFileName, pngBlob);
            }

            setStatus("success");
            setStatusText("JSON and PNG files are ready.");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const userCanceled = isUserCanceled(error);

            setStatus("error");
            setStatusText(userCanceled ? "Download was canceled." : `Failed to export JSON + PNG files: ${message}`);
        } finally {
            setIsExporting(false);
        }
    };

    if (!kittyData) {
        return <div className={styles["export-panel"]}>No kitty data available for export.</div>;
    }

    return (
        <div className={styles["export-panel"]}>
            <div className={styles["export-title"]}>Export kitty</div>

            <div className={styles["export-data"]}>
                <div className={styles["export-preview"]}>
                    <KittyAvatar ref={kittyAvatarSnapshot} colorArray={kittyData.genome.COLORS} />
                </div>
                <div className={styles["export-meta"]}>
                    <div>- kitty_id: {kittyData.kitty_id}</div>
                    <div>- generation: {kittyData.generation}</div>
                    <div>- progress: {kittyData.progress}</div>
                    <div>- population_size: {kittyData.population_size}</div>
                    <div>- genome</div>
                </div>
            </div>

            <div className={styles["export-path"]}>
                <label htmlFor="kitty-json-path">File name prefix:</label>
                <input
                    id="kitty-json-path"
                    value={savePath}
                    readOnly
                    onChange={(event) => setSavePath(event.target.value)}
                    onKeyDownCapture={(event) => event.stopPropagation()}
                    className={styles["export-path-input"]}
                    inputMode="text"
                    placeholder="nk0_g1_p0_ab12"
                />
            </div>

            <div className={styles["export-hint"]}>
                Exports two files: .json and .png
            </div>

            <div className={styles["export-button"]}>
                <SoundButton className={styles["save"]} onClick={exportJson} disabled={!pathIsValid || isExporting}>
                    {isExporting ? "EXPORTING..." : "DOWNLOAD"}
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
