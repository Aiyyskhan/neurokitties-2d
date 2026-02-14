import { CustomSprite } from "phaser";
import PhaserRaycaster from "phaser-raycaster";
import { Genome } from "../neuroevolution/genomes";
import { NeuralNet18 as NeuralNet } from "../neuroevolution/neuralnet";
import * as config from "../config";


declare module "phaser" {
    interface CustomSprite extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        id: number;
    }
}

declare module "phaser" {
    interface Scene {
      raycasterPlugin: PhaserRaycaster;
    }
}

type Point = { 
    x: number; 
    y: number 
};

export class Kitty {
    public base!: CustomSprite;

    public skinLayers: { [key: string]: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody } = {};

    public distance_array: number[] = [];
    
    private number_of_rays!: number;

    private rays: Raycaster.Ray[] = [];
    private raycaster!: Raycaster;
    private graphics!: Phaser.GameObjects.Graphics;
    private brain!: NeuralNet;

    private updateCount: number = 0;
    private speed: number = 0;
    private direction: number = 0;

    public pathTraveled = 0;
    public progress: Set<number> = new Set();

    private pause: boolean = false;
    
    constructor(
        private scene: Phaser.Scene, 
        public genome: Genome, 
        public id: number, 
        private x: number, 
        private y: number,
        private angles_of_rays: number[],
        private sprite_scale: number,
        private max_speed: number,
        private sprite_frame: string,
    ) { 
        for (let i = 0; i < config.KITTY.LAYERS.length; i++) {
            const layer_name = config.KITTY.LAYERS[i];
            if (layer_name === "Base") {
                this.base = this.scene.physics.add.sprite(this.x, this.y, this.sprite_frame).setScale(this.sprite_scale)
                    .setCollideWorldBounds(true) as CustomSprite;
                this.skinLayers[layer_name] = this.base;
            } else {
                this.skinLayers[layer_name] = this.scene.physics.add.sprite(this.x, this.y, this.sprite_frame).setScale(this.sprite_scale)
                    .setCollideWorldBounds(true);
            }
        }

        this.animUpdate("ir");
        
        this.base.setTint(this.genome.COLORS[0] * 16000000);
        this.skinLayers["Paws"].setAlpha(this.genome.COLORS[1]);

        this.base.id = this.id;

        if (this.genome.COLORS[2] <= 0.33) {
            this.skinLayers["HeadPattern0"].setTintFill(this.genome.COLORS[3] * 16000000);
            this.skinLayers["HeadPattern1"].setAlpha(0x000000);
        } else if (this.genome.COLORS[2] <= 0.66) {
            this.skinLayers["HeadPattern0"].setAlpha(0x000000);
            this.skinLayers["HeadPattern1"].setTintFill(this.genome.COLORS[3] * 16000000);
        } else {
            this.skinLayers["HeadPattern0"].setTintFill(this.genome.COLORS[3] * 16000000);
            this.skinLayers["HeadPattern1"].setTintFill(this.genome.COLORS[3] * 16000000);
        }

        if (this.genome.COLORS[4] <= 0.5) {
            this.skinLayers["BodyPattern0"].setTintFill(this.genome.COLORS[5] * 16000000);
            this.skinLayers["BodyPattern1"].setAlpha(0x000000);
        } else {
            this.skinLayers["BodyPattern0"].setAlpha(0x000000);
            this.skinLayers["BodyPattern1"].setTintFill(this.genome.COLORS[5] * 16000000);
        }
        // this.muzzle.setTint(Math.random() * 16000000);
        this.skinLayers["Muzzle"].setAlpha(this.genome.COLORS[6]);
        this.skinLayers["Chest"].setAlpha(this.genome.COLORS[7]);

        this.number_of_rays = this.angles_of_rays.length;

        this.brain = new NeuralNet(genome.BRAIN); //, genome.BRAIN_MASK, genome.dropOut);

    // Attach reference to this Kitty on the sprite for easy lookup

        // Attach reference to this Kitty on the sprite for easy lookup
        if (this.base && typeof this.base.setData === 'function') {
            this.base.setData('kitty', this);
        }
    }

