/*
player class
-health
-food
-water
-morale
-supplies[]

*/
class Player {
  
  
        constructor(num)
        {
            this.health = 100;
            this.food = 10;
            this.foodRation = 3;
            this.water = 10;
            this.waterRation = 4;
            this.morale = 5;
            this.suppliesList = "empty";
            this.supplies = [null];
            this.isDead = false;
            this.imagePath = "spaceman" + num + ".png";
            this.name = "Player " + (num + 1);
            this.number = num;
            this.clock = new Clock();
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
        
        addSupply(thing)
        {
            this.supplies.push(thing);
        }
        
    
        getCoordinate() {
            return this.coordinate;
        }
        
        setCoordinate(coordinate) {
            this.coordinate = coordinate;
        }
        
        getImagePath() {
            return this.imagePath;
        }
        
        setImagePath(path) {
            this.imagePath = path;
        }
        
        getHealth() // returns the current health value
        {
            return this.health
        };
        
        setHealth(newHealth)        // changes the current health value to a received newHealth value
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
        
        addHealth(plusHealth)
        {
            this.health += plusHealth;
        }
        
        substractHealth(minusHealth)
        {
            this.health -= minusHealth;
            if(this.health <= 0)
            {
                this.isDead = true;
                this.health = 0;
            }
            return this.health;
        };
        
        getFood()   // returns the current food value
        {
            return this.food;
        };
        
        setFood(newFood)      // changes the current food value to a received newFood value
        {
            this.food = newFood;
        };
        
        addFood(plusFood)
        {
            this.food += plusFood;
        }
        
        substractFood(minusFood)
        {
            this.food -= minusFood;
        };
        
        getWater()      // returns the current water value
        {
            return this.water;
        };
        
        setWater(newWater)      // changes the current water value to a received newWater value
        {
            this.water = newWater;
        };
        
        addWater(plusWater)
        {
            this.water += plusWater;
        }
        
        substractWater(minusWater)
        {
            this.water -= minusWater;
        };
        
        
        getMorale() //returns the current morale value
        {
            return this.morale;
        };
        setMorale(newMorale)    // changes the current morale value to a received value
        {
            this.morale = newMorale;
        };
    
        addMorale(plusMorale)
        {
            return this.morale += plusMorale;
        }
        
        substractMorale(minusMorale)
        {
            return this.morale -= minusMorale;
        };
}