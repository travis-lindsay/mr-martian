
import { Attackable } from "./Attackable";
import { Direction } from "./FinalGame";
import { delay } from "./FinalGame";

export class Spaceman extends Attackable {

    sprite: Phaser.Sprite;
    game: Phaser.Game;
    remainingAnimationFrames : number = 0; // For animations that should be played all the way through, (e.g. non-moving actions like attacking).
    lastDirection : Direction = Direction.RIGHT;
    overlappingEnemies: Attackable[] = new Array();
    healthText : Phaser.Text | undefined;
    healthbar : Phaser.Graphics;
    healthLabel : Phaser.Text;
    totalhp : number = 100;
    lasthp : number = -1;
    public static PLAYER_SPEED : number = 300;
    public static MOVE_ANIM_SPEED : number = 7;
    lastThrowTime : number = 0;
    throwCooldown : number = 500; // ms
    throwCallback : () => void;

    constructor(game : Phaser.Game, name : string, healthText : Phaser.Text | undefined, throwCallback : () => void) {
        super(100, 500, 15);
        this.game = game;
        this.healthText = healthText;
        this.throwCallback = throwCallback;
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

        // HEALTH BAR
        this.healthbar = game.add.graphics(0,0);
        const style = { font: "bold 16px Arial", fill: "#ffffff" };
        this.healthLabel = this.game.add.text(this.game.width - 270, 20, "Player Health", style);
        this.updateHealthBar();
    }

    public updateHealthBar() {
        const width = 250;
        const height = 20;
        const x = this.game.width - 270;
        const y = 45;

        if (this.lasthp !== this.health) {    
            this.healthbar.clear();    
            
            // Background
            this.healthbar.beginFill(0x333333);
            this.healthbar.drawRect(x, y, width, height);
            this.healthbar.endFill();

            let percentHealth = (this.health / this.totalhp) * 100;    
            let color : number;
            if (percentHealth < 33) {
                color = 0xe82929;
            } else if (percentHealth < 66) {
                color = 0xffcf1f;
            } else {
                color = 0x66d520;
            }       
            this.healthbar.beginFill(color);    
            this.healthbar.drawRect(x, y, width * (percentHealth / 100), height);    
            this.healthbar.endFill();

            // Border
            this.healthbar.lineStyle(2, 0xffffff, 1);
            this.healthbar.drawRect(x, y, width, height);
        }
        this.lasthp = this.health;
    }

    public animate() {
        // Spaceman should always be the frontmost
        this.sprite.bringToTop();
        this.game.world.bringToTop(this.healthbar);
        this.game.world.bringToTop(this.healthLabel);
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
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.J)) {
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
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.K)) {
            // Throw shovel
            let currentTime = this.game.time.now;
            if (currentTime - this.lastThrowTime > this.throwCooldown) {
                this.lastThrowTime = currentTime;
                if (this.lastDirection == Direction.RIGHT) {
                    this.sprite.animations.play("hitShovelRight", Spaceman.MOVE_ANIM_SPEED, false);
                } else {
                    this.sprite.animations.play("hitShovelLeft", Spaceman.MOVE_ANIM_SPEED, false);
                }
                nothingIsPressed = false;
                if (this.remainingAnimationFrames <= 0) {
                    this.remainingAnimationFrames += 30;
                }
                this.throwCallback();
            }
        } else {
            this.attacking = false;
        }
        // If nothing is being pressed, go to default
        if (nothingIsPressed) {
            this.sprite.body.velocity.x = 0;
        }
        if (this.remainingAnimationFrames <= 0 &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.J) &&
            !this.game.input.keyboard.isDown(Phaser.Keyboard.K) &&
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
            while (this.attacking && victim.alive && this.alive) {
                victim.getAttacked(this.attackDamage);
                await delay(this.attackSpeed);
            }
            this.attacking = false;
        })();
    }

    public getAttacked(damage : number) {
        if (this.health - damage > 0) {
            this.health -= damage;
        } else {
            this.health = 0;
            this.alive = false;
            this.attacking = false;
        }
        if (this.healthText) {
            this.healthText.setText("Health: " + this.health);
        }
        this.updateHealthBar();
    }

    public addSetOverlappingEnemy(enemy : Attackable) {
        this.overlappingEnemies.push(enemy);
    }

    public resetOverlappingEnemies() {
        this.overlappingEnemies.length = 0;
    }
}