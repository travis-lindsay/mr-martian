import { Clock } from "./Clock";
import { Coordinate } from "./Maps/Coordinate";
import { InventoryItem } from "./InventoryItem";
import { Shovel } from "./Tools/Shovel";
import { PickAxe } from "./Tools/PickAxe";
import { Wheel } from "./RoverParts/Wheel";
import { Engine } from "./RoverParts/Engine";
import { Frame } from "./RoverParts/Frame";
import { Spear } from "./Tools/Spear";
import { Propaganda } from "./Tools/Propaganda";

export class Player {
  
    health : number = 100;
    food : number = 10;
    foodRation : number = 4;
    usedFoodRation : number = 0;
    water : number = 10;
    waterRation : number = 4;
    stone : number = 0;
    usedWaterRation : number = 0;
    morale : number = 100;
    suppliesList : InventoryItem[] = new Array<InventoryItem>();
    isDead : boolean = false;
    imagePath : string;
    name : string;
    number : number;
    inShelter : boolean = false;
    shelterCoordinate : Coordinate | null = null;
    clock : Clock = new Clock();
    coordinate : Coordinate;

    constructor(num : number)
    {
        this.imagePath = "spaceman" + num + "_sprite.png";
        this.name = "Player " + (num + 1);
        this.number = num;
        
        // Each players starts with a shovel by default
        this.addSupply('shovel');

        switch(num) {
            case 0:
                this.coordinate = new Coordinate(0,0);
                break;
            case 1:
                this.coordinate = new Coordinate(0,7);
                break;
            case 2:
                this.coordinate = new Coordinate(7,0);
                break;
            case 3:
                this.coordinate = new Coordinate(7,7);
                break;
            default:
                this.coordinate = new Coordinate(0,0);
        }
    };

    putPlayerInShelter(coordinate : Coordinate) {
        this.inShelter = true;
        this.shelterCoordinate = coordinate;
    }

    removePlayerFromShelter() {
        this.inShelter = false;
        this.shelterCoordinate = null;
    }

    isPlayerInShelter() {
        return this.inShelter;
    }

    addInventoryItems(inventoryItems : Array<InventoryItem> | null) {
        if (inventoryItems !== null && inventoryItems.length > 0) {
            this.suppliesList.push(...inventoryItems);
        }
    }
    
    addSupply(item : string)
    {
        let inventoryItem : InventoryItem | null = null;
        switch(item) {
            case 'shovel' : 
                inventoryItem = new Shovel();
                break;
            case 'pickaxe' : 
                inventoryItem = new PickAxe();
                break;
            case 'spear' : 
                inventoryItem = new Spear();
                break;
            case 'wheel' : 
                inventoryItem = new Wheel();
                break;
            case 'engine' : 
                inventoryItem = new Engine();
                break;
            case 'frame' : 
                inventoryItem = new Frame();
                break;
            case 'propaganda' : 
                inventoryItem = new Propaganda();
                break;
        }
        if (inventoryItem) {
            this.suppliesList.push(inventoryItem);
        }
    }

    getCoordinate() {
        return this.coordinate;
    }
    
    setCoordinate(coordinate : Coordinate) {
        this.coordinate = coordinate;
    }
    
    getImagePath() {
        return this.imagePath;
    }
    
    setImagePath(path : any) {
        this.imagePath = path;
    }
    
    getHealth() // returns the current health value
    {
        return this.health
    };
    
    setHealth(newHealth : number)        // changes the current health value to a received newHealth value
    {
        if(newHealth <= 0)
        {
            this.health = 0;
            this.isDead = true;
        }
        else
        {
            this.health = newHealth;
        }
    };
    
    changeHealth(health : any)
    {
        this.health += health;
        if(this.health <= 0)
        {
            this.isDead = true;
            this.health = 0;
        }
        if (this.health > 100) {
            this.health = 100;
        }
    };

    changeMorale(morale : any)
    {
        this.morale += morale;
        if(this.morale <= 0)
        {
            this.morale = 0;
        }
        if (this.morale > 100) {
            this.morale = 100;
        }
    };
    
    getFood()   // returns the current food value
    {
        return this.food;
    };
    
    setFood(newFood : number)      // changes the current food value to a received newFood value
    {
        this.food = newFood;
    };
    
    addFood(plusFood : number)
    {
        this.food += plusFood;
        if (this.food < 0) {
            this.food = 0;
        }
    }
    
    substractFood(minusFood : number)
    {
        this.food -= minusFood;
        if (this.food < 0) {
            this.food = 0;
        }
    };
    
    getWater()      // returns the current water value
    {
        return this.water;
    };
    
    setWater(newWater : number)      // changes the current water value to a received newWater value
    {
        this.water = newWater;
    };
    
    addWater(plusWater : number)
    {
        this.water += plusWater;
        if (this.water < 0) {
            this.water = 0;
        }
    }
    
    substractWater(minusWater : number)
    {
        this.water -= minusWater;
        if (this.water < 0) {
            this.water = 0;
        }
    };

    addStone(stone : number)
    {
        this.stone += stone;
        if (this.stone < 0) {
            this.stone = 0;
        }
    }

    subtractStone(stone : number) 
    {
        this.stone -= stone;
        if (this.stone < 0) {
            this.stone = 0;
        }
    }
    
    getMorale() //returns the current morale value
    {
        return this.morale;
    }

    setMorale(newMorale : number)    // changes the current morale value to a received value
    {
        this.morale = newMorale;
    }

    addMorale(plusMorale : number)
    {
        this.morale += plusMorale;
        if (this.morale < 0) {
            this.morale = 0;
        }
    }
    
    substractMorale(minusMorale : number)
    {
        return this.morale -= minusMorale;
    }

    isPlayerDead() 
    {
        return this.isDead;
    }
}