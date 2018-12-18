import { Building } from "./Building";
import { Player } from "../Player";
import { Coordinate } from "../Maps/Coordinate";
import { gameApp } from "../game";
import Utils from "../Utils";

export class Shelter extends Building {

    constructor(player : Player, coordinate : Coordinate) {
        super(player, coordinate);
        this.name = "Shelter";
        this.type = "Shelter";
        this.img = "./src/IMG/places/shelter1.png";
        this.desc = "Necessary for survival in the harsh and unpredictable environment of Mars.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;
        this.mineable = false; // Can't mine a shelter, default for buildings is true

        this.totalHoursToConstruct = 5;
        this.currentHoursConstructed = 0;
        this.nextUpgradeReqs = { food : 1, water : 1, stone : 0 }
    }

    takeShelter() {
        this.player!.putPlayerInShelter(this.coordinate!);
        // Move clock to being finished, and finish off the day.
        this.player!.clock.resetClock();
        gameApp.closeAllModals();
    }

    upgrade() {
        if (!this.getCanUpgrade()) {
            return;
        }
        super.upgrade();
        switch (this.upgradeLevel) {
            case 1:
                UpgradeShelter2(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                this.nextUpgradeReqs = { food : 20, water : 20, stone : 35 }
                break;
            case 2:
                UpgradeShelter3(this);
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

/*Decorator Pattern - Upgrades*/
function UpgradeShelter2(shelter : Shelter) {
    shelter.name = "Enclosed Shelter";
    shelter.desc = "Not too pretty, but it at least has 4 walls and a roof.";
    shelter.currentHoursConstructed = 0;
    shelter.totalHoursToConstruct = 10;
    /*shelter.totalResourceCount += 75;
    shelter.resourcePerHour = 5;*/ // TODO, figure out what you can do with the shelter... How to sleep there, store stuff, what the upgrades benefits are?
    shelter.img = './src/IMG/places/shelter2.png';
}

/*Decorator Pattern - Upgrades*/
function UpgradeShelter3(shelter : Shelter) {
    shelter.name = "Steel Shelter";
    shelter.desc = "The finest piece of real-estate on the entire planet.";
    shelter.currentHoursConstructed = 0;
    shelter.totalHoursToConstruct = 18;
    /*shelter.totalResourceCount += 75;
    shelter.resourcePerHour = 5;*/ // TODO, figure out what you can do with the shelter... How to sleep there, store stuff, what the upgrades benefits are?
    shelter.img = './src/IMG/places/shelter3.png';
}