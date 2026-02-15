import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/Spinner";
import { SoundButton } from "@/components/SoundButton";
import { Genome, POPULATION_GENOME } from "@/neuroevolution/genomes";
import type { GenomeType, KittyData } from "@/types/game";
import * as config from "@/config";

import styles from "./KittyImport.module.scss";

type FileSystemHandleLike = {
    kind: "file" | "directory";
    name: string;
};

type FileSystemFileHandleLike = FileSystemHandleLike & {
    kind: "file";
    getFile: () => Promise<File>;
};

type FileSystemDirectoryHandleLike = FileSystemHandleLike & {
    kind: "directory";
    entries: () => AsyncIterableIterator<[string, FileSystemHandleLike]>;
};

type FileSystemWindow = Window & {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandleLike>;
};

type ImportedKitty = KittyData & {
    sourceFile: string;
    preview_image?: string;
    previewImageUrl: string | null;
};

type PartialImportedKitty = Partial<KittyData> & { preview_image?: unknown };

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const isNumberArray = (value: unknown): value is number[] => {
    return Array.isArray(value) && value.every((item) => isNumber(item));
};

const isBrainMatrix = (value: unknown): value is number[][][] => {
    return Array.isArray(value)
        && value.every((matrix) => Array.isArray(matrix)
            && matrix.every((row) => Array.isArray(row)
                && row.every((item) => isNumber(item))));
};

const isGenome = (value: unknown): value is GenomeType => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const genome = value as Partial<GenomeType>;
    return isNumberArray(genome.COLORS) && isBrainMatrix(genome.BRAIN);
};

const isKittyData = (value: unknown): value is KittyData => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const kitty = value as Partial<KittyData>;

    return isNumber(kitty.kitty_id)
        && isNumber(kitty.generation)
        && isNumber(kitty.progress)
        && isGenome(kitty.genome)
        && isNumber(kitty.population_size);
};

const deepCloneArray = <T,>(arr: T[]): T[] => {
    return arr.map((item) => (Array.isArray(item) ? (deepCloneArray(item as unknown as T[]) as unknown as T) : item));
};

const getBaseName = (name: string): string => {
    const dotIndex = name.lastIndexOf(".");
    return dotIndex > 0 ? name.slice(0, dotIndex) : name;
};

