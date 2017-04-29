
import phaser = require('phaser-ce')

let game: Phaser.Game

export function startgame() {
    console.log("hello startgame")
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update })
}

function preload() {
    console.log("hello preload")
    game.load.image('sky', 'assets/sky.png')
    game.load.image('ground', 'assets/platform.png')
    game.load.image('star', 'assets/star.png')
    game.load.image('brownbox', 'assets/brownbox.png')
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48)
}

let starSprites: phaser.Group

let platforms: phaser.Group
let player: phaser.Sprite
let cursors: phaser.CursorKeys
let brownbox : phaser.Sprite

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    game.add.sprite(0, 0, 'sky')

    platforms = game.add.group()
    platforms.enableBody = true

    let ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true
    ground.scale.setTo(2, 2);

    starSprites = game.add.group()
    for (let i = 0; i < 10; i++) {
        let sprite = starSprites.create(i * 50, 0, 'star')
        game.physics.arcade.enable(sprite);
        let body: Phaser.Physics.Arcade.Body = sprite.body
        body.bounce.y = 0.3;
        body.bounce.x = 0.3;
        body.gravity.y = 300;
        body.collideWorldBounds = true;
    }
    player = game.add.sprite(32, game.world.height - 150, 'dude')
    game.physics.arcade.enable(player)
    player.body.gravity.y = 300
    player.body.collideWorldBounds = true
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    brownbox = game.add.sprite(700, game.world.height - 64 - 24, 'brownbox')
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    starSprites.forEach((sprite, platforms, player) => {
        let body: Phaser.Physics.Arcade.Body = sprite.body
        game.physics.arcade.collide(sprite, platforms);
        game.physics.arcade.collide(sprite, player);
    }, this, true, platforms, player)
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms)

    //  Reset the players velocity (movement)
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        //  Stand still
        player.animations.stop();
        if (player.body.velocity.x > 0) {
            player.frame = 5
        }
        if (player.body.velocity.x < 0) {
            player.frame = 0
        }
        player.body.velocity.x = 0;
    }
}
