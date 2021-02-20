import { InventoryItem } from "../InventoryItem";

export class Engine extends InventoryItem
{
    constructor() {
        super('Engine', 'Engine for rover', './src/IMG/roverparts/roverengine.png');
    }
}