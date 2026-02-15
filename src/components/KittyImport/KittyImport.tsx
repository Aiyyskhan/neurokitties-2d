import { useEffect, useMemo, useRef, useState } from "react";
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

type FileWithRelativePath = File & {
    webkitRelativePath?: string;
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

const isUserCanceled = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message : String(error);
    return message.toLowerCase().includes("abort");
};

const isPickerBlockedByFramePolicy = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    const domName = error instanceof DOMException ? error.name : "";
    return domName === "SecurityError" || message.includes("cross origin");
};

const isEmbeddedFrame = (): boolean => {
    try {
        return window.self !== window.top;
    } catch {
        return true;
    }
};

const KittyImport: React.FC = () => {
    const [folderPath, setFolderPath] = useState<string>("");
    const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandleLike | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isFolderEmpty, setIsFolderEmpty] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadDone, setLoadDone] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [kitties, setKitties] = useState<ImportedKitty[]>([]);
    const [selectedKittyKeys, setSelectedKittyKeys] = useState<Set<string>>(new Set());
    const filesInputRef = useRef<HTMLInputElement | null>(null);
    const selectedGenomesByKittyKey = useRef<Map<string, Genome>>(new Map());
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
        if (folderHandle) {
            return folderPath.trim().length > 0 && !isFolderEmpty;
        }

        return selectedFiles.length > 0;
    }, [folderHandle, folderPath, isFolderEmpty, selectedFiles]);

    const clearSelectionsForCurrentList = () => {
        selectedGenomesByKittyKey.current.forEach((genome) => {
            const genomeIndex = POPULATION_GENOME.indexOf(genome);
            if (genomeIndex >= 0) {
                POPULATION_GENOME.splice(genomeIndex, 1);
            }
        });
        selectedGenomesByKittyKey.current.clear();
        setSelectedKittyKeys(new Set());
    };

    const buildKittiesFromFileMap = async (fileMap: Map<string, File>): Promise<{ kitties: ImportedKitty[]; invalidFiles: number }> => {
        const validKitties: ImportedKitty[] = [];
        let invalidFiles = 0;

        for (const [name, file] of fileMap) {
            if (!name.toLowerCase().endsWith(".json")) {
                continue;
            }

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
                    const previewFile = fileMap.get(previewImageFile);
                    if (previewFile) {
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

        return { kitties: validKitties, invalidFiles };
    };

    const chooseFilesFallback = () => {
        if (!filesInputRef.current) {
            return;
        }

        filesInputRef.current.value = "";
        filesInputRef.current.click();
    };

    const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const files = Array.from(event.target.files ?? []);
        clearSelectionsForCurrentList();
        setFolderHandle(null);
        setLoadDone(false);
        setKitties([]);

        if (files.length === 0) {
            setSelectedFiles([]);
            setFolderPath("");
            setIsFolderEmpty(true);
            setStatus("File selection was canceled.");
            return;
        }

        const displayFolderName = (() => {
            const first = files[0] as FileWithRelativePath;
            const relative = first.webkitRelativePath;
            if (!relative || !relative.includes("/")) {
                return `${files.length} file(s) selected`;
            }

            return relative.split("/")[0] || `${files.length} file(s) selected`;
        })();

        setSelectedFiles(files);
        setFolderPath(displayFolderName);
        setIsFolderEmpty(false);
        setStatus("");
    };

    const chooseFolder = async () => {
        try {
            const browserWindow = window as FileSystemWindow;

            if (!browserWindow.showDirectoryPicker) {
                chooseFilesFallback();
                return;
            }

            const handle = await browserWindow.showDirectoryPicker();
            let hasAnyEntries = false;
            for await (const _entry of handle.entries()) {
                hasAnyEntries = true;
                break;
            }

            setFolderHandle(handle);
            setSelectedFiles([]);
            setFolderPath(handle.name);
            setIsFolderEmpty(!hasAnyEntries);
            setStatus(hasAnyEntries ? "" : "Selected source is empty. Choose JSON + PNG files.");
            clearSelectionsForCurrentList();
            setLoadDone(false);
            setKitties([]);
        } catch (error) {
            if (isUserCanceled(error)) {
                setStatus("Selection was canceled.");
            } else if (isPickerBlockedByFramePolicy(error)) {
                setStatus("Folder picker is blocked in embedded mode. Choose files manually.");
                chooseFilesFallback();
            } else {
                const message = error instanceof Error ? error.message : String(error);
                setStatus(`Failed to choose files: ${message}`);
            }
        }
    };

    const loadJsonKitties = async () => {
        if (isLoading || (!folderHandle && selectedFiles.length === 0)) {
            return;
        }

        setIsLoading(true);
        setLoadDone(false);
        setStatus("");

        try {
            const fileMap = new Map<string, File>();

            if (folderHandle) {
                for await (const [name, handle] of folderHandle.entries()) {
                    if (handle.kind !== "file") {
                        continue;
                    }

                    const fileHandle = handle as FileSystemFileHandleLike;
                    const file = await fileHandle.getFile();
                    fileMap.set(name, file);
                }
            } else {
                for (const file of selectedFiles) {
                    fileMap.set(file.name, file);
                }
            }

            const { kitties: validKitties, invalidFiles } = await buildKittiesFromFileMap(fileMap);
            setKitties(validKitties);
            setLoadDone(true);

            if (validKitties.length === 0) {
                setStatus("No valid kitty JSON files found in selected files.");
            } else if (invalidFiles > 0) {
                setStatus(`Loaded ${validKitties.length} kitty JSON file(s). Skipped ${invalidFiles} invalid JSON file(s).`);
            } else {
                setStatus(`Loaded ${validKitties.length} kitty JSON file(s).`);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setStatus(`Failed to read selected files: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleKittySelection = (idx: number) => {
        const kitty = kitties[idx];
        const kittyKey = `${kitty.sourceFile}-${idx}`;
        const selectedGenome = selectedGenomesByKittyKey.current.get(kittyKey);

        if (selectedGenome) {
            const selectedGenomeIndex = POPULATION_GENOME.indexOf(selectedGenome);
            if (selectedGenomeIndex >= 0) {
                POPULATION_GENOME.splice(selectedGenomeIndex, 1);
            }
            selectedGenomesByKittyKey.current.delete(kittyKey);
            setSelectedKittyKeys((prev) => {
                const next = new Set(prev);
                next.delete(kittyKey);
                return next;
            });
            return;
        }

        const genome = kitty.genome;

        const newGenome = new Genome(config.COLOR_COUNT, config.MATRICES_COUNT, config.NEURON_COUNT);
        newGenome.BRAIN = deepCloneArray(genome.BRAIN);
        newGenome.COLORS = deepCloneArray(genome.COLORS);
        POPULATION_GENOME.push(newGenome);
        selectedGenomesByKittyKey.current.set(kittyKey, newGenome);
        setSelectedKittyKeys((prev) => {
            const next = new Set(prev);
            next.add(kittyKey);
            return next;
        });
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
                                    <SoundButton onClick={() => toggleKittySelection(index)}>
                                        {selectedKittyKeys.has(`${kitty.sourceFile}-${index}`) ? "UNSELECT" : "SELECT"}
                                    </SoundButton>
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
                <input
                    ref={filesInputRef}
                    type="file"
                    accept=".json,.png,application/json,image/png"
                    multiple
                    className={styles["files-input-hidden"]}
                    onChange={onFilesSelected}
                />
                <div className={styles["folder-path"]}>
                    <label htmlFor="kitty-folder-path">Kitty JSON + PNG files:</label>
                    <input
                        id="kitty-folder-path"
                        value={folderPath}
                        readOnly
                        onKeyDownCapture={(event) => event.stopPropagation()}
                        className={styles["folder-path-input"]}
                        placeholder="Choose exported .json and .png files"
                    />
                </div>
                <SoundButton
                    onClick={() => {
                        if (isEmbeddedFrame()) {
                            chooseFilesFallback();
                            return;
                        }
                        chooseFolder();
                    }}
                >
                    CHOOSE FILES
                </SoundButton>
                {canLoad && <SoundButton onClick={loadJsonKitties}>IMPORT</SoundButton>}
                {status && <div className={styles["kitty-import-status"]}>{status}</div>}
            </div>
        </div>
    );
};

export default KittyImport;
