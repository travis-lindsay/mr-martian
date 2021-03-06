import { Player } from "../Player";
import { Coordinate } from "../Maps/Coordinate";
import { Building } from "./Building";
import { gameApp } from "../game";
import Utils from "../Utils";
import { basename } from "path";

export class Well extends Building
{
    constructor(player : Player, coordinate : Coordinate) {
        super(player, coordinate);
        this.name = "Well";
        this.type = "Place";
        this.img = "./src/IMG/places/well1.png";
        this.desc = "An unsophisticated hole dug deep into the mars crust, used to extract water from the ground.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;
        // Time to construct the Well
        this.totalHoursToConstruct = 8;
        this.currentHoursConstructed = 0;
        // TODO, assign a random value to the total resources within a reasonable range
        this.totalResourceCount = 45;
        this.resourcePerHour = 2;
        this.minedResourceCount = 0;
        this.nextUpgradeReqs = { food : 5, water : 5, stone : 15 }
    }

    mineResource() : number {
        let minedAmount : number = super.mineResource(0);
        this.player!.addWater(minedAmount);
        return minedAmount;
    }

    upgrade() {
        if (!this.getCanUpgrade()) {
            return;
        }
        super.upgrade();
        switch (this.upgradeLevel) {
            case 1:
                UpgradeWell2(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                this.nextUpgradeReqs = { food : 15, water : 10, stone : 45 }
                break;
            case 2:
                UpgradeWell3(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        gameApp.closePlaceActionsModal();
    }
}

/*Decorator Pattern Upgrade 2*/
function UpgradeWell2(well : Well) {
    well.name = "Steel Well";
    well.desc = "Steel encased upgrade of well to prevent collapse, used to extract water from the ground.";
    well.totalHoursToConstruct = 10;
    well.currentHoursConstructed = 0;
    well.totalResourceCount += 75;
    well.resourcePerHour = 5;
    well.img = './src/IMG/places/well2.png';
}

/*Decorator Pattern Upgrade 3*/
function UpgradeWell3(well : Well) {
    well.name = "Hydraulic Well";
    well.desc = "Hydraulically pumps and filters heaps of ice-cold mars h2o.";
    well.totalHoursToConstruct = 16;
    well.currentHoursConstructed = 0;
    well.totalResourceCount += 185;
    well.resourcePerHour = 15;
    well.img = './src/IMG/places/well3.png';
}