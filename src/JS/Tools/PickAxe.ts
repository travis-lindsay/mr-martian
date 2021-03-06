import { InventoryItem } from "../InventoryItem";

export class PickAxe extends InventoryItem
{
    public static bonusResource : number = 5;
    constructor() {
        super('Pick Axe', 'Improves mining efficiency', './src/IMG/tools/pickaxe.png');
    }
}