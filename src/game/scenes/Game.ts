import { EventBus } from '../EventBus';
import { Snake } from '../objects/Snake';
import { Scene } from 'phaser';


export class Game extends Scene
{
    snake!: Snake;
    gameBorder!: Phaser.GameObjects.Graphics;
    score!: Phaser.GameObjects.Text;


    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x96C400);

        this.score = this.add.text(20, 50, '0', { font: '48px Verdana', color: '#2F5300' });

        const gameBorder = this.add.graphics();
        gameBorder.lineStyle(10, 0x2F5300, 1);
        gameBorder.strokeRect(25, 120, 430, 360);
        this.gameBorder = gameBorder;
        this.physics.add.existing(this.gameBorder);
        this.physics.world.setBounds(25, 120, 430, 368);

        
        //let [x, y] = this._randomPointInGameBorder();
        this.snake = new Snake(this, 125, 180)

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        this.snake.update("RIGHT")
        //this.snake.grows("LEFT")
    }

    _randomPointInGameBorder(): [x: number, y: number] {
        const CELL_SIZE = 20
        const randX = Phaser.Math.Between(0, 20);
        const randY = Phaser.Math.Between(0, 18);
        const actualX = randX * CELL_SIZE + 25;
        const actualY = randY * CELL_SIZE + 120;
        return [actualX, actualY];
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
