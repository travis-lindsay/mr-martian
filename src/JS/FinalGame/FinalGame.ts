/*
    Main class for the final game, includes main setup configurations, etc.
*/
export class FinalGame {

    spaceman: Phaser.Sprite;
    ground: any;

    W: Phaser.Key;
    A: Phaser.Key;
    S: Phaser.Key;
    D: Phaser.Key;

    constructor() {
        this.game = new Phaser.Game(
            1200, 
            700, 
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
    }

    game: Phaser.Game;

    preload() {
        this.game.load.spritesheet('spaceman', '../../src/IMG/spaceman/spaceman0_sprite.png', 100, 100);
        this.game.load.image('ground', '../../src/IMG/finalgame/ground.png');
    }

    create() {
        this.game.stage.backgroundColor = "#636060";
        
        this.spaceman = this.game.add.sprite(100, 450, 'spaceman');

        //  Here we add a new animation called "walk"
        //  Because we didn"t give any other parameters it"s going to make an animation from all available frames in the "mummy" sprite sheet
        this.spaceman.animations.add("moveRight", [1,2]);
        this.spaceman.animations.add("moveLeft", [3,4]);

        // Ground sprite
        this.ground = this.game.add.tileSprite(0,this.game.height-50,this.game.world.width,50,'ground');

        // Start the ARCADE Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable physics on the player sprite
        this.game.physics.enable(this.spaceman, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);

        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        // Set the sprite to collide with the worlds edge
        this.spaceman.body.collideWorldBounds = true;

        // And set bounce in the Y axis ( called restitution in most physics system ) to 1, 
        // which will make it bounce equal to 100 %
        this.spaceman.body.bounce.y = .3;

        // Set the physics engines overall gravity.  98 == 98 pixels per second in this demo
        this.game.physics.arcade.gravity.y = 120;
    }

    private hitGround() : void {
        alert('hit ground');
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
            // this.spaceman.x -= 4;
            this.spaceman.body.velocity.x = -150;
            this.spaceman.animations.play("moveLeft", 5, true);
            nothingIsPressed = false;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) // RIGHT
        {
            // this.spaceman.x += 4;
            this.spaceman.body.velocity.x = 150;
            this.spaceman.animations.play("moveRight", 5, true);
            nothingIsPressed = false;
        }
    
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
        {
            // this.spaceman.body.velocity.y = -4; // Figure out how to set velocity in typescript
            if (this.spaceman.body.touching.down) {
                nothingIsPressed = false;
                this.spaceman.body.velocity.y = -150;
                // TODO, figure out how to get it in a touching down state
            }
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
        {
            // TODO, crouch or something? Do nothing?
            // this.spaceman.y += 4;
            // nothingIsPressed = false;
        }
        // If nothing is being pressed, go to default
        if (nothingIsPressed) {
            this.spaceman.body.velocity.x = 0;
            this.spaceman.animations.stop();
            this.spaceman.frame = 0;
        }
    }
}