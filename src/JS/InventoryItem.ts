export class InventoryItem {

    public imgPath : string = "";
    public name : string;
    public description : string;
    constructor(name : string, description : string, imgPath : string) 
    {
        this.name = name;
        this.description = description;
        this.imgPath = imgPath;
    }
}