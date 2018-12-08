import { InventoryItem } from "../InventoryItem";

export class Frame extends InventoryItem
{
    public name : string = "Frame";
    constructor() {
        super('./src/IMG/roverparts/roverframe.png');
    }
}