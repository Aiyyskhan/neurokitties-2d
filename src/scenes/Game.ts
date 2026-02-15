import { EventBus } from '../EventBus';
import { Kitty } from '../entities/kitty';
import { POPULATION_GENOME } from '../neuroevolution/genomes';
import type { SelectedKitty } from "@/types/game";
import * as config from "../config";

export default class GameScene extends Phaser.Scene {
    private popSize: number = config.POPULATION_SIZE;
    private hudHeightProp: number = config.HUD_HEIGHT_PROPORTION;

    private kitties: Kitty[] = [];
    private debugGraphics!: Phaser.GameObjects.Graphics;    

    private map!: Phaser.Tilemaps.Tilemap;
    private collidersLayer!: Phaser.Tilemaps.TilemapLayer;
    private startLayer!: Phaser.Tilemaps.TilemapLayer;
    private finishLayer!: Phaser.Tilemaps.TilemapLayer;
    private checkpointsGroup!: Phaser.Physics.Arcade.StaticGroup;
    public arrow_keys!: Phaser.Types.Input.Keyboard.CursorKeys;
    // public wasd_keys!: Phaser.Types.Input.Keyboard.CursorKeys;
    private kittyInfo!: Phaser.GameObjects.Text;

    private enableActivity: boolean = false;
    private modalInputLocked: boolean = false;

    private meow!: Phaser.Sound.BaseSound;
    
    constructor() {
        super("GameScene");
    }

    create() {
        this.map = this.make.tilemap({ key: "map" });
        const tileset = this.map.addTilesetImage(config.MAP.TILESET_NAME, config.MAP.TILES_NAME, config.MAP.TILES_SIZE, config.MAP.TILES_SIZE);

        const heightCoeff = Math.floor((this.scale.height*this.hudHeightProp)/config.ZOOM);

        this.cameras.main.setBounds(0, 0-heightCoeff, this.map.widthInPixels, this.map.heightInPixels+heightCoeff);
        this.cameras.main.setZoom(config.ZOOM);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.collidersLayer = this.map.createLayer(config.LAYERS.COLLIDERS, tileset!, 0, 0) as Phaser.Tilemaps.TilemapLayer;

        this.map.createLayer(config.LAYERS.GROUND, tileset!, 0, 0);
        this.startLayer = this.map.createLayer(config.LAYERS.STARTFIELD, tileset!, 0, 0) as Phaser.Tilemaps.TilemapLayer;
        this.finishLayer = this.map.createLayer(config.LAYERS.FINISHFIELD, tileset!, 0, 0) as Phaser.Tilemaps.TilemapLayer;
        this.map.createLayer(config.LAYERS.BACKGROUND, tileset!, 0, 0);
        this.map.createLayer(config.LAYERS.PLANTS, tileset!, 0, 0);
        this.map.createLayer(config.LAYERS.BACKGROUND2, tileset!, 0, 0);
    // Create invisible checkpoints between start and finish
    this.createCheckpoints();
        const walls = this.map.createLayer(config.LAYERS.WALLS, tileset!, 0, 0);
        const fgLayer = this.map.createLayer(config.LAYERS.FOREGROUND, tileset!, 0, 0);
                
        this.collidersLayer?.setDepth(1000).setVisible(false);
        walls?.setDepth(1000);
        fgLayer?.setDepth(1000);

        this.collidersLayer?.setCollisionByExclusion([ -1 ]);

        this.add.sprite(36*8+4, 6*8+4, config.EASTER_EGG.BTN_NAME, 98)
            .setInteractive({ useHandCursor: true, pixelPerfect: true })
            .on('pointerdown', (): void => {
                const camera = this.cameras.main;
                const centerX = camera.worldView.centerX;
                const centerY = camera.worldView.centerY + 12;
                
                const egg = this.add.image(centerX, centerY, config.EASTER_EGG.NAME)
                    .setOrigin(0.5, 0.5).setDepth(1000).setScale(1.2);

                // Функция для смены цвета
                const changeColor = () => {
                    const randomColor = Phaser.Display.Color.RandomRGB().color;
                    egg.setTint(randomColor);
                };
        
                // Запускаем смену цвета каждые 100 мс
                const colorTimer = this.time.addEvent({
                    delay: 200,
                    callback: changeColor,
                    loop: true
                });

                // Через 2 секунды убираем pop-up
                this.time.delayedCall(5000, () => {
                    egg.destroy();
                    colorTimer.remove();
                });
            })
            .on('pointerout', (): void => {
                this.kittyInfo.setVisible(false);
            })

        this.cameras.main.scrollX = -this.map.widthInPixels;
        this.cameras.main.scrollY = this.map.heightInPixels;

        this.meow = this.sound.add(config.SOUNDS.MEOW.NAME);

        this.kittyInfo = this.add.text(0, 0, "#", { fontFamily: config.KITTY_INFO.FONT_FAMILY, fontSize: config.KITTY_INFO.FONT_SIZE, resolution: config.KITTY_INFO.RESOLUTION })
            .setStyle({ backgroundColor: config.KITTY_INFO.BG_COLOR, color: config.KITTY_INFO.TEXT_COLOR })
            .setOrigin(0.5, 0.7)
            .setVisible(false);
        
        // Отключаем стандартное меню браузера при правом клике
        this.input.mouse!.disableContextMenu();

        // Добавляем управление камерой
        this.arrow_keys = this.input.keyboard!.createCursorKeys();
        // this.wasdKeysActivate();

        // zoom
        // this.input.on("wheel", (_pointer: Phaser.Input.Pointer, _gameObjects: Phaser.GameObjects.GameObject[], _deltaX: number, deltaY: number, _deltaZ: number) => {
        //     let zoom = this.cameras.main.zoom;
        //     zoom += deltaY * -0.001; // Чем больше крутится колесо, тем сильнее изменение
        //     zoom = Phaser.Math.Clamp(zoom, 1.5, config.GameData.ZOOM); // Ограничиваем зум от 0.5 до 2
        //     console.log(`zoom: ${zoom}`);            
        //     this.cameras.main.setZoom(zoom);
        // });

        this.debugGraphics = this.add.graphics();
        this.debugGraphics.clear();
        this.map.renderDebug(this.debugGraphics, { tileColor: null });

        EventBus.emit('current-scene-ready', this);
    }

