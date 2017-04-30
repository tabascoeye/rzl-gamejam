
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
    game.load.image('arm', 'assets/blabberarm624_scaled.png')
}

let bottleSprites: phaser.Group

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

    let ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true
    ground.scale.setTo(3, 2);

    bottleSprites = game.add.group()
    for (let i = 0; i < 10; i++) {
        let sprite = bottleSprites.create(i * 50, 0, 'star')
        game.physics.arcade.enable(sprite);
        let body: Phaser.Physics.Arcade.Body = sprite.body
        body.bounce.y = 0.3;
        body.bounce.x = 0.3;
        body.gravity.y = 300;
        body.collideWorldBounds = true;
    }

    player = game.add.group()
    
    playerArm = player.create(80, game.world.height - 120, 'arm')
    game.physics.arcade.enable(playerArm)
    let body: Phaser.Physics.Arcade.Body = playerArm.body
    body.immovable = true
    body.setSize(playerArm.body.width, playerArm.body.height * 0.8, 0, playerArm.body.height * 0.1)
    
    playerTorso = player.create(132, game.world.height - 150, 'dude')
    game.physics.arcade.enable(playerTorso)
    body = playerTorso.body
    body.setSize(body.width * 0.7, body.height, body.width * 0.1, 0)
    body.gravity.y = 300
    body.collideWorldBounds = true
    playerTorso.animations.add('left', [1, 2], 5, true)
    playerTorso.animations.add('right', [3, 4], 5, true)

    brownbox = game.add.sprite(700, game.world.height - 64 - 24, 'brownbox')
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    bottleSprites.forEach((sprite, platforms, player) => {
        let body: Phaser.Physics.Arcade.Body = sprite.body
        game.physics.arcade.collide(sprite, platforms);
        game.physics.arcade.collide(sprite, player);
    }, this, true, platforms, player)
    game.physics.arcade.collide(player, platforms)

    //  Reset the players velocity (movement)
    if (cursors.left.isDown) {
        //  Move to the left
        blabberDirection = -1
        playerArm.body.velocity.x = -200;
        playerTorso.body.velocity.x = -200;
        playerTorso.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        blabberDirection = 1
        playerArm.body.velocity.x = 200;
        playerTorso.body.velocity.x = 200;
        playerTorso.animations.play('right');
    } else {
        //  Stand still
        playerTorso.animations.stop();
        if (blabberDirection > 0) {
            playerTorso.frame = 3
        }
        if (blabberDirection < 0) {
            playerTorso.frame = 0
        }
        playerArm.body.velocity.x = 0;
        playerTorso.body.velocity.x = 0;
    }
    playerArm.body.velocity = playerTorso.body.velocity
    if (blabberDirection < 0) {
        playerArm.position.x = playerTorso.position.x - 50
        playerArm.position.y = playerTorso.position.y + 55 
    }
    if (blabberDirection > 0) {
        playerArm.position.x = playerTorso.position.x + 40
        playerArm.position.y = playerTorso.position.y + 55         
    }
}

function render() {
    game.debug.text(`player velocity ${playerTorso.body.velocity}`, 16, 16)
    game.debug.text(`arm friction ${playerArm.body.friction}`, 16, 32)
    game.debug.body(playerTorso)
    game.debug.body(playerArm)
    bottleSprites.forEach(s => game.debug.body(s), this)
}