class Shelter {

    constructor(player, coordinate) {
        this.name = "Shelter";
        this.type = "Shelter";
        this.img = "./IMG/places/shelter1.png";
        this.desc = "Necessary for survival in the harsh and unpredictable environment of Mars.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;
        // take a player object, so we can assign an owner of the place, as well as manipulate the clock upon construction
        this.player = player;
        this.coordinate = coordinate;

        this.totalHoursToConstruct = 5;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;
    }

    takeShelter() {
        this.player.putPlayerInShelter();
        // Move clock to being finished, and finish off the day.
        this.player.clock.resetClock();
        gameApp.closeAllModals();
    }

    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
    }

    getCanUpgrade() {
        return this.upgradeLevel < this.maxUpgradeLevel;
    }
    
    construct() {
        if (this.player.clock.getIsDone() || this.getIsConstructed()) {
            // Then don't let them construct anymore, and close the window
            if (this.getIsConstructed()) {
                removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
            }
            gameApp.closeConstructionModal();
        }
        else {
            this.currentHoursConstructed += 1;
            this.currentHoursRemaining -= 1;
            this.player.clock.incrementTimeUsed();
        }
    }

    upgrade() {
        switch (this.upgradeLevel) {
            case 1:
                UpgradeShelter2(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                break;
            case 2:
                UpgradeShelter3(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        addImageToCoordinate("IMG/Construction.png", this.coordinate, 'CONSTRUCTION');
        gameApp.closePlaceActionsModal();
    }
}

/*Decorator Pattern - Upgrades*/
function UpgradeShelter2(shelter) {
    shelter.name = "Enclosed Shelter";
    shelter.desc = "Not too pretty, but it at least has 4 walls and a roof.";
    shelter.currentHoursConstructed = 0;
    shelter.totalHoursToConstruct = 10;
    /*shelter.totalResourceCount += 75;
    shelter.resourcePerHour = 5;*/ // TODO, figure out what you can do with the shelter... How to sleep there, store stuff, what the upgrades benefits are?
    shelter.img = './IMG/places/shelter2.png';
}

/*Decorator Pattern - Upgrades*/
function UpgradeShelter3(shelter) {
    shelter.name = "Steel Shelter";
    shelter.desc = "The finest piece of real-estate on the entire planet.";
    shelter.currentHoursConstructed = 0;
    shelter.totalHoursToConstruct = 18;
    /*shelter.totalResourceCount += 75;
    shelter.resourcePerHour = 5;*/ // TODO, figure out what you can do with the shelter... How to sleep there, store stuff, what the upgrades benefits are?
    shelter.img = './IMG/places/shelter3.png';
}