    createCheckpoints() {
        // Create static group for sector checkpoints
        this.checkpointsGroup = this.physics.add.staticGroup();

        const tileWidth = this.map.tileWidth;
        const tileHeight = this.map.tileHeight;
        const mapWidth = this.map.width;
        const mapHeight = this.map.height;

        const debug = Boolean((config.gameConfig as unknown as { physics?: { arcade?: { debug?: boolean } } }).physics?.arcade?.debug);

        const inBounds = (x: number, y: number) => x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;

        // Find a start tile in the start layer
        let startTx: number | null = null;
        let startTy: number | null = null;
        for (let ty = 0; ty < mapHeight && startTx === null; ty++) {
            for (let tx = 0; tx < mapWidth; tx++) {
                const t = this.startLayer.getTileAt(tx, ty);
                if (t) { 
                    startTx = tx; 
                    startTy = ty; 
                    break; 
                }
            }
        }

        // If no start tile found, fallback: create a single sector covering whole reachable area
        if (startTx === null || startTy === null) {
            // fallback to single-sector over all walkable tiles
            const cells: [number, number][] = [];
            for (let ty = 0; ty < mapHeight; ty++) {
                for (let tx = 0; tx < mapWidth; tx++) {
                    if (this.collidersLayer.getTileAt(tx, ty)) continue;
                    cells.push([tx, ty]);
                }
            }
            if (cells.length === 0) return;
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (const [cx, cy] of cells) {
                if (cx < minX) minX = cx;
                if (cx > maxX) maxX = cx;
                if (cy < minY) minY = cy;
                if (cy > maxY) maxY = cy;
            }
            const x = (minX + maxX + 1) / 2 * tileWidth;
            const y = (minY + maxY + 1) / 2 * tileHeight;
            const width = (maxX - minX + 1) * tileWidth;
            const height = (maxY - minY + 1) * tileHeight;
            const rect = this.add.rectangle(x, y, width, height, 0x00ff00, debug ? 0.25 : 0);
            this.physics.add.existing(rect, true);
            this.checkpointsGroup.add(rect as unknown as Phaser.Physics.Arcade.Sprite);
            (rect as Phaser.GameObjects.Rectangle).setData('checkpointId', 0);
            return;
        }

        // BFS from start tile to compute tile distances (in tiles)
        const dist: number[][] = Array.from({ length: mapHeight }, () => Array(mapWidth).fill(-1));
        const queue: [number, number][] = [];
        dist[startTy][startTx] = 0;
        queue.push([startTx, startTy]);

        while (queue.length) {
            const [cx, cy] = queue.shift()!;
            const neighbors = [[cx+1, cy],[cx-1, cy],[cx, cy+1],[cx, cy-1]] as [number,number][];
            for (const [nx, ny] of neighbors) {
                if (!inBounds(nx, ny)) continue;
                if (dist[ny][nx] !== -1) continue;
                if (this.collidersLayer.getTileAt(nx, ny)) {
                    dist[ny][nx] = -1; // explicitly unreachable
                    continue;
                }
                dist[ny][nx] = dist[cy][cx] + 1;
                queue.push([nx, ny]);
            }
        }

        // Collect tiles by distance and determine max distance
        let maxDist = 0;
        for (let ty = 0; ty < mapHeight; ty++) {
            for (let tx = 0; tx < mapWidth; tx++) {
                if (dist[ty][tx] > maxDist) maxDist = dist[ty][tx];
            }
        }

        if (maxDist <= 0) {
            // nothing reachable besides start -> create single sector at start
            const x = (startTx + 0.5) * tileWidth;
            const y = (startTy + 0.5) * tileHeight;
            const rect = this.add.rectangle(x, y, tileWidth, tileHeight, 0x00ff00, debug ? 0.25 : 0);
            this.physics.add.existing(rect, true);
            this.checkpointsGroup.add(rect as unknown as Phaser.Physics.Arcade.Sprite);
            (rect as Phaser.GameObjects.Rectangle).setData('checkpointId', 0);
            return;
        }

        // Decide on sector size in tiles: smaller value to match corridor widths
        const idealTilesPerSector = 4; // smaller sectors to better follow corridors
        const sectorStep = Math.max(1, Math.floor(idealTilesPerSector));

        const sectors = new Map<number, [number, number][]>();
        for (let ty = 0; ty < mapHeight; ty++) {
            for (let tx = 0; tx < mapWidth; tx++) {
                const d = dist[ty][tx];
                if (d < 0) continue;
                const sectorId = Math.floor(d / sectorStep);
                const arr = sectors.get(sectorId) ?? [];
                arr.push([tx, ty]);
                sectors.set(sectorId, arr);
            }
        }

        // Create rectangles per connected component inside each sector (so rects don't span across walls)
        const sectorKeys = [...sectors.keys()].sort((a,b)=>a-b);
        let createdId = 0;
        const visitedComp: boolean[][] = Array.from({ length: mapHeight }, () => Array(mapWidth).fill(false));
        for (const key of sectorKeys) {
            const cells = sectors.get(key)!;
            if (!cells || cells.length === 0) continue;

            // Quick lookup of tiles that belong to this sector
            const tileSet = new Set(cells.map(([tx,ty]) => `${tx},${ty}`));

            for (const [startX, startY] of cells) {
                if (visitedComp[startY][startX]) continue;

                // flood-fill within this sector to get connected component
                const queueComp: [number, number][] = [[startX, startY]];
                visitedComp[startY][startX] = true;
                const compCells: [number, number][] = [];
                while (queueComp.length) {
                    const [cx, cy] = queueComp.shift()!;
                    compCells.push([cx, cy]);
                    const neigh = [[cx+1, cy],[cx-1, cy],[cx, cy+1],[cx, cy-1]] as [number,number][];
                    for (const [nx, ny] of neigh) {
                        if (!inBounds(nx, ny)) continue;
                        if (visitedComp[ny][nx]) continue;
                        if (!tileSet.has(`${nx},${ny}`)) continue;
                        visitedComp[ny][nx] = true;
                        queueComp.push([nx, ny]);
                    }
                }

                if (compCells.length === 0) continue;

                // Map rows -> sorted x positions
                const rows = new Map<number, number[]>();
                for (const [cx, cy] of compCells) {
                    const arr = rows.get(cy) ?? [];
                    arr.push(cx);
                    rows.set(cy, arr);
                }

                // For each row, create non-overlapping horizontal rectangles for contiguous runs
                const rectsForThisComponent: Phaser.GameObjects.Rectangle[] = [];
                for (const [rowY, xs] of rows.entries()) {
                    xs.sort((a,b)=>a-b);
                    let runStart = xs[0];
                    let prev = xs[0];
                    for (let i = 1; i < xs.length; i++) {
                        const cur = xs[i];
                        if (cur === prev + 1) {
                            prev = cur;
                            continue;
                        }
                        // end of run at prev
                        const runEnd = prev;
                        const runLen = runEnd - runStart + 1;
                        const rx = (runStart + runEnd + 1) / 2 * tileWidth;
                        const ry = (rowY + 0.5) * tileHeight;
                        const rwidth = runLen * tileWidth;
                        const rheight = tileHeight;
                        const r = this.add.rectangle(rx, ry, rwidth, rheight, 0x00ff00, debug ? 0.12 : 0);
                        if (debug) {
                            try {
                                (r as any).setFillStyle(0x00ff00, 0.12);
                                (r as any).setStrokeStyle(1, 0xffffff, 0.4);
                            } catch (e) {}
                        }
                        rectsForThisComponent.push(r);

                        // start new run
                        runStart = cur;
                        prev = cur;
                    }
                    // finalize last run
                    const runEnd = prev;
                    const runLen = runEnd - runStart + 1;
                    const rx = (runStart + runEnd + 1) / 2 * tileWidth;
                    const ry = (rowY + 0.5) * tileHeight;
                    const rwidth = runLen * tileWidth;
                    const rheight = tileHeight;
                    const r = this.add.rectangle(rx, ry, rwidth, rheight, 0x00ff00, debug ? 0.12 : 0);
                    if (debug) {
                        try {
                            (r as any).setFillStyle(0x00ff00, 0.12);
                            (r as any).setStrokeStyle(1, 0xffffff, 0.4);
                        } catch (e) {}
                    }
                    rectsForThisComponent.push(r);
                }

                if (rectsForThisComponent.length === 0) continue;

                // Add physics bodies and set same checkpointId for all rects in this component
                for (const r of rectsForThisComponent) {
                    this.physics.add.existing(r, true);
                    this.checkpointsGroup.add(r as unknown as Phaser.Physics.Arcade.Sprite);
                    (r as Phaser.GameObjects.Rectangle).setData('checkpointId', createdId);
                }

                // In debug, add a small label at the first rectangle's top-left
                if (debug) {
                    const first = rectsForThisComponent[0];
                    this.add.text(first.x - first.width/2 + 2, first.y - first.height/2 + 2, String(createdId), { fontSize: '10px', color: '#ffffff' }).setDepth(10000);
                }

                createdId++;
            }
        }
    }

