module Gamejam {
    export class About extends Phaser.State {

        back: Phaser.Button

        preload() {
            this.load.image('back', 'assets/pfeil-01.png')
        }

        create() {
            this.back = this.add.button(260, this.game.world.height - 200,
                'back', this.goback, this, 1, 0, 2);
            this.back.scale.setTo(.35,.35)
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
