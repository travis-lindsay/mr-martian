import { InventoryItem } from "../InventoryItem";

export class RandomEvent {
    public description : string;
    public healthAmount : number;
    public moraleAmount : number;
    public foodAmount : number;
    public waterAmount : number;
    public stoneAmount : number;
    public inventoryItems : Array<InventoryItem> | null;

    constructor(desc : string, healthAmount : number, moraleAmount : number, foodAmount : number, waterAmount : number, 
        stoneAmount : number, inventoryItems : Array<InventoryItem> | null) {
        this.description = desc;
        this.healthAmount = healthAmount;
        this.moraleAmount = moraleAmount;
        this.foodAmount = foodAmount;
        this.waterAmount = waterAmount;
        this.stoneAmount = stoneAmount;
        this.inventoryItems = inventoryItems;
    }
}