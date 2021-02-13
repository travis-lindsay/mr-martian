import { Attackable } from "./Attackable";
export class Ship extends Attackable {
    game : Phaser.Game;
    sprite : Phaser.Sprite;
    // Health bar 
    lasthp : number = 0;
    totalhp : number = 500;
    healthbar : Phaser.Graphics;

    constructor(game : Phaser.Game, name : string) {
        super(500, 0, 0);
        this.game = game;
        this.sprite = this.game.add.sprite(10, this.game.height - 450, 'ship');
        // Physics must be enabled on a sprite before the sprite.body property can be accessed
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        
        this.sprite.body.immovable = true;
        this.sprite.body.allowGravity = false;
        this.sprite.body.setSize(200, 400, 50, 0);

        // HEALTH BAR
        this.healthbar = game.add.graphics(0,0);
        this.healthbar.moveTo(100, 100);
        this.updateHealthBar();
        this.game.world.bringToTop(this.healthbar);
        // this.sprite.addChild(this.healthbar);
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

    public updateHealthBar() {
        const width = 200;
        if (this.lasthp !== this.health) {    
            this.healthbar.clear();    
            let percentHealth = (this.health / this.totalhp) * 100;    
            let color : any;
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
            this.healthbar.lineTo(width * (percentHealth / 100), -5);    
            this.healthbar.endFill();
        }
        this.lasthp = this.health;
    }
}
