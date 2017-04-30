
import phaser = require('phaser-ce')

let game: Phaser.Game

export function startgame() {
    console.log("hello startgame")
    game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
}

function preload() {
    console.log("hello preload")
    game.load.image('sky', 'stockassets/sky.png')
    game.load.image('ground', 'stockassets/platform.png')
    game.load.image('star', 'assets/mateflasche_scaled.png')
    game.load.image('brownbox', 'stockassets/brownbox.png')
    game.load.spritesheet('dude', 'assets/blabber624_scaled.png', 444 / 6, 220)
    game.load.spritesheet('arm', 'assets/blabberarm1248_scaled.png', 148 /2, 0)
}

let starSprites: phaser.Group

let platforms: phaser.Group
let player: phaser.Group
let playerTorso: phaser.Sprite
let playerArm: phaser.Sprite
let cursors: phaser.CursorKeys
let brownbox: phaser.Sprite
let blabberDirection = -1

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    let sky = game.add.sprite(0, 0, 'sky')
    sky.scale.set(2, 2)

    platforms = game.add.group()
    platforms.enableBody = true

    let ground = platforms.create(0, game.world.height - 64, 'ground')
    ground.body.immovable = true
    ground.scale.setTo(3, 2)

    starSprites = game.add.group()
    for (let i = 0; i < 10; i++) {
        let sprite = starSprites.create(i * 50, 0, 'star')
        game.physics.arcade.enable(sprite)
        let body: Phaser.Physics.Arcade.Body = sprite.body
        body.bounce.y = 0.3
        body.bounce.x = 0.3
        body.gravity.y = 300
        body.collideWorldBounds = true
    }

    player = game.add.group()
    playerArm = player.create(80, game.world.height - 120, 'arm')
    game.physics.arcade.enable(playerArm)
    playerArm.body.immovable = true
    playerTorso = player.create(132, game.world.height - 150, 'dude')
    game.physics.arcade.enable(playerTorso)
    let body: Phaser.Physics.Arcade.Body = playerTorso.body
    // body.setSize(, body.height)
    body.gravity.y = 300
    body.collideWorldBounds = true
    playerTorso.animations.add('left', [1, 2], 5, true)
    playerTorso.animations.add('right', [3, 4], 5, true)
    playerArm.animations.add('left', [0], 0, false)
    playerArm.animations.add('right', [1], 0, false)

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys()
}

function update() {
    starSprites.forEach((sprite, platforms, player) => {
        let body: Phaser.Physics.Arcade.Body = sprite.body
        game.physics.arcade.collide(sprite, platforms);
        game.physics.arcade.collide(sprite, player);
    }, this, true, platforms, player)
    game.physics.arcade.collide(player, platforms)

    //  Reset the players velocity (movement)
    if (cursors.left.isDown) {
        //  Move to the left
        blabberDirection = -1
        playerArm.body.velocity.x = -200
        playerTorso.body.velocity.x = -200
        playerTorso.animations.play('left')
        playerArm.animations.play('left')
        playerArm
    } else if (cursors.right.isDown) {
        //  Move to the right
        blabberDirection = 1
        playerArm.body.velocity.x = 200
        playerTorso.body.velocity.x = 200
        playerTorso.animations.play('right')
        playerArm.animations.play('right')
    } else {
        //  Stand still
        playerTorso.animations.stop()
        if (blabberDirection > 0) {
            playerTorso.frame = 3
        }
        if (blabberDirection < 0) {
            playerTorso.frame = 0
        }
        playerArm.body.velocity.x = 0
        playerTorso.body.velocity.x = 0
    }
    playerArm.body.velocity = playerTorso.body.velocity
    if (blabberDirection < 0) {
        playerArm.position.x = playerTorso.position.x - 60
        playerArm.position.y = playerTorso.position.y + 90
        playerTorso.body.setSize(55, 200, 10, 0);
    }
    if (blabberDirection > 0) {
        playerArm.position.x = playerTorso.position.x + 50
        playerArm.position.y = playerTorso.position.y + 90
        playerTorso.body.setSize(55, 200, 0, 0);
    }
}

function render() {
    game.debug.text(`player velocity ${playerTorso.body.velocity}`, 16, 16)
    game.debug.body(playerTorso)
    game.debug.body(playerArm)
    starSprites.forEach(s => game.debug.body(s), this)
}
