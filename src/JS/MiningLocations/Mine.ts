import { Building } from "./Building";
import { Player } from "../Player";
import { Coordinate } from "../Maps/Coordinate";
import { gameApp } from "../game";
import Utils from "../Utils";

export class Mine extends Building {

    constructor(player : Player, coordinate : Coordinate) {
        super(player, coordinate);
        this.name = "Mine";
        this.type = "Place";
        this.img = "./src/IMG/places/mine1.png";
        this.desc = "Open pit mine for extracting iron ore from the rusted crust.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;

        // Time to construct the Farm
        this.totalHoursToConstruct = 26;
        this.currentHoursConstructed = 0;

        // TODO, assign a random value to the total resources
        this.totalResourceCount = 125;
        this.resourcePerHour = 4;
        this.minedResourceCount = 0;
        this.nextUpgradeReqs = { food : 10, water : 10, stone : 15 }
    }

    mineResource() : number {
        let minedAmount : number = super.mineResource();
        this.player!.addStone(minedAmount);
        return minedAmount;
    }

    upgrade() {
        if (!this.getCanUpgrade()) {
            return;
        }
        super.upgrade();
        switch (this.upgradeLevel) {
            case 1:
                UpgradeMine2(this);
                Utils.addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                this.nextUpgradeReqs = { food : 25, water : 20, stone : 45 }
                break;
            case 2:
                UpgradeMine3(this);
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
function UpgradeMine2(mine : Mine) {
    mine.name = "Railed Mine";
    mine.desc = "This mine features a railway which makes for more efficient transportation of mined materials.";
    mine.totalHoursToConstruct = 24;
    mine.currentHoursConstructed = 0;
    mine.totalResourceCount += 295;
    mine.resourcePerHour = 10;
    mine.img = './src/IMG/places/mine2.png';
}

/*Decorator Pattern Upgrade 2*/
function UpgradeMine3(mine : Mine) {
    mine.name = "Automated Shaft Mine";
    mine.desc = "Digs deeper and faster than its predecessors";
    mine.totalHoursToConstruct = 28;
    mine.currentHoursConstructed = 0;
    mine.totalResourceCount += 455;
    mine.resourcePerHour = 15;
    mine.img = './src/IMG/places/mine3.png';
}