import { GameObjects, Physics, Scene } from 'phaser';

export class Snake extends Physics.Arcade.Group
{
    private frameCount: number = 0;
    private BODY_SIZE: number = 20;
    private direction: string = 'RIGHT';

    constructor(scene: Scene, x: number, y: number) {
        super(scene.physics.world, scene); 
        
        const BODY_START_LENGTH = 5;
        let snakeGroup: Array<GameObjects.Sprite> = [];

        const graphics = scene.add.graphics();
        graphics.setVisible(false);
        graphics.fillStyle(0x2F5300, 1); 
        graphics.fillRect(0, 0, this.BODY_SIZE, this.BODY_SIZE);
        graphics.generateTexture('bodyTexture', this.BODY_SIZE, this.BODY_SIZE);
        
        
        for (let i = 0; i < BODY_START_LENGTH; i++) {
            let bodyPart = new GameObjects.Sprite(scene, x + i * this.BODY_SIZE, y, 'bodyTexture');
            snakeGroup.push(bodyPart);
        }
        

        this.addMultiple(snakeGroup, true); 
    }

    update(direction: string) {
        const MAX_FRAME_RATE = 10;
        this.direction = direction;
        this.frameCount++;
        if (this.frameCount > MAX_FRAME_RATE) {
            if (!this.getChildren().length) return;
    
            // Get all body parts in reverse order (from tail to head)
            const bodyParts = this.getChildren() as GameObjects.Sprite[];
            
            // Move each part to the position of the part in front of it
            // for (let i = bodyParts.length - 1; i > 0; i--) {
            //     bodyParts[i].x = bodyParts[i - 1].x;
            //     bodyParts[i].y = bodyParts[i - 1].y;
            // }
    
            // Move the head in the given direction
            let head = bodyParts.shift(); // Head is the first element
            if (!head) return;
            head.y = bodyParts[bodyParts.length - 1].y;
            head.x = bodyParts[bodyParts.length - 1].x;

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
              y -= this.BODY_SIZE;
              break;
            case 'DOWN':
              y += this.BODY_SIZE;
              break;
            case 'LEFT':
              x -= this.BODY_SIZE;
              break;
            case 'RIGHT':
              x += this.BODY_SIZE;
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
}