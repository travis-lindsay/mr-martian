import { Attackable } from "./Attackable";

/*
    Base interface for enemies
*/
export interface Enemy extends Attackable {
    sprite: Phaser.Sprite;
    hitShip(s:Attackable): void;
    hitPlayer(p:Attackable): void;
    animate(): void;
    updateHealthBar(): void;
}