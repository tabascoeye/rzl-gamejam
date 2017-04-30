module Gamejam {
    export class Main extends Phaser.Game {

        constructor() {
            super(1024, 768, Phaser.AUTO);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('About', About, false);
            this.state.add('Level1', Level1, false);
            this.state.start('MainMenu');
        }
    }
}

window.onload = () => {
    new Gamejam.Main()
};
