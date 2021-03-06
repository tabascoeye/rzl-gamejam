module Gamejam {
    export class MainMenu extends Phaser.State {

        cursor: Phaser.CursorKeys
        blabber: Phaser.Sprite
        logo: Phaser.Sprite
        start: Phaser.Button
        about: Phaser.Button
        start_sound: Phaser.Sound
        about_sound: Phaser.Sound
        bg_sound: Phaser.Sound
        about_txt: Phaser.Text
        start_txt: Phaser.Text
        scalesize = .6
        lasthover_about = false
        lasthover_start = false

        preload() {
            this.load.image('start', 'assets/Ausrufezeichen.png')
            this.load.image('about', 'assets/Fragezeichen.png')
            this.load.image('logo', 'assets/Dienstag.png')
            this.load.image('blabber','assets/blabber_kopf_scaled.png')
            this.load.audio('start-sound', 'assets/audio/start.ogg');
            this.load.audio('about-sound', 'assets/audio/about.ogg');
            this.load.audio('bg', 'assets/audio/menu.ogg');
        }

        create() {
            this.start_sound = this.add.audio('start-sound')
            this.about_sound = this.add.audio('about-sound')
            this.bg_sound = this.add.audio('bg')
            this.bg_sound.play()

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.logo = this.add.sprite(0, 0, 'logo')
            this.logo.scale.setTo(.6,.6)
            this.logo.anchor.setTo(.5,.5)
            this.logo.position.x = (this.game.world.height-this.logo.height)/2 + 380
            this.logo.position.y = (this.game.world.width-this.logo.width)/2 + 80

            this.blabber = this.game.add.sprite(0,0, 'blabber')
            this.blabber.scale.setTo(.6,.6)
            this.blabber.anchor.setTo(.5,.65)
            this.blabber.position.y = (this.game.world.height-400)
            this.blabber.position.x = (150)
            this.game.physics.enable(this.blabber, Phaser.Physics.ARCADE);
            this.blabber.body.angularVelocity = 250

            this.start = this.add.button(560, this.game.world.height - 200,
                'start', this.go, this, 1, 0, 2);
            this.start.scale.setTo(.35,.35)

            this.about = this.add.button(260, this.game.world.height - 200,
                'about', this.aboutGame, this, 1, 0, 2);
            this.about.scale.setTo(.35,.35)

            this.about_txt = this.add.text(290, this.game.world.height - 50, '', { font: "20px Arial black", fill: "#ffffff", align: "center" })
            this.start_txt = this.add.text(590, this.game.world.height - 50, '', { font: "20px Arial black", fill: "#ffffff", align: "center" })

        }

        update() {
            if (this.blabber.angle > 25) {
                this.blabber.angle = 20
                this.blabber.body.angularVelocity *= -1
            }
            if (this.blabber.angle < -25) {
                this.blabber.angle = -20
                this.blabber.body.angularVelocity *= -1
            }
            this.logo.scale.setTo(this.scalesize, this.scalesize)
            this.scalesize -= 0.01
            if(this.scalesize < .5) {
                this.scalesize = .6
            }

            if (this.about.input.pointerOver()) {
                if ( this.lasthover_about == false) {
                    this.about_sound.play()
                    this.about_txt.text = 'about'
                }
                this.lasthover_about = true
            } else {
                this.lasthover_about = false
                this.about_txt.text = ''
            }

            if (this.start.input.pointerOver()) {
                if (this.lasthover_start == false) {
                    this.start_sound.play()
                    this.start_txt.text = 'start'
                }
                this.lasthover_start = true
            } else {
                this.lasthover_start = false
                this.start_txt.text = ''
            }
        }

        go() {
            this.bg_sound.stop()
            this.game.state.start('Level1', true, false)
        }

        aboutGame() {
            this.bg_sound.stop()
            this.game.state.start('About', true, false)
        }

        render() {
        }

    }
}
