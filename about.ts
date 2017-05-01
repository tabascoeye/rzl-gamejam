module Gamejam {
    export class About extends Phaser.State {

        back: Phaser.Button
        bg_sound: Phaser.Sound

        preload() {
            this.load.image('back', 'assets/pfeil.png')
            this.load.audio('bg', 'assets/audio/menu.ogg');
        }

        create() {
            this.back = this.add.button(400, this.game.world.height - 200,
                'back', this.goback, this, 1, 0, 2);
            this.back.scale.setTo(.35,.35)

            this.add.text(50, 50, 'Instructions:\n* try to catch the items\n* drop them by using SPACE', { font: "50px Arial black", fill: "#099f0a", align: "left" })

            this.add.text(100, 300, 'Made by:', { font: "40px Arial black", fill: "#ff0044", align: "center" })
            this.add.text(100, 350, 'GFX:   flederrattie', { font: "40px Arial black", fill: "#ff0044", align: "left" })
            this.add.text(100, 400, 'Code:  phil_fry | TabascoEye', { font: "40px Arial black", fill: "#ff0044", align: "left" })
            this.add.text(100, 450, 'SFX:  TabascoEye | echox', { font: "40px Arial black", fill: "#ff0044", align: "left" })
            this.bg_sound = this.add.audio('bg')
            this.bg_sound.play()
        }

        update() {
        }

        goback() {
            this.bg_sound.stop()
            this.game.state.start('MainMenu', true, false)
        }

        render() {
        }

    }
}
