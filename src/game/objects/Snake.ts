import { GameObjects, Physics, Scene } from 'phaser';
import { AppConstants } from '../util/AppConstants';

export class Snake extends Physics.Arcade.Group
{
    private frameCount: number = 0;
    private direction: string = 'RIGHT';

    constructor(scene: Scene, x: number, y: number) {
        super(scene.physics.world, scene); 
        
        let snakeGroup: Array<GameObjects.Sprite> = [];

        if (!scene.textures.exists('bodyTexture')) {
            const graphics = scene.add.graphics();
            graphics.setVisible(false);
            graphics.fillStyle(AppConstants.FOREGROUND_COLOR, 1); 
            graphics.fillRect(0, 0, AppConstants.BODY_SIZE, AppConstants.BODY_SIZE);
            graphics.generateTexture('bodyTexture', AppConstants.BODY_SIZE, AppConstants.BODY_SIZE);
        }
        
        for (let i = 0; i < AppConstants.BODY_START_LENGTH; i++) {
            let bodyPart = this.scene.physics.add.sprite(x + i * AppConstants.BODY_SIZE, y, 'bodyTexture');
            snakeGroup.push(bodyPart);
        }
        

        this.addMultiple(snakeGroup, true); 
    }

    update(direction: string) {
        
        this.direction = direction;
        this.frameCount++;
        if (this.frameCount > AppConstants.MAX_FRAME_RATE) {
            if (!this.getChildren().length) return;
    
            const bodyParts = this.getChildren() as GameObjects.Sprite[];

            // Move the head in the given direction
            let head = bodyParts.shift(); // Head is the first element
            if (!head) return;
            head.y = bodyParts[bodyParts.length - 1].y;
            head.x = bodyParts[bodyParts.length - 1].x;

            switch (direction) {
                case 'UP':
                    head.y -= AppConstants.BODY_SIZE;
                    break;
                case 'DOWN':
                    head.y += AppConstants.BODY_SIZE;
                    break;
                case 'LEFT':
                    head.x -= AppConstants.BODY_SIZE;
                    break;
                case 'RIGHT':
                    head.x += AppConstants.BODY_SIZE;
                    break;
            }

            this._onSnakeHitSnake(head as Phaser.Types.Physics.Arcade.GameObjectWithBody, bodyParts);
            this.add(head);
            this.frameCount = 0;
        }
    }

    grows() {
        // Get the tail (last segment)
        let tail = this.getLast(true) as GameObjects.Sprite;
        let x: number = tail.x;
        let y: number = tail.y;
        // Determine the new segment's position based on the current tail's position
        switch (this.direction) {
            case 'UP':
              y -= AppConstants.BODY_SIZE;
              break;
            case 'DOWN':
              y += AppConstants.BODY_SIZE;
              break;
            case 'LEFT':
              x -= AppConstants.BODY_SIZE;
              break;
            case 'RIGHT':
              x += AppConstants.BODY_SIZE;
              break;
          }

        // Add the new body part at the same position as the last segment (it will move correctly on the next update)
        this.add(this._getBodyPart(x, y), true);
    }

    _getBodyPart(x: number, y: number) {
        let bodyPart = new GameObjects.Sprite(this.scene, x, y, 'bodyTexture');
        this.scene.add.existing(bodyPart);
        return bodyPart
    }

    _onSnakeHitSnake(head: Phaser.Types.Physics.Arcade.GameObjectWithBody, bodyParts: GameObjects.Sprite[]) {
        this.scene.physics.add.overlap(head, bodyParts, () => {
            this.scene.scene.restart()
            this.direction = "RIGHT"
        });
    }
}