module Gamejam {
    export class Level1 extends Phaser.State {
        bottleSprites: Phaser.Group
        platforms: Phaser.Group
        player: Phaser.Group
        playerTorso: Phaser.Sprite
        playerArm: Phaser.Sprite
        playerBasket: Phaser.Sprite
        cursors: Phaser.CursorKeys
        blabberDirection = -1
        boss: Phaser.Sprite
        attachedBottles = new Set<Phaser.Sprite>()

        preload() {
            this.game.load.image('sky', 'stockassets/sky.png')
            this.game.load.image('ground', 'stockassets/platform.png')
            this.game.load.image('bottle', 'assets/mateflasche_scaled.png')
            this.game.load.spritesheet('dude', 'assets/blabber624_scaled.png', 444 / 6, 220)
            this.game.load.spritesheet('arm', 'assets/blabberarm1248_scaled.png', 148 / 2, 0)
            this.game.load.image('boss', 'assets/endboss_scaled.png')
        }

        create() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE)

            let sky = this.game.add.sprite(0, 0, 'sky')
            sky.scale.set(2, 2)

            this.platforms = this.game.add.group()
            this.platforms.enableBody = true

            let ground = this.platforms.create(0, this.game.world.height - 64, 'ground')
            ground.body.immovable = true
            ground.scale.setTo(3, 2)

            this.bottleSprites = this.game.add.group()
            for (let i = 0; i < 10; i++) {
                this.createBottle(i * 50, 0)
            }

