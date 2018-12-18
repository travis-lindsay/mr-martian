import { InventoryItem } from "../InventoryItem";

export class Engine extends InventoryItem
{
    public name : string = "Engine";
    constructor() {
        super('./src/IMG/roverparts/roverengine.png');
    }
}