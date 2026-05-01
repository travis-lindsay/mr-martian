import { InventoryItem } from "../InventoryItem";

export class Shovel extends InventoryItem
{
    public static damage : number = 5;
    constructor() {
        super('Shovel','Great for digging, and not bad for self defense','./src/IMG/tools/shovel.png', 1);
    }
}