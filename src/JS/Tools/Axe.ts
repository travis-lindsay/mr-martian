import { InventoryItem } from "../InventoryItem";

export class Axe extends InventoryItem
{
    public static damage : number = 15;
    constructor() {
        super('Axe', 'Great for construction, self defense', './src/IMG/tools/axe.png', 1);
    }
}