const KittyImport: React.FC = () => {
    const [folderPath, setFolderPath] = useState<string>("");
    const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandleLike | null>(null);
    const [isFolderEmpty, setIsFolderEmpty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadDone, setLoadDone] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [kitties, setKitties] = useState<ImportedKitty[]>([]);

    useEffect(() => {
        return () => {
            kitties.forEach((kitty) => {
                if (kitty.previewImageUrl) {
                    URL.revokeObjectURL(kitty.previewImageUrl);
                }
            });
        };
    }, [kitties]);

    const canLoad = useMemo(() => {
        return !!folderHandle && folderPath.trim().length > 0 && !isFolderEmpty;
    }, [folderHandle, folderPath, isFolderEmpty]);

    const chooseFolder = async () => {
        try {
            const browserWindow = window as FileSystemWindow;

            if (!browserWindow.showDirectoryPicker) {
                setStatus("Folder picker is not supported in this browser. Use a Chromium-based browser.");
                return;
            }

            const handle = await browserWindow.showDirectoryPicker();
            let hasAnyEntries = false;
            for await (const _entry of handle.entries()) {
                hasAnyEntries = true;
                break;
            }

            setFolderHandle(handle);
            setFolderPath(handle.name);
            setIsFolderEmpty(!hasAnyEntries);
            setStatus(hasAnyEntries ? "" : "Selected folder is empty. Choose a folder with kitty JSON + PNG files.");
            setLoadDone(false);
            setKitties([]);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.toLowerCase().includes("abort")) {
                setStatus("Folder selection was canceled.");
            } else {
                setStatus(`Failed to select folder: ${message}`);
            }
        }
    };

    const loadJsonKitties = async () => {
        if (!folderHandle || isLoading) {
            return;
        }

        setIsLoading(true);
        setLoadDone(false);
        setStatus("");

        const validKitties: ImportedKitty[] = [];
        let invalidFiles = 0;

        try {
            const fileHandles = new Map<string, FileSystemFileHandleLike>();

            for await (const [name, handle] of folderHandle.entries()) {
                if (handle.kind !== "file") {
                    continue;
                }

                const fileHandle = handle as FileSystemFileHandleLike;
                fileHandles.set(name, fileHandle);
            }

            for (const [name, fileHandle] of fileHandles) {
                if (!name.toLowerCase().endsWith(".json")) {
                    continue;
                }

                const file = await fileHandle.getFile();
                const text = await file.text();

                try {
                    const parsed = JSON.parse(text) as unknown;
                    const parsedWithPreview = parsed as PartialImportedKitty;
                    const previewFromJson = parsedWithPreview.preview_image;

                    if (isKittyData(parsedWithPreview)) {
                        const kittyData = parsedWithPreview;
                        let previewImageFile = "";
                        if (typeof previewFromJson === "string") {
                            previewImageFile = previewFromJson;
                        } else {
                            previewImageFile = `${getBaseName(name)}.png`;
                        }

                        let previewImageUrl: string | null = null;
                        const previewHandle = fileHandles.get(previewImageFile);
                        if (previewHandle) {
                            const previewFile = await previewHandle.getFile();
                            previewImageUrl = URL.createObjectURL(previewFile);
                        }

                        validKitties.push({
                            ...kittyData,
                            sourceFile: name,
                            preview_image: previewImageFile,
                            previewImageUrl,
                        });
                    } else {
                        invalidFiles += 1;
                    }
                } catch {
                    invalidFiles += 1;
                }
            }

            setKitties(validKitties);
            setLoadDone(true);

            if (validKitties.length === 0) {
                setStatus("No valid kitty JSON files found in selected folder.");
            } else if (invalidFiles > 0) {
                setStatus(`Loaded ${validKitties.length} kitty JSON file(s). Skipped ${invalidFiles} invalid JSON file(s).`);
            } else {
                setStatus(`Loaded ${validKitties.length} kitty JSON file(s).`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setStatus(`Failed to read folder: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const selectKitty = (idx: number) => {
        const kitty = kitties[idx];
        const genome = kitty.genome;

        const newGenome = new Genome(config.COLOR_COUNT, config.MATRICES_COUNT, config.NEURON_COUNT);
        newGenome.BRAIN = deepCloneArray(genome.BRAIN);
        newGenome.COLORS = deepCloneArray(genome.COLORS);
        POPULATION_GENOME.push(newGenome);
    };

    if (isLoading) {
        return (
            <div className={styles["kitty-import"]}>
                <h2 className={styles["kitty-import-title"]}>loading kitty JSON files...</h2>
                <Spinner />
            </div>
        );
    }

    if (loadDone) {
        return (
            <div className={styles["kitty-import"]}>
                {/* {status && <div className={styles["kitty-import-status"]}>{status}</div>} */}
                <div className={styles["kitty-gallery-grid"]}>
                    {kitties.map((kitty, index) => (
                        <div key={`${kitty.sourceFile}-${index}`} className={styles["kitty-card"]}>
                            <div className={styles["kitty-card-left"]}>
                                {kitty.previewImageUrl ? (
                                    <img src={kitty.previewImageUrl} alt={`Kitty #${kitty.kitty_id}`} className={styles["kitty-preview-image"]} />
                                ) : (
                                    <div className={styles["kitty-preview-missing"]}>PNG preview not found</div>
                                )}
                                <div className={styles["kitty-selection-btn"]}>
                                    <SoundButton onClick={() => selectKitty(index)}>SELECT</SoundButton>
                                </div>
                            </div>
                            <div className={styles["kitty-card-right"]}>
                                <h3 className={styles["kitty-name"]}>Kitty #{kitty.kitty_id}</h3>
                                <p className={styles["kitty-description"]}>
                                    File: {kitty.sourceFile}{"\n"}
                                    Generation: {kitty.generation}{"\n"}
                                    Progress: {kitty.progress}{"\n"}
                                    Population: {kitty.population_size}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles["kitty-import"]}>
            <div className={styles["kitty-import-start"]}>
                <div className={styles["folder-path"]}>
                    <label htmlFor="kitty-folder-path">Folder with kitty JSON + PNG files:</label>
                    <input
                        id="kitty-folder-path"
                        value={folderPath}
                        readOnly
                        onKeyDownCapture={(event) => event.stopPropagation()}
                        className={styles["folder-path-input"]}
                        placeholder="Select folder with exported JSON and PNG files"
                    />
                </div>
                <SoundButton onClick={chooseFolder}>CHOOSE FOLDER</SoundButton>
                {canLoad && <SoundButton onClick={loadJsonKitties}>LOAD</SoundButton>}
                {status && <div className={styles["kitty-import-status"]}>{status}</div>}
            </div>
        </div>
    );
};

export default KittyImport;
