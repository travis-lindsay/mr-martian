import { InventoryItem } from "../InventoryItem";

export class Frame extends InventoryItem
{
    constructor() {
        super('Frame', 'Frame for rover', './src/IMG/roverparts/roverframe.png', 1);
    }
}