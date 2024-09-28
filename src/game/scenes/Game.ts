import { EventBus } from '../EventBus';
import { Snake } from '../objects/Snake';
import { AppConstants } from '../util/AppConstants';
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
        this.cameras.main.setBackgroundColor(AppConstants.BACKGROUND_COLOR);

        const rexVirtualJoyStickPlugin: any = this.plugins.get('rexvirtualjoystickplugin');
        const joystick = rexVirtualJoyStickPlugin.add(this, {
            x: AppConstants.JOYSTICK_X,
            y: AppConstants.JOYSTICK_Y,
            radius: AppConstants.JOYSTICK_RADIUS,
            base: this.add.circle(0, 0, AppConstants.JOYSTICK_BASE_SIZE, AppConstants.JOYSTICK_BASE_COLOR),
            thumb: this.add.circle(0, 0, AppConstants.JOYSTICK_THUMB_SIZE, AppConstants.JOYSTICK_THUMB_COLOR),
            dir: AppConstants.JOYSTICK_DIR,
            enable: true
        });
        this.joystick = joystick;

        this.score = 0;
        this.scoreText = this.add.text(20, 10, this.score.toString(), { font: '48px Verdana', color: AppConstants.FOREGROUND_COLOR_HEX });
        
        let [x, y] = this._randomPointInGameBorder();
        this.apple = this.physics.add.sprite(AppConstants.APPLE_X * AppConstants.BODY_SIZE, AppConstants.APPLE_Y * AppConstants.BODY_SIZE, 'food')

        this._createGameBorder();

        if (this.input.keyboard) {
            this.cursorKey = this.input.keyboard.createCursorKeys();
        }

        this.snake = new Snake(this, AppConstants.SNAKE_X * AppConstants.BODY_SIZE, AppConstants.SNAKE_Y * AppConstants.BODY_SIZE);

        this.physics.add.collider(this.snake, this.apple, this.snakeEatApple, undefined, this);
        this.physics.add.collider(this.snake, this.gameBorder, this.handleBorderCollision, undefined, this);

        this.direction = "RIGHT";

        EventBus.emit('current-scene-ready', this);


    }
    
    snakeEatApple(apple: any, snake: any) {
        let [x, y] = this._randomPointInGameBorder();
        this.apple.setPosition(x, y)

        this.snake.grows();
        
        this.score += AppConstants.SCORE_INCREMENT
        this.scoreText.setText(this.score.toString())
    }

    handleBorderCollision() {
       this.scene.restart()

    }

    update() {
        this._setDirection();
        this.snake.update(this.direction)
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
        const randX = Phaser.Math.Between(1, AppConstants.GRID_LENGTH - 1);
        const randY = Phaser.Math.Between(1, AppConstants.GRID_HEIGHT - 1);
        const actualX = randX * AppConstants.BODY_SIZE + AppConstants.GAME_BORDER_X;  //grid position * size adjusted for where border starts and how big the border is
        const actualY = randY * AppConstants.BODY_SIZE + AppConstants.GAME_BORDER_Y;
        return [actualX, actualY];
    }

    _createGameBorder() {

        const gridWidth = AppConstants.BODY_SIZE * AppConstants.GRID_LENGTH;
        const gridHeight = AppConstants.BODY_SIZE * AppConstants.GRID_HEIGHT;
        const halfGridWidth = gridWidth / 2;
        const halfGridHeight = gridHeight / 2;
        const halfBorderThickness = AppConstants.GAME_BOARD_THICKNESS / 2;

        const gameBorderX = AppConstants.GAME_BORDER_X;
        const gameBorderY = AppConstants.GAME_BORDER_Y;

        this.gameBorder = this.physics.add.staticGroup();
        
        this._createBorder(halfGridWidth + gameBorderX, gameBorderY + halfBorderThickness, gridWidth, AppConstants.GAME_BOARD_THICKNESS);
        this._createBorder(halfGridWidth + gameBorderX, gameBorderY + gridHeight - halfBorderThickness, gridWidth, AppConstants.GAME_BOARD_THICKNESS); // Bottom border
        this._createBorder(gameBorderX + halfBorderThickness, halfGridHeight + gameBorderY, AppConstants.GAME_BOARD_THICKNESS, gridHeight); // Left border
        this._createBorder(gameBorderX + gridWidth - halfBorderThickness, halfGridHeight + gameBorderY, AppConstants.GAME_BOARD_THICKNESS, gridHeight); // Right border
    }

    _createBorder(x: number, y: number, width: number, height: number) {
        this.gameBorder.create(x, y, 'border', null, true)
            .setDisplaySize(width, height)
            .refreshBody();
    };

}
