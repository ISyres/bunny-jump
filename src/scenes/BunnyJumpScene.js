import Phaser from 'phaser'
import Carrot from '../game/Carrot'

var platforms
var player
var cursors
var carrots

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
        this.add.image(240, 320, 'background').setScrollFactor(1, 0)

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

        // Camera follow the player
        this.cameras.main.startFollow(player)

        // Initialize cursors variable
        cursors = this.input.keyboard.createCursorKeys()

        // Create dead zone
        this.cameras.main.setDeadzone(this.scale.width * 1.5)

        // Initialize carrot
        carrots = this.physics.add.group({ classType: Carrot })

        // Collide carrot with platforms
        this.physics.add.collider(platforms, carrots)

        // Overlap player with the carrot
        this.physics.add.overlap(player, carrots, this.handleCollectCarrot, undefined, this)
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

        // Create cursors for player
        if (cursors.left.isDown && !touchingDown) {
            player.setVelocityX(-200)
        } else if (cursors.right.isDown && !touchingDown) {
            player.setVelocityX(200)
        } else {
            player.setVelocityX(0)
        }

        platforms.children.iterate(child => {
            const platformChild = child
            const scrollY = this.cameras.main.scrollY

            if (platformChild.y >= scrollY + 700) {
                platformChild.y = scrollY - Phaser.Math.Between(50, 100)
                platformChild.body.updateFromGameObject()

                this.addCarrotAbove(platformChild)
            }
        })

        this.horizontalWrap(player)
    }

    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width

        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight
        const carrot = carrots.get(sprite.x, y, 'carrot')

        carrot.setActive(true)
        carrot.setVisible(true)

        this.add.existing(carrot)
        carrot.body.setSize(carrot.width, carrot.height)
        this.physics.world.enable(carrot)

        return carrot
    }

    handleCollectCarrot(player, carrot) {
        carrots.killAndHide(carrot)
        this.physics.world.disableBody(carrot.body)
    }
}
