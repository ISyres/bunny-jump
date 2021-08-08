import Phaser from 'phaser'

export default class BunnyJumpScene extends Phaser.Scene {
    constructor() {
        super('bunny-jump-scene')
    }

    preload() {
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('platform', 'images/ground_grass.png')
        this.load.image('carrot', 'images/carrot.png')
        this.load.image('bunny_jump', 'images/bunny1_jump.png')
    }

    create() {
        this.add.image(240, 320, 'background')
        this.add.image(240, 320, 'platform')
    }

    update() {
        
    }
}
