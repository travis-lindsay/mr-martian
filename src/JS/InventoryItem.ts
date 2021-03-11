export class InventoryItem {

    public imgPath : string = "";
    public name : string;
    public description : string;
    public amount : number = 0;
    constructor(name : string, description : string, imgPath : string, amount : number) 
    {
        this.name = name;
        this.description = description;
        this.imgPath = imgPath;
        this.amount = amount;
    }

    updateAmount(amount : number) {
        this.amount += amount;
        if (this.amount <= 0) {
            this.amount = 0;
        }
    }
}