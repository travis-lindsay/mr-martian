import { Coordinate } from "./Maps/Coordinate";
import { PickAxe } from "./Tools/PickAxe";
import { Axe } from "./Tools/Axe";
import { Shovel } from "./Tools/Shovel";
import { Spear } from "./Tools/Spear";
import { Engine } from "./RoverParts/Engine";
import { Frame } from "./RoverParts/Frame";
import { Wheel } from "./RoverParts/Wheel";

export class Ship
{
    
    Tool: any;
    RoverPart: any;
    Water: number;
    Food: number;
    imagePath : string;
    coordinate : Coordinate;
    ItemInShip : any;
    RoverParts : any;

    constructor()
    {
        this.Tool = this.GetRandomItem();
        this.RoverPart = this.GetRandomRoverPart();
        this.Water = this.GetRandomWaterAmount();
        this.Food =  this.GetRandomFoodAmount();
        this.imagePath = "crashedrocket.png";
        this.coordinate = new Coordinate(1,1);
    }
    
    getImagePath() 
    {
        return this.imagePath;
    }
        
    setImagePath(path : string) 
    {
        this.imagePath = path;
    }
    
    getCoordinate() 
    {
            return this.coordinate;
    }
        
    setCoordinate(coordinate : Coordinate) 
    {
        this.coordinate = coordinate;
    }
    
    GetAllStuff()
    {
        var Stuff = [this.ItemInShip, this.RoverParts, this.Water, this.Food];
        this.EmptyShip();
        return Stuff;    
    }
    
    EmptyShip()
    {
        this.ItemInShip = null;
        this.RoverParts = null;
    }
    
    GetRandomItem()
    {
        var pickaxe = new PickAxe();
        var axe = new Axe();
        var shovel =  new Shovel();
        var spear = new Spear();
        
        var items = [pickaxe];
        //var items = [pickaxe, shovel, axe, spear];
        var RanNum = Math.floor(Math.random() * items.length) + 0;
        return items[RanNum];
    }
    
    GetRandomRoverPart()
    {
        var engine = new Engine();
        var frame = new Frame();
        var wheel = new Wheel();
        
        var items = [engine, frame, wheel];
        var RanNum = Math.floor(Math.random() * items.length) + 0;
        return items[RanNum];
    }
    
    GetRandomWaterAmount()
    {
        var items = [1, 2];
        var RanNum = Math.floor(Math.random() * items.length) + 0;
        return items[RanNum];
    }
    
    GetRandomFoodAmount()
    {
        var items = [1, 2];
        var RanNum = Math.floor(Math.random() * items.length) + 0;
        return items[RanNum];
    }

}