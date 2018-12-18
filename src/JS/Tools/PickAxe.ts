import { InventoryItem } from "../InventoryItem";

export class PickAxe extends InventoryItem
{
    public name : string = "Pick Axe";
    constructor() {
        super('./src/IMG/tools/pickaxe.png');
    }
}