import { EventBus } from '../EventBus';
import { Snake } from '../objects/Snake';
import { GameObjects, Scene } from 'phaser';


export class Game extends Scene
{
    snake!: Snake;
    gameBorder!: Phaser.GameObjects.Graphics;
    scoreText!: Phaser.GameObjects.Text;
    score!: number;
    apple!: Phaser.GameObjects.Sprite;
    joystick: any;


    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x96C400);
        const rexVirtualJoyStickPlugin: any = this.plugins.get('rexvirtualjoystickplugin');
        const joystick = rexVirtualJoyStickPlugin.add(this, {
            x: 250,
            y: 700,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 30, 0xcccccc),
            dir: '4dir'
        });
        this.joystick = joystick;

        this.score = 0;
        this.scoreText = this.add.text(20, 50, this.score.toString(), { font: '48px Verdana', color: '#2F5300' });
        
        let [x, y] = this._randomPointInGameBorder();
        this.apple = this.physics.add.sprite(260, 180, 'food')
        this.apple.setInteractive(true)

        this._createGameBorder();

        this.snake = new Snake(this, 125, 180);

        this.physics.add.collider(this.snake, this.apple, this.snakeEatApple, undefined, this);

        EventBus.emit('current-scene-ready', this);


    }
    
    snakeEatApple() {
        this.apple.destroy();
        let [x, y] = this._randomPointInGameBorder();
        this.apple = this.physics.add.sprite(x, y, 'food');
        this.snake.grows("RIGHT");
        this.score += 5
        this.scoreText.setText(this.score.toString())
    }

    update() {
        if (this.joystick.up) {
            this.snake.update("UP")
        }
        else if (this.joystick.down) {
            this.snake.update("DOWN")
        }
        else if (this.joystick.left) {
            this.snake.update("LEFT")
        }
        else if (this.joystick.right) {
            this.snake.update("RIGHT")
        }
    }

    _randomPointInGameBorder(): [x: number, y: number] {
        const CELL_SIZE = 20
        const randX = Phaser.Math.Between(1, 19);
        const randY = Phaser.Math.Between(1, 17);
        const actualX = randX * CELL_SIZE + 25;
        const actualY = randY * CELL_SIZE + 120;
        return [actualX, actualY];
    }

    _createGameBorder() {
        const gameBorder = this.add.graphics();
        gameBorder.lineStyle(10, 0x2F5300, 1);
        gameBorder.strokeRect(25, 120, 430, 360);
        this.gameBorder = gameBorder;
        this.physics.add.existing(this.gameBorder);
        this.physics.world.setBounds(25, 120, 430, 368);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
