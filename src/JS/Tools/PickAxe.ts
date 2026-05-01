import { InventoryItem } from "../InventoryItem";

export class PickAxe extends InventoryItem
{
    public static bonusResource : number = 5;
    public static damage : number = 10;
    constructor() {
        super('Pick Axe', 'Improves mining efficiency', './src/IMG/tools/pickaxe.png', 1);
    }
}