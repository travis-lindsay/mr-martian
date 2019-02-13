import { Sprite } from "phaser-ce";
import { Player } from "../Player";
import { gameApp } from "../game";

enum Direction {
    LEFT,
    RIGHT
}
/*
    Main class for the final game, includes main setup configurations, etc.
*/
export class FinalGame {

    player: Player;
    spaceman: any;
    ground: any;
    ship: any;
    mountains: any;
    remainingAnimationFrames: number = 0; // For animations that should be played all the way through, (e.g. non-moving actions).
    lastDirection: Direction = Direction.RIGHT;

    constructor() {

        this.player = gameApp.getCurrentPlayer();

        this.game = new Phaser.Game(
            1200, 
            600, 
            Phaser.AUTO, 
            'content', 
            { 
                preload: this.preload, 
                create: this.create,
                update: this.update
            },
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
        this.remainingAnimationFrames = 0;
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('mountains', './src/IMG/finalgame/mountains.png');
        this.game.load.image('ship', './src/IMG/finalgame/ship.png');
        this.game.load.spritesheet('spaceman', './src/IMG/spaceman/spaceman' + gameApp.getCurrentPlayer().number + '_sprite.png', 100, 100);
        this.game.load.image('ground', './src/IMG/finalgame/ground.png');
    }

    create() {
        // Must initialize here, or the phaser library makes them undefined for some reason
        this.remainingAnimationFrames = 0;
        this.lastDirection = Direction.RIGHT;
        this.player = gameApp.getCurrentPlayer();

        this.game.stage.backgroundColor = "#636060";

        // Background mountains
        this.mountains = this.game.add.image(0, 0, 'mountains');

        // Ship... sprite eventually that shows damage
        this.ship = this.game.add.sprite(10, this.game.height - 450, 'ship');
        
        this.spaceman = this.game.add.sprite(100, 450, 'spaceman');

        //  Here we add a new animation called "walk"
        //  Because we didn't give any other parameters it"s going to make an animation from all available frames in the "mummy" sprite sheet
        this.spaceman.animations.add("moveRight", [1,2]);
        this.spaceman.animations.add("moveLeft", [3,4]);
        this.spaceman.animations.add("hitShovelRight", [9,10]);
        this.spaceman.animations.add("hitShovelLeft", [11,12]);

        // Ground sprite
        this.ground = this.game.add.tileSprite(0,this.game.height-50,this.game.world.width,50,'ground');

        // Start the ARCADE Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable physics on the player sprite
        this.game.physics.enable(this.spaceman, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;
        this.ship.body.immovable = true;
        this.ship.body.allowGravity = false;

        // Set the sprite to collide with the worlds edge
        //this.spaceman.body.collideWorldBounds = true;

        // So there is a slight bounce when he hits the ground
        //this.spaceman.body.bounce.y = .3;

        // Set the physics engines overall gravity.  98 == 98 pixels per second in this demo
        this.game.physics.arcade.gravity.y = 120;
    }

    private hitGround() : void {
        console.log('hit ground');
    }

    private jump() : void {
        console.log("jump");
    }

    moveLeft() {
        console.log("left");
        this.spaceman.x -= 4;
        this.spaceman.animations.play("moveLeft", 5, true);
    }

    moveRight() {
        console.log("right");
        this.spaceman.x += 4;
        this.spaceman.animations.play("moveRight", 5, true);
    }

    down() {
        console.log("down");
        this.spaceman.y -= 4;
    }

    update() {
        // Check for collisions
        this.game.physics.arcade.collide(this.spaceman, this.ground, this.hitGround, undefined, this);

        let nothingIsPressed : Boolean = true;
        if (this.spaceman.x >= this.game.width) {
            alert("hit right wall");
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) // LEFT
        {
            this.spaceman.body.velocity.x = -200;
            if (this.remainingAnimationFrames <= 0) {
                this.spaceman.animations.play("moveLeft", 5, true);
            }
            this.lastDirection = Direction.LEFT;
            nothingIsPressed = false;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) // RIGHT
        {
            this.spaceman.body.velocity.x = 200;
            if (this.remainingAnimationFrames <= 0) {
                this.spaceman.animations.play("moveRight", 5, true);
            }
            this.lastDirection = Direction.RIGHT;
            nothingIsPressed = false;
        }
    
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) // JUMP
        {
            if (this.spaceman.body.touching.down) {
                nothingIsPressed = false;
                this.spaceman.body.velocity.y = -150;
            }
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) // CROUCH
        {
            // TODO, crouch or something? Do nothing?
            // this.spaceman.y += 4;
            // nothingIsPressed = false;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            // Hit with shovel
            if (this.lastDirection == Direction.RIGHT) {
                this.spaceman.animations.play("hitShovelRight", 5, false);
            } else {
                this.spaceman.animations.play("hitShovelLeft", 5, false);
            }
            nothingIsPressed = false;
            if (this.remainingAnimationFrames <= 0) {
                this.remainingAnimationFrames += 30;
            }
        }
        // If nothing is being pressed, go to default
        if (nothingIsPressed) {
            this.spaceman.body.velocity.x = 0;
        }
        if (this.remainingAnimationFrames <= 0 &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.A) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.S) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.W) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.spaceman.animations.stop();
            this.spaceman.frame = 0;
        } else if (this.remainingAnimationFrames > 0) {
            this.remainingAnimationFrames -= 1;
        }
    }
}