    rayCasterCreate(tileMapLayer: Phaser.Tilemaps.TilemapLayer) {
        this.raycaster = this.scene.raycasterPlugin.createRaycaster({
            debug: {
                enabled: false, //enable debug mode
                maps: true, //enable maps debug
                rays: true, //enable rays debug
                graphics: {
                    ray: 0xff0000, //debug ray color; set false to disable
                    rayPoint: 0xff00ff, //debug ray point color; set false to disable
                    mapPoint: 0x00ffff, //debug map point color; set false to disable
                    mapSegment: 0x0000ff, //debug map segment color; set false to disable
                    mapBoundingBox: 0xff0000 //debug map bounding box color; set false to disable
                }
            }
        });

        this.raycaster.mapGameObjects(tileMapLayer, false, { collisionTiles: [87] });

        for (let i = 0; i < this.number_of_rays; i++) {
            const ray = this.raycaster.createRay();
            ray.setOrigin(200, 200);
            //set ray direction
            ray.setAngleDeg(this.angles_of_rays[i]);
            //cast ray
            // this.intersections.push(ray.cast() as Phaser.Geom.Point);
            this.rays.push(ray);
            this.distance_array.push(0);
        }        

        //for draw rays
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0xff0000} }); //, fillStyle: { color: 0xffffff, alpha: 0.3 } });
    }

    rayCasterUpdate(x: number, y: number) {
        const rayOrigin = { x: x, y: y }; //as Phaser.Geom.Point;
        this.graphics.clear();
        for (const [idx, ray] of this.rays.entries()) {
            ray.setOrigin(x, y);

            const intersection = ray.cast() as Phaser.Geom.Point;
            
            // отрисовка лучей для дебага
            // this.rayDraw(rayOrigin, intersection);
            
            this.distance_array[idx] = this.calculateDistance(rayOrigin, intersection) / 100.0;
        }
    }

    rayDraw(rayStart: Point, rayEnd: Point) {
        this.graphics.strokeLineShape({
            x1: rayStart.x,
            y1: rayStart.y,
            x2: rayEnd.x,
            y2: rayEnd.y
        } as Phaser.Geom.Line);
    }

    calculateDistance(rayStart: Point, rayEnd: Point): number {
        const dx = rayEnd.x - rayStart.x;
        const dy = rayEnd.y - rayStart.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    animUpdate(key_suffix: string): void {
        for (const [key, layer] of Object.entries(this.skinLayers)) {
            layer.play(`${key}_${key_suffix}`, true);
        }
    }

    velocityUpdate(vx: number = 0, vy: number = 0): void {
        for (const layer of Object.values(this.skinLayers)) {
            layer.body.setVelocity(vx, vy);
        }
    }

    sizeUpdate(width: number, height: number): void {
        for (const layer of Object.values(this.skinLayers)) {
            layer.body.setSize(width, height);
        }
    }

    depthUpdate(depth: number): void {
        for (const layer of Object.values(this.skinLayers)) {
            layer.setDepth(depth);
        }
    }

    update(): void {
        // const keys = this.scene.input.keyboard!.createCursorKeys();
        for (const layer of Object.values(this.skinLayers)) {
            layer.body.setVelocity(0);
        }

        // Capture previous position for path tracking
        const oldX = this.base.x;
        const oldY = this.base.y;

        if (!this.pause) {

            this.rayCasterUpdate(this.base.x, this.base.y);

            const radFactor = Math.PI / 180;

            const action = this.brain.forward(this.distance_array);

            // if (this.id === 0) {
            //     console.log(`Distance array: ${this.distance_array}`);                
            // }

            this.updateCount++;
            if (this.updateCount === 10) {
                this.speed = (action[0] * this.max_speed + this.speed) / 2.0;
                this.direction = ((action[1] - action[2]) + this.direction) / 2.0;

                this.updateCount = 0;
            }

            // if (keys.up.isDown) {
            if (this.speed > 0 && (this.direction >= -0.5 && this.direction < 0)) {
                this.velocityUpdate(0, -this.speed);
                this.sizeUpdate(16, 24);
                
                this.animUpdate("wb");

                const wb = [180,225,270,315,360]; //[-180,-135,-90,-45,0];
                this.rays.forEach((ray: Raycaster.Ray, idx: number) => {
                    ray.setAngle(radFactor * wb[idx]);
                });          
            // } else if (keys.down.isDown) {
            } else if (this.speed > 0 && (this.direction >= 0.5 && this.direction < 1)) {
                this.velocityUpdate(0, this.speed);
                this.sizeUpdate(16, 24);
                
                this.animUpdate("wf");
                
                const wf = [0,45,90,135,180]; //[0,45,90,135,180];
                this.rays.forEach((ray: Raycaster.Ray, idx: number) => {
                    ray.setAngle(radFactor * wf[idx]);
                });
            // } else if (keys.left.isDown) {
            } else if (this.speed > 0 && (this.direction >= -1 && this.direction < -0.5)) {
                this.velocityUpdate(-this.speed, 0);
                this.sizeUpdate(32, 24);
                
                this.animUpdate("wl");

                const wl = [90,135,180,225,270]; //[90,135,180,-135,-90];
                this.rays.forEach((ray: Raycaster.Ray, idx: number) => {
                    ray.setAngle(radFactor * wl[idx]);
                });
            // } else if (keys.right.isDown) {
            } else if (this.speed > 0 && (this.direction >= 0 && this.direction < 0.5)) {
                this.velocityUpdate(this.speed, 0);
                this.sizeUpdate(32, 24);
                
                this.animUpdate("wr");
                
                const wr = [270,315,0,45,90]; //[-90,-45,0,45,90];
                this.rays.forEach((ray: Raycaster.Ray, idx: number) => {
                    ray.setAngle(radFactor * wr[idx]);
                });
            } else {
                if (this.base.anims.getName() === "Base_wl") {
                    this.animUpdate("il");
                } else if (this.base.anims.getName() === "Base_wb") {
                    this.animUpdate("ib");
                } else if (this.base.anims.getName() === "Base_wr") {
                    this.animUpdate("ir");
                } else if (this.base.anims.getName() === "Base_wf") {
                    this.animUpdate("if");
                }
            }
        } else {
            if (this.base.anims.getName() === "Base_wl") {
                this.animUpdate("il");
            } else if (this.base.anims.getName() === "Base_wb") {
                this.animUpdate("ib");
            } else if (this.base.anims.getName() === "Base_wr") {
                this.animUpdate("ir");
            } else if (this.base.anims.getName() === "Base_wf") {
                this.animUpdate("if");
            }
        }
    // Update path traveled (accumulate euclidean distance in pixels)
    const dx = this.base.x - oldX;
    const dy = this.base.y - oldY;
    this.pathTraveled += Math.sqrt(dx * dx + dy * dy);

    this.x = this.base.x;
    this.y = this.base.y;

        this.depthUpdate(this.y);
    }

    handlePause(pause_state: boolean): void {
        this.pause = pause_state;
    }

    destroy(): void {
        this.brain.dispose();
        
        for (const [key, layer] of Object.entries(this.skinLayers)) {
            layer.destroy();
            delete this.skinLayers[key];
        }

        this.rays.forEach(ray => ray.destroy());
        this.rays.length = 0;
        this.graphics.destroy();
    }
}