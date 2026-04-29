import { Attackable } from "./Attackable";
export class Ship extends Attackable {
    game : Phaser.Game;
    sprite : Phaser.Sprite;
    // Health bar 
    lasthp : number = -1;
    totalhp : number = 500;
    healthbar : Phaser.Graphics;
    healthLabel : Phaser.Text;

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
        
        const style = { font: "bold 16px Arial", fill: "#ffffff" };
        this.healthLabel = this.game.add.text(20, 20, "Rocket Ship Health", style);
        
        this.updateHealthBar();
        this.game.world.bringToTop(this.healthbar);
        this.game.world.bringToTop(this.healthLabel);
    }

    public getAttacked(damage : number) {
        if (this.health - damage > 0) {
            this.health -= damage;
            this.updateHealthBar();
        } else {
            this.health = 0;
            this.alive = false;
            this.attacking = false;
            this.sprite.destroy(true);
            this.healthbar.clear();
            this.healthLabel.destroy();
        }
    }

    public updateHealthBar() {
        const width = 250;
        const height = 20;
        const x = 20;
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
}
