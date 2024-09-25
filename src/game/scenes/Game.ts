import { EventBus } from '../EventBus';
import { Snake } from '../objects/Snake';
import { GameObjects, Scene } from 'phaser';


export class Game extends Scene
{
    snake!: Snake;
    gameBorder!: any;//Phaser.GameObjects.Graphics;
    scoreText!: Phaser.GameObjects.Text;
    score!: number;
    apple!: Phaser.GameObjects.Sprite;
    joystick!: any;
    direction: string = "RIGHT";
    cursorKey!: any;


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
            dir: '4dir',
            enable: true
        });
        this.joystick = joystick;

        this.score = 0;
        this.scoreText = this.add.text(20, 50, this.score.toString(), { font: '48px Verdana', color: '#2F5300' });
        
        let [x, y] = this._randomPointInGameBorder();
        this.apple = this.physics.add.sprite(260, 180, 'food')

        this._createGameBorder();

        if (this.input.keyboard) {
            this.cursorKey = this.input.keyboard.createCursorKeys();
        }

        this.snake = new Snake(this, 125, 180);

        this.physics.add.collider(this.snake, this.apple, this.snakeEatApple, undefined, this);
        this.physics.add.collider(this.snake, this.gameBorder, this.handleBorderCollision, undefined, this);
        
        EventBus.emit('current-scene-ready', this);


    }
    
    snakeEatApple(apple: any, snake: any) {
        let [x, y] = this._randomPointInGameBorder();
        this.apple.setPosition(x, y)

        this.snake.grows();
        
        this.score += 5
        this.scoreText.setText(this.score.toString())
    }

    handleBorderCollision() {
       console.log("borderCollision")
       this.scene.restart()
       this.direction = "RIGHT"
    }

    update() {
        this._setDirection();
        this.snake.update(this.direction)
        this._onSnakeHitSnake();
    }

    _setDirection() {
        if (this.joystick.up) {
            this.direction = "UP";
        }
        else if (this.joystick.down) {
            this.direction = "DOWN";
        }
        else if (this.joystick.left) {
            this.direction = "LEFT";
        }
        else if (this.joystick.right) {
            this.direction = "RIGHT";
        }

        if (this.cursorKey && this.cursorKey.up.isDown) {
            this.direction = "UP";
        }
        else if (this.cursorKey && this.cursorKey.down.isDown) {
            this.direction = "DOWN";
        }
        else if (this.cursorKey && this.cursorKey.left.isDown) {
            this.direction = "LEFT";
        }
        else if (this.cursorKey && this.cursorKey.right.isDown) {
            this.direction = "RIGHT";
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
        const BORDER_THICKNESS = 10;
        
        this.gameBorder = this.physics.add.staticGroup();
        this.gameBorder.create(240, 120, 'border', null, true).setDisplaySize(440, BORDER_THICKNESS).refreshBody(); // Top
        this.gameBorder.create(240, 480, 'border', null, true).setDisplaySize(440, BORDER_THICKNESS).refreshBody(); // Bottom
        this.gameBorder.create(25, 300, 'border', null, true).setDisplaySize(BORDER_THICKNESS, 350).refreshBody(); // Left
        this.gameBorder.create(455, 300, 'border', null, true).setDisplaySize(BORDER_THICKNESS, 350).refreshBody(); // Right

    }

    _onSnakeHitSnake() {
        const snakeBodyParts = this.snake.getChildren() as GameObjects.Sprite[]
        const head = snakeBodyParts[0];
        
        for (let i = 1; i < snakeBodyParts.length; i++) {
            const bodyPart = snakeBodyParts[i];
            if (head.x === bodyPart.x && head.y === bodyPart.y) {
                console.log("snakehitsnake", bodyPart, i)
                this.scene.restart()
                this.direction = "RIGHT"
                break;
            }
        }
    }

}
