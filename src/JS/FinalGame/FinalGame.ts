import { Sprite } from "phaser-ce";
import { Player } from "../Player";
import { gameApp } from "../game";
import { Enemy } from "./Enemy";
import { Spaceman } from "./Spaceman";
import { Ship } from "./Ship";
import { Shark } from "./Shark";
import { AlienBalloon } from "./AlienBalloon";

export enum Direction {
    LEFT,
    RIGHT
}

// Delay helper function 
export async function delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(null), ms)); 
}

/*
    Main class for the final game, includes main setup configurations, etc.
*/
export class FinalGame {

    game: Phaser.Game;
    player: Player;
    spaceman: Spaceman | any;
    ground: any;
    ship: Ship | any;
    mountains: any;
    enemyCount: number | any;
    count: number | any;
    spacemanText : Phaser.Text | any;
    // Key, Value pair of Phaser.Sprite objects with 
    enemyObjs: { [s: string]: Phaser.Sprite; } = {};
    // Key, Value pair data structure that stores all enemies
    enemyDict: { [s: string]: Enemy; } = {};
    //remainingAnimationFrames: number = 0; // For animations that should be played all the way through, (e.g. non-moving actions).
    lastDirection: Direction = Direction.RIGHT;
    projectiles: Phaser.Group | any;
    enemies: Phaser.Group | any;

    constructor() {

        this.player = gameApp.getCurrentPlayer();

        this.game = new Phaser.Game(
            1200, 
            600, 
            Phaser.AUTO, 
            'content', 
            this,
            false,
            true, // See what antialiasing effects
            {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            }
        );
    }

    preload() {
        this.game.load.image('mountains', './src/IMG/finalgame/mountains.png');
        this.game.load.image('ship', './src/IMG/finalgame/ship.png');
        this.game.load.spritesheet('spaceman', './src/IMG/spaceman/spaceman' + gameApp.getCurrentPlayer().number + '_sprite.png', 100, 100);
        this.game.load.spritesheet('sharkborg', './src/IMG/finalgame/shark.png', 150, 200);
        this.game.load.spritesheet('alienballoon', './src/IMG/finalgame/alienballoon.png', 100, 150);
        this.game.load.image('ground', './src/IMG/finalgame/ground.png');
        this.game.load.image('shovel', './src/IMG/tools/shovel.png');
    }

    create() {
        // Start the ARCADE Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Must initialize here, or the phaser library makes them undefined for some reason
        this.player = gameApp.getCurrentPlayer();
        
        this.game.stage.backgroundColor = "#636060";
        
        // Background mountains
        this.mountains = this.game.add.image(0, 0, 'mountains');

        // Ground sprite
        this.ground = this.game.add.tileSprite(0,this.game.height-50,this.game.world.width,50,'ground');
        
        // Ship... sprite eventually that shows damage, etc.
        this.ship = new Ship(this.game, "Ship");

        // Add a few enemies
        this.enemyCount = 3;
        this.count = 0;
        for (let i = 0; i < this.enemyCount; i++) {
            if (i == 0) {
                let sharkBoi : Shark = new Shark(this.game, i.toString(), 800);
                this.enemyDict[sharkBoi.sprite.name] = sharkBoi;
            } else if (i == 1) {
                let sharkBoi : Shark = new Shark(this.game, i.toString());
                this.enemyDict[sharkBoi.sprite.name] = sharkBoi;
            } else {
                let balloonBoi : AlienBalloon = new AlienBalloon(this.game, i.toString());
                this.enemyDict[balloonBoi.sprite.name] = balloonBoi;
            }
        }

        let self = this;
        this.spaceman = new Spaceman(this.game, this.player.name, undefined, () => { self.throwShovel(); });
        
        // Enable physics on the player sprite
        //this.game.physics.enable(this.spaceman, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        // this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // Set the physics engines overall gravity, 120 pixels per second
        this.game.physics.arcade.gravity.y = 120;

        // Projectiles group
        this.projectiles = this.game.add.group();
        this.projectiles.enableBody = true;
        this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;

        // Enemies group
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for (let key in this.enemyDict) {
            this.enemies.add(this.enemyDict[key].sprite);
        }
    }

    private hitGround() : void {
        // This does nothing right now...
    }

    private throwShovel() {
        let shovel = this.projectiles.create(this.spaceman.sprite.x, this.spaceman.sprite.y, 'shovel');
        shovel.anchor.setTo(0.5, 0.5);
        shovel.scale.setTo(0.5, 0.5);
        if (this.spaceman.lastDirection == Direction.LEFT) {
            shovel.body.velocity.x = -250;
        } else {
            shovel.body.velocity.x = 250;
        }
        shovel.body.velocity.y = -350;
        shovel.body.angularVelocity = 500;
        shovel.checkWorldBounds = true;
        shovel.outOfBoundsKill = true;
    }

    update() {
        this.spaceman.resetOverlappingEnemies();
        // Check for collisions     
        this.game.physics.arcade.collide(this.spaceman.sprite, this.ground, this.hitGround, undefined, this);
        this.game.physics.arcade.collide(this.spaceman.sprite, this.ship.sprite);
        this.game.physics.arcade.collide(this.projectiles, this.ground, function(shovel : any, ground : any) {
            shovel.kill();
        }, undefined, this);

        // No need to store in group, since I want to use objects individual context variables and callback functions
        let self = this;
        for (let key in this.enemyDict) {
            let enemyObj : Enemy = this.enemyDict[key];
            this.game.physics.arcade.collide(enemyObj.sprite, this.ground, this.hitGround, undefined, enemyObj);
            this.game.physics.arcade.overlap(enemyObj.sprite, this.ship.sprite, function() { 
                enemyObj.hitShip(self.ship);
            }, undefined, enemyObj);
            this.game.physics.arcade.overlap(enemyObj.sprite, this.spaceman.sprite, function() { 
                enemyObj.hitPlayer(self.spaceman);
                self.spaceman.addSetOverlappingEnemy(enemyObj);
            }, undefined, enemyObj);
        }

        // Projectile hits any enemy
        this.game.physics.arcade.overlap(this.projectiles, this.enemies, function(shovel : any, enemySprite : any) {
            let directionalX = (shovel.body.velocity.x > 0) ? 20 : -20;
            shovel.kill();
            
            // Find the enemy object that owns this sprite
            for (let key in self.enemyDict) {
                let enemy = self.enemyDict[key];
                if (enemy.sprite === enemySprite) {
                    if (typeof (enemy as any).push === 'function') {
                        // Balloons always go right, others follow shovel direction
                        let xPush = (enemySprite.key === 'alienballoon') ? 100 : directionalX;
                        (enemy as any).push(xPush, 30);
                    }
                    break;
                }
            }
        }, undefined, this);

        this.spaceman.animate();
        
        // Do AI animations
        for (let key in this.enemyDict) {
            let enemyObj : Enemy = this.enemyDict[key];
            if (enemyObj.alive) {
                enemyObj.animate();
            } else {
                delete this.enemyDict[key];
                let newEnemy : Enemy;
                if (this.count % 2 == 0) {
                    newEnemy = new Shark(this.game, this.enemyCount.toString());
                } else {
                    newEnemy = new AlienBalloon(this.game, this.enemyCount.toString());
                }
                this.enemyDict[newEnemy.sprite.name] = newEnemy;
                this.enemies.add(newEnemy.sprite);

                this.count += 1;
                this.enemyCount += 1;
            }
        }
    }
}