module Gamejam {
    export class About extends Phaser.State {

        back: Phaser.Button

        preload() {
            this.load.image('back', 'assets/pfeil.png')
        }

        create() {
            this.back = this.add.button(400, this.game.world.height - 200,
                'back', this.goback, this, 1, 0, 2);
            this.back.scale.setTo(.35,.35)

            this.add.text(50, 50, 'Instructions:\n try to catch the items ;o)', { font: "50px Arial", fill: "#099f0a", align: "left" })

            this.add.text(100, 200, 'Made by:', { font: "40px Arial", fill: "#ff0044", align: "center" })
            this.add.text(100, 300, 'GFX:   flederrattie', { font: "40px Arial", fill: "#ff0044", align: "left" })
            this.add.text(100, 400, 'Code:  phil_fry | TabascoEye', { font: "40px Arial", fill: "#ff0044", align: "left" })
            this.add.text(100, 500, 'SFX:  TabascoEye', { font: "40px Arial", fill: "#ff0044", align: "left" })
        }

        update() {
        }

        goback() {
            this.game.state.start('MainMenu', true, false)
        }

        render() {
        }

    }
}