    checkpointOverlap(kittyObj: unknown, checkpointObj: unknown) {
        const kittyGO = kittyObj as Phaser.GameObjects.GameObject & { getData?: (k: string) => unknown };
        const checkpointGO = checkpointObj as Phaser.GameObjects.GameObject & { getData?: (k: string) => unknown };
        const kitty = kittyGO.getData ? (kittyGO.getData('kitty') as Kitty) : undefined;
        const checkpointId = checkpointGO.getData ? (checkpointGO.getData('checkpointId') as number) : undefined;
        if (kitty && typeof checkpointId === 'number') {
            if (!kitty.progress.has(checkpointId)) {
                kitty.progress.add(checkpointId);
                // optional: mark checkpoint visited (debug)
                // (checkpointObj as any).fillColor = 0x00ff00;
            }
        }
    }

    createKitties() {
        // console.log("create kitties");
        
        // config.GameData.KITTY_IDS.clear();
        config.GameData.KITTY_PROGRESS.clear();
        config.GameData.CHAMPION_IDS.clear();
        
        if (this.kitties.length > 0) {         
            // console.log("Kitties destroys");
            
            this.kitties.forEach(kitty => kitty.destroy());
            this.kitties.length = 0;
        }
        for (let i = 0; i < this.popSize; i++) {
            const start_x = 8 * 9 + 4;
            const start_y = this.map.heightInPixels - 8 * 9 + 4 - 8;
            const kitty = new Kitty(
                this, POPULATION_GENOME[i], i, start_x, start_y,
                config.KITTY.ANGLES_OF_RAYS, config.KITTY.SPRITE_SCALE, config.KITTY.MAX_SPEED, config.KITTY.NAME
            );

            kitty.base.setInteractive({ useHandCursor: true, pixelPerfect: true })
            .on('pointerover', (): void => {
                if (!this.modalInputLocked) {
                    // const totalSectors = this.checkpointsGroup ? this.checkpointsGroup.getLength() : 0;
                    const visited = kitty.progress.size;
                    // this.kittyInfo.setText(`# ${kitty.id} (${visited}/${totalSectors} sectors)`)
                    this.kittyInfo.setText(`# ${kitty.id} (progress: ${visited})`)
                        .setVisible(true).setPosition(kitty.base.x, kitty.base.y-20).setDepth(kitty.base.y+1000);
                }
            })
            
            this.setColliders(kitty);

            this.physics.add.overlap(kitty.base, this.startLayer);
            // Overlap with invisible checkpoints to record progress
            if (this.checkpointsGroup) {
                this.physics.add.overlap(kitty.base, this.checkpointsGroup, this.checkpointOverlap, undefined, this);
            }

            kitty.rayCasterCreate(this.collidersLayer);

            this.kitties.push(kitty);
        }
    }

