import { Coordinate } from "../Maps/Coordinate";
import { gameApp } from "../game";
import { Building } from "./Building";
import { Player } from "../Player";
import Utils from "../Utils";

export class Farm extends Building {

    constructor(player : Player, coordinate : Coordinate) {
        super(player, coordinate);
        this.name = "Farm";
        this.type = "Place";
        this.img = "./src/IMG/places/farm1.png";
        this.desc = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;
    
        // Time to construct the Farm
        this.totalHoursToConstruct = 14;
        this.currentHoursConstructed = 0;
    
        // TODO, assign a random value to the total resources
        this.totalResourceCount = 135;
        this.resourcePerHour = 1;
        this.minedResourceCount = 0;
        this.nextUpgradeReqs = { food : 20, water : 20, stone : 5 }
    }

    mineResource() : number {
        let minedAmount : number = super.mineResource(0);
        this.player!.addFood(minedAmount);
        return minedAmount;
    }

    upgrade() {
        if (!this.getCanUpgrade()) {
            return;
        }
        super.upgrade();
        switch (this.upgradeLevel) {
            case 1:
                UpgradeFarm2(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                this.nextUpgradeReqs = { food : 15, water : 10, stone : 30 }
                break;
            case 2:
                UpgradeFarm3(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        gameApp.closePlaceActionsModal();
    }

    /* Plants new stuff */
    plantSeeds() {
        // TODO, grab seeds from inventory
        // TODO, figure out how we want to implement the farming stuff
    }

    waterSeeds() {
        // TODO, take water from players inventory
        // TODO, create plant class? Tracks water/fertilizer needs
    }
}

/*Decorator Pattern Upgrade 2*/
function UpgradeFarm2(farm : Farm) {
    farm.name = "Tilled Farm";
    farm.desc = "Properly fertilized and tilled soil allows for a much better harvest.";
    farm.totalHoursToConstruct = 14;
    farm.currentHoursConstructed = 0;
    farm.totalResourceCount += 295;
    farm.resourcePerHour = 10;
    farm.img = './src/IMG/places/farm2.png';
}

/*Decorator Pattern Upgrade 2*/
function UpgradeFarm3(farm : Farm) {
    farm.name = "Industrial Farm";
    farm.desc = "Optimized for storage of the massive harvests it produces";
    farm.totalHoursToConstruct = 18;
    farm.currentHoursConstructed = 0;
    farm.totalResourceCount += 355;
    farm.resourcePerHour = 15;
    farm.img = './src/IMG/places/farm3.png';
}