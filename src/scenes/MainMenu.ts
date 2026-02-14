import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export default class MainMenu extends Scene {
    constructor () {
        super('MainMenu');
    }

    create () {
        EventBus.emit('current-scene-ready', this);
    }
    
    startGame () {
        if (!this.sys.game.device.os.desktop) {
            this.scale.startFullscreen();
        }
        this.scene.start('GameScene');
    }
}
