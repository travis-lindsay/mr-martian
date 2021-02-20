import { InventoryItem } from "../InventoryItem";

export class Shovel extends InventoryItem
{
    constructor() {
        super('Shovel','Great for digging, and not bad for self defense','./src/IMG/tools/shovel.png');
    }
}