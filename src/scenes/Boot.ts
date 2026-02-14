import { Scene } from 'phaser';

export default class Boot extends Scene {
    constructor () {
        super('Boot');
    }

    create () {
        this.scene.start('Preloader');
    }
}
