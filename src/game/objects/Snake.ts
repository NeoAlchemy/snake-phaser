import { GameObjects, Physics, Scene } from 'phaser';

export class Snake extends Physics.Arcade.Group
{
    private frameCount: number = 0;
    private BODY_SIZE: number = 20;

    constructor(scene: Scene, x: number, y: number) {
        super(scene.physics.world, scene); 
        
        const BODY_START_LENGTH = 5;

        const graphics = scene.add.graphics();
        graphics.fillStyle(0x2F5300, 1); 
        graphics.fillRect(0, 0, this.BODY_SIZE, this.BODY_SIZE);
        graphics.setVisible(false);
        graphics.generateTexture('bodyTexture', this.BODY_SIZE, this.BODY_SIZE);
        
        let snakeGroup: Array<GameObjects.Sprite> = [];
        for (let i = 0; i < BODY_START_LENGTH; i++) {
            let bodyPart = new GameObjects.Sprite(scene, x + i * this.BODY_SIZE, y, 'bodyTexture');
            bodyPart.setInteractive(true);
            snakeGroup.push(bodyPart);
            scene.add.existing(bodyPart);
        }

        this.addMultiple(snakeGroup); 
    }

    update(direction: string) {
        const MAX_FRAME_RATE = 20;

        this.frameCount++;
        if (this.frameCount > MAX_FRAME_RATE) {
            if (!this.getChildren().length) return;
            let head = this.getFirst(true) as GameObjects.Sprite; // Type casting to Sprite
            let tail = this.getLast(true) as GameObjects.Sprite;

            head.x = tail.x;
            head.y = tail.y;

            this.remove(head)
            switch (direction) {
                case 'UP':
                head.y -= this.BODY_SIZE;
                break;
                case 'DOWN':
                head.y += this.BODY_SIZE;
                break;
                case 'LEFT':
                head.x -= this.BODY_SIZE;
                break;
                case 'RIGHT':
                head.x += this.BODY_SIZE;
                break;
            }
            this.add(head)
        
            this.frameCount = 0;
        }
    }
}