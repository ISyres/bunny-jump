import Phaser from 'phaser'

var platforms
var player

export default class BunnyJumpScene extends Phaser.Scene {
    constructor() {
        super('bunny-jump-scene')
    }

    preload() {
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('platform', 'images/ground_grass.png')
        this.load.image('carrot', 'images/carrot.png')
        this.load.image('bunny_jump', 'images/bunny1_jump.png')
        this.load.image('bunny_stand', 'images/bunny1_stand.png')
    }

    create() {
        this.add.image(240, 320, 'background')

        // Duplicate platforms
        platforms = this.physics.add.staticGroup()

        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i
            const platformChild = platforms.create(x, y, 'platform')
            platformChild.setScale(0.5)
            platformChild.refreshBody()

            const body = platformChild.body
            body.updateFromGameObject()
        }

        // Create player
        player = this.physics.add.sprite(240, 320, 'bunny_stand').setScale(0.5)
        this.physics.add.collider(player, platforms)

        // Give collision up, left and right `false` value
        player.body.checkCollision.up = false
        player.body.checkCollision.left = false
        player.body.checkCollision.right = false
    }

    update() {
        // Create player to jump up
        const touchingDown = player.body.touching.down
        const vy = player.body.velocity.y

        if (touchingDown) {
            player.setVelocityY(-300)
            player.setTexture('bunny_jump')
        }

        if (vy > 0 && player.texture.key !== 'bunny_stand') {
            player.setTexture('bunny_stand')
        }
    }
}
