import * as Phaser from 'phaser';
import PhaserRaycaster from 'phaser-raycaster'
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import MainMenu from './scenes/MainMenu';
import GameScene from './scenes/Game';

export const GAME_VERSION: string = "1.0.0";

export const POPULATION_SIZE: number = 15;
export const COLOR_COUNT: number = 8;
export const MATRICES_COUNT: number = 8;
export const NEURON_COUNT: number = 30;

export const MUTATION_PROB: number = 0.0;
export const MUTATION_LEVEL: number = 0.0;
export const BRAIN_TRANSFER_PROB: number = 0.5;
export const BRAIN_FRACTION: number = 0.5;

export const DEFAULT_WIDTH: number = window.innerWidth;
export const DEFAULT_HEIGHT: number = window.innerHeight;
export const HUD_HEIGHT_PROPORTION: number = 0.12;

export const CAMERA_SPEED: number = 10;
export const ZOOM: number = 4;

export const GameData = {
    KITTY_PROGRESS: new Map<number, number>(),
    CHAMPION_IDS: new Set<number>(),
}

export const SOLANA = {
    MAINNET: 'https://api.mainnet-beta.solana.com',
    DEVNET: 'https://api.devnet.solana.com',
    EXPLORER: 'https://translator.shyft.to', //'https://explorer.solana.com',
    IRYS: 'https://gateway.irys.xyz',
}

export const NFT_METADATA_TMP = {
    NAME: "NeuroKitty",
    SYMBOL: "NK",
    DESCRIPTION: "My NeuroKitty #",
}

export const MAP = {
    TILES_SOURCE: "assets/maps/Tiles_20250416_1.png",
    TILEMAP_SOURCE: "assets/maps/maze_10.json",
    TILESET_NAME: "Tiles_20250416_1",
    TILES_NAME: "maze",
    TILEMAP_NAME: "map",
    TILES_SIZE: 8,
}

export const LAYERS = {
    COLLIDERS: "Colliders",
    GROUND: "Ground",
    STARTFIELD: "StartField",
    FINISHFIELD: "FinishField",
    BACKGROUND: "Background",
    PLANTS: "Plants",
    BACKGROUND2: "Background2",
    WALLS: "Walls",
    FOREGROUND: "Foreground"
}

export const KITTY = {
    NAME: "kitty",
    SPRITESHEET_SOURCE: "assets/characters/Kitty20250404_0.png",
    SPRITE_SCALE: 1,
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    ANIMATIONS: ["il", "wl", "ib", "wb", "ir", "wr", "if", "wf"],
    LAYERS: ["Shadow", "Base", "Paws", "HeadPattern0", "BodyPattern0", "HeadPattern1", "BodyPattern1", "Muzzle", "Chest", "Face"],
    MAX_SPEED: 50,
    ANGLES_OF_RAYS: [-90,-45,0,45,90],
}

export const KITTY_INFO = {
    FONT_FAMILY: "VT323",
    FONT_SIZE: "9px",
    BG_COLOR: "#ffffffdd",
    TEXT_COLOR: "#849e0e",
    RESOLUTION: 4,
}

export const KITTY_AVATAR = {
    CANVAS_WIDTH: 128,
    CANVAS_HEIGHT: 128,
    BG_WIDTH: 32,
    BG_HEIGHT: 32,
    BG_COLOR: 0xf5f8ce,
}

export const SECTORS = {
    SLICE_TILES: 4, // number of tiles per sector slice when splitting corridors
};

export const EASTER_EGG = {
    NAME: "easteregg",
    IMAGE_SOURCE: "assets/ui/Easter_egg_20250401.png",
    BTN_NAME: "eastereggBtn",
    BTN_IMAGE_SOURCE: "assets/maps/Tiles_20250416_1.png",
    FRAME_WIDTH: 8,
    FRAME_HEIGHT: 8,
    SPACING: 1,
}

export const SOUNDS = {
    MAIN_BG: {
        SOURCE: "assets/audio/serenity_4.mp3",
        VOLUME_0: 0.2,
        VOLUME_1: 0.1,
    },
    ADDITIONAL_BG: {
        SOURCE: "assets/audio/spring_forest_birdsong_2025.mp3",
        VOLUME: 1.0,
    },
    BTN: {
        PRESS_SOURCE: "assets/audio/mouseclick1.ogg",
        RELEASE_SOURCE: "assets/audio/mouserelease1.ogg",
        VALUE_ADJUST_SOURCE: "assets/audio/click4.ogg",
        VOLUME: 0.2,
    },
    MEOW: {
        SOURCE: "assets/audio/meow_1.mp3",
        NAME: "meow",
    },
}

export const VALUE_ADJUST_AUTOCHANGE = {
    DELAY: 500,
    INTERVAL: 100,
    STEP: 0.01,
    MIN: 0,
    MAX: 1,
}

export const DONATION = {
    BOOSTY_URL: "https://boosty.to/aiyyskhan/donate",
    SOLANA_WALLET: "2rjkKSywcyASzLyMJBhkpueNDk4KL3FkP7byCYmeaeF7",
    SOLANA_AMOUNT: 0.1,
}


export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: '#f5f8ce',
    parent: 'phaser-game',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        },
    },
    dom: {
        createContainer: true
    },
    scene: [Boot, Preloader, MainMenu, GameScene],
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    },
    pixelArt: true,
};