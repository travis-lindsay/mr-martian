import { Clock } from "./Clock";
import { Coordinate } from "./Maps/Coordinate";

export class Player {
  
    health : number = 100;
    food : number = 10;
    foodRation : number = 4;
    usedFoodRation : number = 0;
    water : number = 10;
    waterRation : number = 4;
    stone : number = 0;
    usedWaterRation : number = 0;
    morale : number = 5;
    suppliesList : string = "empty";
    supplies : any = [null];
    isDead : boolean = false;
    imagePath : string;
    name : string;
    number : number;
    inShelter : boolean = false;
    clock : Clock = new Clock();
    coordinate : Coordinate;

    constructor(num : number)
    {
        this.imagePath = "spaceman" + num + "_sprite.png";
        this.name = "Player " + (num + 1);
        this.number = num;
        
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

    putPlayerInShelter() {
        this.inShelter = true;
    }

    removePlayerFromShelter() {
        this.inShelter = false;
    }

    isPlayerInShelter() {
        return this.inShelter;
    }

    SupplyToString()
    {
        this.suppliesList = "filled";
        // var MyItems[];
        
        // for(int i = 0; i < this.supplies.length(); i++)
        // {
        //     MyItems.push(this.supplies[i].GetClass());
        // }
        
        // this.suppliesList =  MyItems.toString();
        // if(this.supplies[0] == null)
        // {
        //     return;
        // }
        // var line = this.supplies[0].GetClass() + ", " + this.supplies[1].GetClass();
        // this.suppliesList =  line;
    }
    
    addSupply(thing : any)
    {
        this.supplies.push(thing);
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
        return this.morale += plusMorale;
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