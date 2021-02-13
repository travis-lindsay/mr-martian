
import { Attackable } from "./Attackable";
import { Direction } from "./FinalGame";
import { delay } from "./FinalGame";

export class Spaceman extends Attackable {

    sprite: Phaser.Sprite;
    game: Phaser.Game;
    remainingAnimationFrames : number = 0; // For animations that should be played all the way through, (e.g. non-moving actions like attacking).
    lastDirection : Direction = Direction.RIGHT;
    overlappingEnemies: Attackable[] = new Array();
    healthText : Phaser.Text;
    public static PLAYER_SPEED : number = 300;
    public static MOVE_ANIM_SPEED : number = 7;

    constructor(game : Phaser.Game, name : string, healthText : Phaser.Text) {
        super(100, 500, 15);
        this.game = game;
        this.healthText = healthText;
        this.sprite = this.game.add.sprite(300, 300, 'spaceman');
        this.sprite.name = name;
        // Physics must be enabled on a sprite before the sprite.body property can be accessed
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        // Defining sprite animations
        this.sprite.animations.add("moveRight", [1,2]);
        this.sprite.animations.add("moveLeft", [3,4]);
        this.sprite.animations.add("hitShovelRight", [10,9]);
        this.sprite.animations.add("hitShovelLeft", [12,11]);

        // Set the sprite to collide with the worlds edge
        this.sprite.body.collideWorldBounds = true;
        // Set the sprite collision box size, so the transparent space on the image doesn't make it look weird
        this.sprite.body.setSize(50, 100, 25, 0);
    }

    public animate() {
        // Spaceman should always be the frontmost
        this.sprite.bringToTop();
        let nothingIsPressed : Boolean = true;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) // LEFT
        {
            this.sprite.body.velocity.x = -Spaceman.PLAYER_SPEED;
            if (this.remainingAnimationFrames <= 0) {
                this.sprite.animations.play("moveLeft", Spaceman.MOVE_ANIM_SPEED, true);
            }
            this.lastDirection = Direction.LEFT;
            nothingIsPressed = false;
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) // RIGHT
        {
            this.sprite.body.velocity.x = Spaceman.PLAYER_SPEED;
            if (this.remainingAnimationFrames <= 0) {
                this.sprite.animations.play("moveRight", Spaceman.MOVE_ANIM_SPEED, true);
            }
            this.lastDirection = Direction.RIGHT;
            nothingIsPressed = false;
        }
    
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) // JUMP
        {
            if (this.sprite.body.touching.down) {
                nothingIsPressed = false;
                this.sprite.body.velocity.y = -150;
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
                this.sprite.animations.play("hitShovelRight", Spaceman.MOVE_ANIM_SPEED, false);
            } else {
                this.sprite.animations.play("hitShovelLeft", Spaceman.MOVE_ANIM_SPEED, false);
            }
            nothingIsPressed = false;
            if (this.remainingAnimationFrames <= 0) {
                this.remainingAnimationFrames += 30;
            }
            if (!this.attacking) {
                this.attack(this.overlappingEnemies[0]);
            }
        } else {
            this.attacking = false;
        }
        // If nothing is being pressed, go to default
        if (nothingIsPressed) {
            this.sprite.body.velocity.x = 0;
        }
        if (this.remainingAnimationFrames <= 0 &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.A) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.S) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.W) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.sprite.animations.stop();
            this.sprite.frame = 0;
        } else if (this.remainingAnimationFrames > 0) {
            this.remainingAnimationFrames -= 1;
        }
    }

    public attack(victim : Attackable) {
        if (!victim || this.attacking) { return; }
        this.attacking = true;
        let count : number = 0;
        (async () => { 
            while (this.attacking && victim.alive) {
                victim.getAttacked(this.attackDamage);
                await delay(this.attackSpeed);
            }
        })();
    }

    public getAttacked(damage : number) {
        if (this.health - damage > 0) {
            this.health -= damage;
        } else {
            this.health = 0;
            this.alive = false;
        }
        this.healthText.setText("Health: " + this.health);
    }

    public addSetOverlappingEnemy(enemy : Attackable) {
        this.overlappingEnemies.push(enemy);
    }

    public resetOverlappingEnemies() {
        this.overlappingEnemies.length = 0;
    }
}