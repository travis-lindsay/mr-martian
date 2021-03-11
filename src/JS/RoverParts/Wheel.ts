import { InventoryItem } from "../InventoryItem";

export class Wheel extends InventoryItem
{
    constructor() {
        super('Wheel', 'Wheel for rover', './src/IMG/roverparts/roverwheel.png', 1);
    }
}