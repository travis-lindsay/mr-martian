import { InventoryItem } from "../InventoryItem";

export class PickAxe extends InventoryItem
{
    constructor() {
        super('Pick Axe', 'Improves mining efficiency', './src/IMG/tools/pickaxe.png');
    }
}