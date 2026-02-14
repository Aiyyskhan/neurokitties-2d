import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import * as config from '../config';

export default class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.load.image(config.MAP.TILES_NAME, config.MAP.TILES_SOURCE);
        this.load.tilemapTiledJSON(config.MAP.TILEMAP_NAME, config.MAP.TILEMAP_SOURCE);

        this.load.spritesheet(
            config.KITTY.NAME, 
            config.KITTY.SPRITESHEET_SOURCE, 
            { frameWidth: config.KITTY.FRAME_WIDTH, frameHeight: config.KITTY.FRAME_HEIGHT }
        );
        
        this.load.image(config.EASTER_EGG.NAME, config.EASTER_EGG.IMAGE_SOURCE);
        this.load.spritesheet(
            config.EASTER_EGG.BTN_NAME, 
            config.EASTER_EGG.BTN_IMAGE_SOURCE, 
            { frameWidth: config.EASTER_EGG.FRAME_WIDTH, frameHeight: config.EASTER_EGG.FRAME_HEIGHT, spacing: config.EASTER_EGG.SPACING, }
        );

        this.load.audio(config.SOUNDS.MEOW.NAME, config.SOUNDS.MEOW.SOURCE);
    }

    create ()
    {
        const layers: string[] = config.KITTY.LAYERS;
        const anims: string[] = config.KITTY.ANIMATIONS;

        for (let i = 0; i < layers.length; i++) {
            for (let j = 0; j < anims.length; j++) {
                const range = this.getRowFrames(i, j, 8, 4);
                this.animCreate(`${layers[i]}_${anims[j]}`, config.KITTY.NAME, range.start, range.end);
            }
        }

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        EventBus.emit('current-scene-ready', this);

        // this.background_music = this.sound.add('background_music_0');
        // this.background_music.play({
        //     loop: true
        // });

        this.scene.start('MainMenu');
    }

    animCreate(anim_key: string, spritesheet_key: string, start_frame: number, end_frame: number): void {
        this.anims.create({
            key: anim_key,
            frames: this.anims.generateFrameNumbers(spritesheet_key, { start: start_frame, end: end_frame }),
            frameRate: 15,
            repeat: -1
        });
    }

    getRowFrames(row: number, column: number, num_columns: number, column_len: number) {
        const all_columns_len = num_columns * column_len;
        const start = row * all_columns_len + column * column_len;
        const end = Math.min(start + column_len - 1, all_columns_len * (row + 1) - 1);
        return { start, end };
    }
}
