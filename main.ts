module Gamejam {
    export class Main extends Phaser.Game {

        constructor() {
            super(1024, 768, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Boot, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
            this.state.start('Boot');
        }
    }

    export class Boot extends Phaser.State {
        preload() {
            //You can preload an image here if you dont want to use text for the loading screen
        }

        create() {
            this.game.state.start('MainMenu', true, false)
        }
    }
}

window.onload = () => {
    new Gamejam.Main()
};