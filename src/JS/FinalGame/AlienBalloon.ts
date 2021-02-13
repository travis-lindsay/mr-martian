import { Attackable } from "./Attackable";
import { Enemy } from "./Enemy";
import { delay } from "./FinalGame";

export class AlienBalloon extends Attackable implements Enemy {

    sprite: Phaser.Sprite;
    game: Phaser.Game;
    atShip: boolean = false;
    atPlayer: boolean = false;
    // Health bar 
    lasthp : number = 0;
    totalhp : number = 100;
    healthbar : Phaser.Graphics;

    constructor(game : Phaser.Game, name : string, startXPosition = game.width) {
        super(100, 750, 3);
        this.game = game;
        this.sprite = this.game.add.sprite(startXPosition, 100, 'alienballoon');
        this.sprite.name = name;
        // Physics must be enabled on a sprite before the sprite.body property can be accessed
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.animations.add("attack", [0,1]);
        this.sprite.animations.add("moveLeft", [2,3]);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.setSize(50, 150, 40, 0);

        // Default animation
        this.sprite.animations.play("moveLeft", 4, true);
        this.sprite.body.velocity.x = -100;

        // HEALTH BAR
        this.healthbar = game.add.graphics(0,0);
        this.sprite.addChild(this.healthbar);
    }

    public updateHealthBar() {
        const width = 100;
        if (this.lasthp !== this.health) {    
            this.healthbar.clear();    
            let percentHealth = (this.health / this.totalhp) * 100;    
            let color : any;// Utils.rgbToHex((x > 50 ? 1-2*(x-50)/100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2*x/100.0) * 255, 0);
            if (percentHealth < 33) {
                color = "0xe82929";
            } else if (percentHealth < 66) {
                color = "0xffcf1f";
            } else {
                color = "0x66d520";
            }       
            this.healthbar.beginFill(color);    
            this.healthbar.lineStyle(5, color, 1);    
            this.healthbar.moveTo(0,-5);    
            this.healthbar.lineTo(width * this.health / this.totalhp, -5);    
            this.healthbar.endFill();
        }
        this.lasthp = this.health;
    }

    public hitShip(ship : Attackable) {
        this.atShip = true;
        if (!this.attacking) {
            this.attack(ship);
        }
    }

    public hitPlayer(spaceman : Attackable) {
        this.atPlayer = true;
        if (!this.attacking) {
            this.attack(spaceman);
        }
    }

    public animate() {
        if (this.atShip == true || this.atPlayer == true) {
            this.sprite.body.velocity.x = 0;
            this.sprite.animations.play("attack", 4, false);
        } else {
            this.stopAttacking();
            this.sprite.animations.play("moveLeft", 4, true);
            this.sprite.body.velocity.x = -100;
        }
        this.resetAtBooleans();
    }

    private resetAtBooleans() {
        this.atShip = false;
        this.atPlayer = false;
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
            this.updateHealthBar();
        } else {
            this.health = 0;
            this.alive = false;
            this.sprite.destroy(true);
        }
    }
}