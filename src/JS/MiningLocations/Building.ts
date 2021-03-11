import { Player } from "../Player";
import { Coordinate } from "../Maps/Coordinate";
import { Map } from "../Maps/Map";
import { Tile } from "../Maps/Tile";
import { gameApp } from "../game";
import Utils from "../Utils";
import { ActionType } from "../Enums/ActionType";
import { Propaganda } from "../Tools/Propaganda";
import { InventoryItem } from "../InventoryItem";

type UpgradeReqs = {
    water : number,
    food : number,
    stone : number
}

export class Building {

    player : Player | undefined;
    coordinate : Coordinate | undefined;
    name : string = "";
    type : string = "";
    img : string = "";
    desc : string = "";
    mineable : boolean = true;
    maxUpgradeLevel : number = 3;
    upgradeLevel : number = 1;
    totalHoursToConstruct : number = 0;
    currentHoursConstructed : number = 0;
    totalResourceCount : number = 45;
    resourcePerHour : number = 2;
    minedResourceCount : number = 0;
    bonusResourcePerHour : number = 0;
    bonusResourcePerHourDesc : string = "";
    propaganda : number = 0;
    nextUpgradeReqs : UpgradeReqs = { water : 0, food : 0, stone : 0 };

    constructor (player? : Player, coordinate? : Coordinate) {
        // Take a player object, so we can assign an owner of the place, as well as manipulate the clock upon construction
        this.player = player;
        // Coordinate the building is at
        this.coordinate = coordinate;
    }

    mineResource(bonusResourcePerHour : number) : number {
        // If there is a tool that give it a bonus harvest rate > 0, it will display in UI
        this.bonusResourcePerHour = bonusResourcePerHour;
        if (this.player!.clock.getIsDone()) {
            this.player!.clock.resetClock(); // TODO, find a better approach, some sort of time controller / model pattern
            gameApp.closeAllModals();
            return 0;
        }
        if (!this.getIsEmpty()) {
            this.incrementPlayerClock();
            this.minedResourceCount += this.resourcePerHour + bonusResourcePerHour;
            if (this.minedResourceCount > this.totalResourceCount) {
                this.minedResourceCount = this.totalResourceCount;
            }
            return this.resourcePerHour + bonusResourcePerHour;
        }
        else {
            return 0;
        }
    }
    
    getName() : string {
        return this.name;
    }
    
    getIsEmpty() {
        return this.minedResourceCount >= this.totalResourceCount;
    }
    
    getIsNextUpgrade() {
        return this.upgradeLevel < this.maxUpgradeLevel;
    }

    getCanUpgrade() {
        if (!this.player) { return false }
        else {
            return this.player!.food >= this.nextUpgradeReqs.food &&
            this.player!.water >= this.nextUpgradeReqs.water &&
            this.player!.stone >= this.nextUpgradeReqs.stone;
        }
    }

    upgrade() {
        this.player!.substractFood(this.nextUpgradeReqs.food);
        this.player!.substractWater(this.nextUpgradeReqs.water);
        this.player!.subtractStone(this.nextUpgradeReqs.stone);
        Utils.addImageToCoordinate("./src/IMG/Construction.png", this.coordinate, 'CONSTRUCTION');
    }

    incrementPlayerClock() {
        this.player!.clock.incrementTimeUsed(ActionType.Mine);
    }
  
    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
    }

    construct() {
        if (this.player!.clock.getIsDone()) {
            this.player!.clock.resetClock();
            gameApp.closeAllModals();
            return;
        }
        if (this.getIsConstructed()) {
            // Then don't let them construct anymore, and close the window
            Utils.removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
            gameApp.closeConstructionModal();
        }
        else {
            this.currentHoursConstructed += 1;
            this.player!.clock.incrementTimeUsed(ActionType.Build);
            if (this.getIsConstructed()) {
                Utils.removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
                gameApp.closeConstructionModal();
            }
        }
    }

    destroy(tileMap: Map) {
        Utils.removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
        Utils.removeImageFromCoordinate('IMG', this.coordinate);
        Utils.removeImageFromCoordinate('CORNER', this.coordinate);
        if (this.coordinate !== undefined) {
            let tile : Tile = tileMap.getTile(this.coordinate.y, this.coordinate.x);
            tile.destroyBuilding();
        }
        gameApp.buildings.filter((b : Coordinate) => this.coordinate !== undefined && b.x == this.coordinate.x && b.y == this.coordinate.y);
        gameApp.closeAllModals();
    }

    incrementPropaganda(player: Player) {
        if (player!.clock.getIsDone()) {
            player!.clock.resetClock();
            gameApp.closeAllModals();
            return;
        }
        let itemIndex : number = player.suppliesList.findIndex(item => item.name === 'Anti-alien propaganda');
        if (itemIndex != -1) {
            let item : InventoryItem = player.suppliesList[itemIndex];
            if (item.amount > 0) {
                this.propaganda += 1;
                item.updateAmount(-1);
                if (item.amount <= 0) {
                    player.suppliesList.splice(itemIndex, 1);
                }
            }
        }
    }
}