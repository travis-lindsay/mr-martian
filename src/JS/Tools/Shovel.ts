import { InventoryItem } from "../InventoryItem";

export class Shovel extends InventoryItem
{
    public name : string = "Shovel";
    constructor() {
        super('./src/IMG/tools/shovel.png');
    }
}