    addingRemovingKitties(
        selectedInfoUpdate: (arr: SelectedKitty[]) => void, 
        championsInfoUpdate: (arr: number[]) => void
    ) {
        selectedInfoUpdate([...config.GameData.KITTY_PROGRESS].map(([id, progress]) => ({ id, progress })));
        championsInfoUpdate([...config.GameData.CHAMPION_IDS]);
        this.kitties.forEach((k) => { 
            k.base.on('pointerout', (): void => {
                this.kittyInfo.setVisible(false);
            })
            .on('pointerdown', (pointer: Phaser.Input.Pointer): void => {
                if (!this.modalInputLocked) {
                    if (pointer.leftButtonDown()) {
                        if (config.GameData.KITTY_PROGRESS.size < 5) {
                            config.GameData.KITTY_PROGRESS.set(k.id, k.progress.size);

                        }
                        this.meow.play();
                    } else if (pointer.rightButtonDown()) {
                        config.GameData.KITTY_PROGRESS.delete(k.id);
                    }
                    selectedInfoUpdate([...config.GameData.KITTY_PROGRESS].map(([id, progress]) => ({ id, progress })));
                }
            });
        });
        this.finishLayer?.setTileIndexCallback(87, (kitty: Phaser.GameObjects.GameObject & { id?: number }, _tile: Phaser.Tilemaps.Tile) => {
            // Mark _tile as used to satisfy linter (callback provides tile but we don't need it)
            void _tile;
            console.log(`Finish! Kitty id: ${kitty.id}`);
            if (typeof kitty.id === 'number' && !config.GameData.CHAMPION_IDS.has(kitty.id)) {
                config.GameData.CHAMPION_IDS.add(kitty.id);
                championsInfoUpdate([...config.GameData.CHAMPION_IDS]);
            }
        }, this);
    }

