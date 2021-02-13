/*
    Any person who can be attacked, is also attackable
    base class that contains health, life, attacking methods, etc.
*/
export class Attackable {
    health : number;
    attackSpeed: number; // In milliseconds
    attackDamage: number;
    alive : boolean = true;
    attacking : boolean = false;

    constructor(health : number, attackSpeed : number, attackDamage : number) {
        this.health = health;
        this.attackSpeed = attackSpeed;
        this.attackDamage = attackDamage;
    }

    public attack(victim : Attackable) {
        // To be implemented in child class... TODO, make this an interface?
    }

    public stopAttacking() {
        this.attacking = false;
    }

    public getAttacked(damage : number) {
        // To be implemented in child class
    }
}