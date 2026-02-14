import { useRef, useEffect, forwardRef } from 'react';
import * as config from '@/config';

import styles from './KittyAvatar.module.scss';

export interface RefKittyAvatar
{
    snapshotBase64: string | null;
}

interface KittyAvatarProps {
    colorArray: number[];
}

const KittyAvatar = forwardRef<RefKittyAvatar, KittyAvatarProps>(({ colorArray }, ref) => {
    const phaserRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        const instanceDestroy = () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };

        // Уничтожаем предыдущий инстанс, если он был
        instanceDestroy();

        const phaserGameConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: config.KITTY_AVATAR.CANVAS_WIDTH,
            height: config.KITTY_AVATAR.CANVAS_HEIGHT,
            transparent: true,
            parent: phaserRef.current,
            pixelArt: true,
            scene: {
                preload: function (this: Phaser.Scene) {
                    this.load.spritesheet(
                        config.KITTY.NAME, 
                        config.KITTY.SPRITESHEET_SOURCE, 
                        { frameWidth: config.KITTY.FRAME_WIDTH, frameHeight: config.KITTY.FRAME_HEIGHT }
                    );
                },
                create: function (this: Phaser.Scene) {
                    this.cameras.main.setZoom(config.ZOOM);
                    const kittenAvatar = this.add.container(config.KITTY_AVATAR.BG_WIDTH * 2, config.KITTY_AVATAR.BG_HEIGHT * 2);
                    const panelBg = this.add.rectangle(0, 0, config.KITTY_AVATAR.BG_WIDTH, config.KITTY_AVATAR.BG_HEIGHT, config.KITTY_AVATAR.BG_COLOR);

                    const base = this.add.image(0, 0, config.KITTY.NAME, 49); //17);
                    const paws = this.add.image(0, 0, config.KITTY.NAME, 81);
                    const headPattern0 = this.add.image(0, 0, config.KITTY.NAME, 113);
                    const bodyPattern0 = this.add.image(0, 0, config.KITTY.NAME, 145);
                    const headPattern1 = this.add.image(0, 0, config.KITTY.NAME, 177);
                    const bodyPattern1 = this.add.image(0, 0, config.KITTY.NAME, 209);
                    const muzzle = this.add.image(0, 0, config.KITTY.NAME, 241);
                    const chest = this.add.image(0, 0, config.KITTY.NAME, 273);
                    const face = this.add.image(0, 0, config.KITTY.NAME, 305);

                    base.setTint(colorArray[0] * 16000000);
                    paws.setAlpha(colorArray[1]);

                    if (colorArray[2] <= 0.33) {
                        headPattern0.setTintFill(colorArray[3] * 16000000);
                        headPattern1.setAlpha(0x000000);
                    } else if (colorArray[2] <= 0.66) {
                        headPattern0.setAlpha(0x000000);
                        headPattern1.setTintFill(colorArray[3] * 16000000);
                    } else {
                        headPattern0.setTintFill(colorArray[3] * 16000000);
                        headPattern1.setTintFill(colorArray[3] * 16000000);
                    }

                    if (colorArray[4] <= 0.5) {
                        bodyPattern0.setTintFill(colorArray[5] * 16000000);
                        bodyPattern1.setAlpha(0x000000);
                    } else {
                        bodyPattern0.setAlpha(0x000000);
                        bodyPattern1.setTintFill(colorArray[5] * 16000000);
                    }
                    muzzle.setAlpha(colorArray[6]);
                    chest.setAlpha(colorArray[7]);

                    kittenAvatar.add([panelBg, base, paws, headPattern0, headPattern1, bodyPattern0, bodyPattern1, muzzle, chest, face]);

                    setTimeout(() => {
                        this.renderer.snapshot((image: HTMLImageElement | Phaser.Display.Color) => {

                            // Проверяем, что snapshot — это изображение, а не цвет
                            if (!(image instanceof HTMLImageElement)) {
                                console.error("Snapshot is not an image:", image);
                                return;
                            }

                            // Для проверки работоспособности
                            // document.body.appendChild(image as Node);

                            const snap = this.textures.createCanvas('snap', image.width, image.height);

                            if (!snap) return;

                            // image гарантированно HTMLImageElement здесь — используем совместимый тип
                            // image is already checked to be HTMLImageElement
                            snap.draw(0, 0, image as HTMLImageElement);

                            const base64 = snap.canvas.toDataURL();

                            if (typeof ref === 'function') {
                                // Forwarded ref callback
                                (ref as (instance: RefKittyAvatar | null) => void)({ snapshotBase64: base64 });
                            } else if (ref) {
                                // Mutable ref object
                                (ref as React.MutableRefObject<RefKittyAvatar | null>).current = { snapshotBase64: base64 };
                            }
                        });
                    }, 1000);
                },
            },
        };

        gameInstance.current = new Phaser.Game(phaserGameConfig);

        return instanceDestroy;

    }, [colorArray, ref]);

    return (
        <div className={styles["kitty-avatar"]}>
            <div ref={phaserRef} className={styles["phaser-container"]}></div>
        </div>
    );
});

export default KittyAvatar;
