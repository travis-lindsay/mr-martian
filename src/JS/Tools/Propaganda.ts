import { InventoryItem } from "../InventoryItem";

export class Propaganda extends InventoryItem
{
    constructor() {
        super('Anti-alien propaganda', 'Flashy poster with some anti-alien sentiment.', './src/IMG/tools/propaganda.png', 1);
    }
}