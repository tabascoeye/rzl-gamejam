
import phaser = require('phaser-ce')

let game: Phaser.Game

export function startgame() {
    console.log("hello startgame")
    game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update })
}

function preload() {
    console.log("hello preload")
    game.load.image('sky', 'stockassets/sky.png')
    game.load.image('ground', 'stockassets/platform.png')
    game.load.image('star', 'assets/mateflasche_scaled.png')
    game.load.image('brownbox', 'stockassets/brownbox.png')
    // game.load.spritesheet('dude', 'stockassets/dude.png', 32, 48)
    game.load.spritesheet('dude', 'assets/blabber_clones_moving_scaled.png', 512 / 4, 220)
}

let starSprites: phaser.Group

let platforms: phaser.Group
let player: phaser.Sprite
let cursors: phaser.CursorKeys
let brownbox : phaser.Sprite

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS)

    let sky = game.add.sprite(0, 0, 'sky')
    sky.scale.set(2,2)

    platforms = game.add.group()
    platforms.enableBody = true

    let ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true
    ground.scale.setTo(3, 2);

    starSprites = game.add.group()
    for (let i = 0; i < 10; i++) {
        let sprite = starSprites.create(i * 50, 0, 'star')
        game.physics.arcade.enable(sprite);
        let body: Phaser.Physics.P2.Body = sprite.body
        body.bounce.y = 0.3;
        body.bounce.x = 0.3;
        body.gravity.y = 300;
        body.collideWorldBounds = true;
    }
    player = game.add.sprite(32, game.world.height - 150, 'dude')
    game.physics.arcade.enable(player)
    let body : Phaser.Physics.Arcade.Body = player.body
    body.setSize(, body.height)
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true
    player.animations.add('left', [0, 1], 5, true);
    player.animations.add('right', [2, 3], 5, true);
    brownbox = game.add.sprite(700, game.world.height - 64 - 24, 'brownbox')
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.debug.body(player)
    starSprites.forEach((sprite, platforms, player) => {
        game.debug.body(sprite)
        let body: Phaser.Physics.Arcade.Body = sprite.body
        game.physics.arcade.collide(sprite, platforms);
        game.physics.arcade.collide(sprite, player);
    }, this, true, platforms, player)
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms)

    //  Reset the players velocity (movement)
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -200;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 200;
        player.animations.play('right');
    } else {
        //  Stand still
        player.animations.stop();
        if (player.body.velocity.x > 0) {
            player.frame = 2
        }
        if (player.body.velocity.x < 0) {
            player.frame = 0
        }
        player.body.velocity.x = 0;
    }
}