    setColliders(kitty: Kitty) {
        for (const key in kitty.skinLayers) {
            this.physics.add.collider(kitty.skinLayers[key], this.collidersLayer);
        }
    }

    // wasdKeysActivate() {
    //     this.wasd_keys = this.input.keyboard!.addKeys({
    //         up: Phaser.Input.Keyboard.KeyCodes.W,
    //         down: Phaser.Input.Keyboard.KeyCodes.S,
    //         left: Phaser.Input.Keyboard.KeyCodes.A,
    //         right: Phaser.Input.Keyboard.KeyCodes.D,
    //     }) as Phaser.Types.Input.Keyboard.CursorKeys;
    // }

    // wasdKeysDeactivate() {
    //     this.wasd_keys.up.destroy();
    //     this.wasd_keys.down.destroy();
    //     this.wasd_keys.left.destroy();
    //     this.wasd_keys.right.destroy();
    // }

    update(_time: number, _delta: number): void {
        // Mark parameters as used to satisfy linter (Phaser calls update with these args)
        void _time;
        void _delta;
        // console.log(`FPS: ${Math.round(this.game.loop.actualFps)}`);
        
        if (this.enableActivity) {
            this.kitties.forEach((k) => { k.update(); });
        }        
        
        // if (this.wasd_keys.left.isDown || this.arrow_keys.left.isDown) {
        if (this.arrow_keys.left.isDown) {
            this.cameras.main.scrollX -= config.CAMERA_SPEED;
        }
        // if (this.wasd_keys.right.isDown || this.arrow_keys.right.isDown) {
        if (this.arrow_keys.right.isDown) {
            this.cameras.main.scrollX += config.CAMERA_SPEED;
        }
        // if (this.wasd_keys.up.isDown || this.arrow_keys.up.isDown) {
        if (this.arrow_keys.up.isDown) {
            this.cameras.main.scrollY -= config.CAMERA_SPEED;
        }
        // if (this.wasd_keys.down.isDown || this.arrow_keys.down.isDown) {
        if (this.arrow_keys.down.isDown) {
            this.cameras.main.scrollY += config.CAMERA_SPEED;
        }        
    }

    getRandomInt(min: number, max: number): number {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }

    activityStart(): void {
        this.enableActivity = true;
    }

    handlePause(pause_state: boolean): void {
        this.kitties.forEach((k) => { k.handlePause(pause_state); });
    }

    handleModalInputLock(locked: boolean): void {
        this.modalInputLocked = locked;
    }

    exit() {
        this.enableActivity = false;
        this.scene.start('MainMenu');
    }
}