            this.createPlayer()
            this.createBoss()
            this.cursors = this.game.input.keyboard.createCursorKeys();
        }

        createBottle(x: number, y: number) {
            let sprite = this.bottleSprites.create(x, y, 'bottle')
            this.game.physics.arcade.enable(sprite);
            let body: Phaser.Physics.Arcade.Body = sprite.body
            body.bounce.y = 0.3;
            body.bounce.x = 0.3;
            body.gravity.y = 300;
            body.collideWorldBounds = true;
        }

        arcadeBodyOf(sprite: Phaser.Sprite) {
            let body: Phaser.Physics.Arcade.Body = sprite.body
            return body
        }

        createBoss() {
            this.boss = this.game.add.sprite(100, 10, 'boss')
            this.game.physics.enable(this.boss)
            let body = this.arcadeBodyOf(this.boss)
            body.bounce = new Phaser.Point(1.1, 0)
            body.velocity.x = 200
            body.collideWorldBounds = true
        }

        createPlayer() {
            this.player = this.game.add.group()

            this.playerArm = this.player.create(80, this.game.world.height - 120, 'arm')
            this.game.physics.arcade.enable(this.playerArm)
            let body = this.arcadeBodyOf(this.playerArm)
            body.immovable = true
            body.setSize(this.playerArm.body.width, this.playerArm.body.height * 0.8, 0, this.playerArm.body.height * 0.1)

            this.playerTorso = this.player.create(132, this.game.world.height - 150, 'dude')
            this.game.physics.arcade.enable(this.playerTorso)
            body = this.arcadeBodyOf(this.playerTorso)
            body.setSize(body.width * 0.7, body.height, body.width * 0.1, 0)
            body.gravity.y = 300
            body.collideWorldBounds = true
            this.playerTorso.animations.add('left', [1, 2], 5, true)
            this.playerTorso.animations.add('right', [3, 4], 5, true)
            this.playerArm.animations.add('left', [0], 0, false)
            this.playerArm.animations.add('right', [1], 0, false)

            this.playerBasket = this.player.create(this.playerArm.position.x - 1, this.playerArm.position.y - 100, '')
            this.game.physics.arcade.enable(this.playerBasket)
            this.playerBasket.scale.multiply(0.1, 5)
            this.playerBasket.body.immovable = true
        }

        update() {
            let directionChanged = false
            this.bottleSprites.forEach((sprite: Phaser.Sprite, platforms, playerTorso, playerArm) => {
                let body: Phaser.Physics.Arcade.Body = sprite.body
                this.game.physics.arcade.collide(sprite, playerTorso)
                let collidedWithGround = this.game.physics.arcade.collide(sprite, platforms)
                let collidedWithArm = this.game.physics.arcade.collide(sprite, playerArm)
                // must have collided with the arm and be at roughly right height
                if (collidedWithArm && sprite.position.y + sprite.height <= playerArm.position.y + 1)
                    if (this.attachedBottles.size < 3)
                        this.attachedBottles.add(sprite)
            }, this, true, this.platforms, this.playerTorso, this.playerArm)
            this.game.physics.arcade.collide(this.player, this.platforms)
            this.attachedBottles.forEach(bottle => {
                this.game.physics.arcade.collide(bottle, this.playerBasket)
                console.log(`collided ${bottle} with basket`)
            }, this)
            // drop bottles
            if (this.cursors.down.isDown) {
                // give each bottle an initial push so it won't be recaught before gravity accelerates it downwards
                this.attachedBottles.forEach(bottle => bottle.position.y += 5)
                this.attachedBottles.clear()
            }


            if (this.cursors.left.isDown) {
                //  Move to the left
                if (this.blabberDirection != -1) {
                    directionChanged = true
                    this.blabberDirection = -1
                }
            } else if (this.cursors.right.isDown) {
                //  Move to the right
                if (this.blabberDirection != 1) {
                    directionChanged = true
                    this.blabberDirection = 1
                }
            }

            if (directionChanged && this.blabberDirection < 0) {
                this.attachedBottles.forEach(bottle => {
                    let playerCenter = this.playerTorso.position.x + (this.playerTorso.width / 2) - 20
                    console.log(`playerCenter = ${playerCenter}`)
                    bottle.position.x = playerCenter - (bottle.position.x - playerCenter)
                }, this)
            }
            if (directionChanged && this.blabberDirection > 0) {
                this.attachedBottles.forEach(bottle => {
                    let playerCenter = this.playerTorso.position.x + (this.playerTorso.width / 2) - 20
                    console.log(`playerCenter = ${playerCenter}`)
                    bottle.position.x = playerCenter + (playerCenter - bottle.position.x)
                }, this)
            }

            //  Reset the players velocity (movement)
            if (this.cursors.left.isDown) {
                this.playerArm.body.velocity.x = -200
                this.playerTorso.body.velocity.x = -200
                this.playerTorso.animations.play('left')
                this.playerArm.animations.play('left')
            } else if (this.cursors.right.isDown) {
                this.playerArm.body.velocity.x = 200
                this.playerTorso.body.velocity.x = 200
                this.playerTorso.animations.play('right')
                this.playerArm.animations.play('right')
            } else {
                //  Stand still
                this.playerTorso.animations.stop()
                if (this.blabberDirection > 0) {
                    this.playerTorso.frame = 3
                }
                if (this.blabberDirection < 0) {
                    this.playerTorso.frame = 0
                }
                this.playerArm.body.velocity.x = 0
                this.playerTorso.body.velocity.x = 0
            }
            this.playerArm.body.velocity = this.playerTorso.body.velocity
            // process direction changes
            if (this.blabberDirection < 0) {
                this.playerArm.position.x = this.playerTorso.position.x - 60
                this.playerArm.position.y = this.playerTorso.position.y + 90
                this.playerTorso.body.setSize(55, 200, 10, 0);

                this.playerBasket.position.x = this.playerArm.position.x - 1
                this.playerBasket.position.y = this.playerArm.position.y - 100
            }
            if (this.blabberDirection > 0) {
                this.playerArm.position.x = this.playerTorso.position.x + 50
                this.playerArm.position.y = this.playerTorso.position.y + 90
                this.playerTorso.body.setSize(55, 200, 0, 0);

                this.playerBasket.position.x = this.playerArm.position.x + this.playerArm.width
                this.playerBasket.position.y = this.playerArm.position.y - 100
            }
        }

        render() {
            this.game.debug.text(`player velocity=${this.playerTorso.body.velocity} attachedBottles.size=${this.attachedBottles.size}`, 16, 16)
            this.game.debug.text(`boss velocity.x=${this.boss.body.velocity.x}`, 16, 48)
            this.game.debug.body(this.playerTorso)
            this.game.debug.body(this.playerArm)
            this.game.debug.body(this.playerBasket)
            this.bottleSprites.forEach(s => this.game.debug.body(s), this)
        }
    }
}
