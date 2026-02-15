import { useMemo, useState } from "react";
import { KittyAvatar } from "@/components/KittyAvatar";
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
};

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

const KittyImport: React.FC = () => {
    const [folderPath, setFolderPath] = useState<string>("");
    const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandleLike | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadDone, setLoadDone] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [kitties, setKitties] = useState<ImportedKitty[]>([]);

    const canLoad = useMemo(() => !!folderHandle && folderPath.trim().length > 0, [folderHandle, folderPath]);

    const chooseFolder = async () => {
        try {
            const browserWindow = window as FileSystemWindow;

            if (!browserWindow.showDirectoryPicker) {
                setStatus("Folder picker is not supported in this browser.");
                return;
            }

            const handle = await browserWindow.showDirectoryPicker();
            setFolderHandle(handle);
            setFolderPath(handle.name);
            setStatus("");
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
            for await (const [name, handle] of folderHandle.entries()) {
                if (handle.kind !== "file" || !name.toLowerCase().endsWith(".json")) {
                    continue;
                }

                const fileHandle = handle as FileSystemFileHandleLike;
                const file = await fileHandle.getFile();
                const text = await file.text();

                try {
                    const parsed = JSON.parse(text) as unknown;

                    if (isKittyData(parsed)) {
                        validKitties.push({ ...parsed, sourceFile: name });
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
                setStatus(`Loaded ${validKitties.length} kitty files. Skipped ${invalidFiles} invalid JSON file(s).`);
            } else {
                setStatus(`Loaded ${validKitties.length} kitty file(s).`);
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
                                <KittyAvatar colorArray={[...kitty.genome.COLORS]} />
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
                    <label htmlFor="kitty-folder-path">Folder path:</label>
                    <input
                        id="kitty-folder-path"
                        value={folderPath}
                        readOnly
                        onKeyDownCapture={(event) => event.stopPropagation()}
                        className={styles["folder-path-input"]}
                        placeholder="Select folder with kitty JSON files"
                    />
                </div>
                <SoundButton onClick={chooseFolder}>CHOOSE FOLDER</SoundButton>
                {canLoad && <SoundButton onClick={loadJsonKitties}>LOAD JSONs</SoundButton>}
                {status && <div className={styles["kitty-import-status"]}>{status}</div>}
            </div>
        </div>
    );
};

export default KittyImport;
