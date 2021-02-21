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
    await new Promise(resolve => setTimeout(()=>resolve(null), 1000)).then(); 
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

        // Text
        var style = { 
            font: "15px Arial",
            fontWeight: "bolder",
            fill: "#2c2c2c", 
            align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
            boundsAlignH: "left", 
            boundsAlignV: "top", 
            wordWrap: true, 
            wordWrapWidth: 300,
        };
        this.spacemanText = this.game.add.text(0, 0, "Health: " + this.player.health, style);
        this.spacemanText.setTextBounds(16, 16, 768, 568);
        this.spaceman = new Spaceman(this.game, this.player.name, this.spacemanText);
        
        // Enable physics on the player sprite
        //this.game.physics.enable(this.spaceman, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        // this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // Set the physics engines overall gravity, 120 pixels per second
        this.game.physics.arcade.gravity.y = 120;
    }

    private hitGround() : void {
        // This does nothing right now...
    }

    update() {
        this.spaceman.resetOverlappingEnemies();
        // Check for collisions     
        this.game.physics.arcade.collide(this.spaceman.sprite, this.ground, this.hitGround, undefined, this);
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

        this.spaceman.animate();
        
        // Do AI animations
        for (let key in this.enemyDict) {
            let enemyObj : Enemy = this.enemyDict[key];
            if (enemyObj.alive) {
                enemyObj.animate();
            } else {
                delete this.enemyDict[key];
                if (this.count % 2 == 0) {
                    let sharkBoi : Shark = new Shark(this.game, this.enemyCount.toString());
                    this.enemyDict[sharkBoi.sprite.name] = sharkBoi;
                } else {
                    let alienBoi : AlienBalloon = new AlienBalloon(this.game, this.enemyCount.toString());
                    this.enemyDict[alienBoi.sprite.name] = alienBoi;
                }
                this.count += 1;
                this.enemyCount += 1;
            }
        }
    }
}