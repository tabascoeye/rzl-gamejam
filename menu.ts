module Gamejam {
    export class MainMenu extends Phaser.State {

        cursor: Phaser.CursorKeys;

        create() {
            this.game.debug.text("press any cursor key to start the game", 0, 20, "red");
            this.cursor = this.game.input.keyboard.createCursorKeys()
        }

        update() {
            if (this.cursor.down.justUp || this.cursor.up.justUp || this.cursor.left.justUp || this.cursor.right.justUp) {
                this.game.state.start('Level1', true, false);
            }
        }

    }
}