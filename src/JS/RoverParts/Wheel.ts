import { InventoryItem } from "../InventoryItem";

export class Wheel extends InventoryItem
{
    public name : string = "Wheel";
    constructor() {
        super('./src/IMG/roverparts/roverwheel.png');
    }
}