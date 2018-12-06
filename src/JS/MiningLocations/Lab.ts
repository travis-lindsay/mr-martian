import { Player } from "../Player";
import { Coordinate } from "../Maps/Coordinate";
import { Building } from "./Building";
import { gameApp } from "../game";
import Utils from "../Utils";

export class Lab extends Building {

    constructor(player : Player, coordinate : Coordinate) {

        super(player, coordinate);
        this.name = "Lab";
        this.type = "Place";
        this.img = "./src/IMG/places/lab1.png";
        this.desc = "A designated location for researching this fascinating planet, and building a research base big enough to barter for your escape from this planet.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;

        // Time to construct the Farm
        this.totalHoursToConstruct = 30;
        this.currentHoursConstructed = 0;
    }

    upgrade() {
        if (!this.getCanUpgrade()) {
            return;
        }
        super.upgrade();
        switch (this.upgradeLevel) {
            case 1:
                UpgradeLab2(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                break;
            case 2:
                console.log("This is a stubbed upgrade for lab level 3");
                // UpgradeLab3(this);
                // addImageToCoordinate(this.img, this.coordinate, 'IMG');
                // this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        gameApp.closePlaceActionsModal();
    }

}

/*Decorator Pattern Upgrade 2*/
function UpgradeLab2(lab : Lab) {
    lab.name = "Advanced Lab";
    lab.desc = "Extra beakers, additional counter space, all makes for faster research time.";
    lab.totalHoursToConstruct = 24;
    lab.currentHoursConstructed = 0;
    lab.totalResourceCount += 205;
    lab.resourcePerHour = 10;
    lab.img = './src/IMG/places/lab2.png';
}
