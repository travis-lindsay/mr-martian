import { InventoryItem } from "../InventoryItem";

export class Spear extends InventoryItem
{
    constructor() {
        super('Spear', 'Long thin stick with a sharp rock on the end, great for poking things', './src/IMG/tools/spear.png', 1);
    }
}