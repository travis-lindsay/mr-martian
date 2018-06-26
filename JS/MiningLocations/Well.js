class Well
{
    constructor(player, coordinate) {
        this.name = "Well";
        this.type = "Place";
        this.img = "./IMG/places/well1.png";
        this.desc = "An unsophisticated hole dug deep into the mars crust, used to extract water from the ground.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;
        // take a player object, so we can assign an owner of the place, as well as manipulate the clock upon construction
        this.player = player;
        // coordinate the building is at
        this.coordinate = coordinate;
        
        // Time to construct the Well
        this.totalHoursToConstruct = 8;
        this.currentHoursConstructed = 0;

        // TODO, assign a random value to the total resources within a reasonable range
        this.totalResourceCount = 45;
        this.resourcePerHour = 2;
        this.minedResourceCount = 0;
    }
    
    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
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
            this.player.clock.incrementTimeUsed();
        }
    }
    
    getIsEmpty() {
        return this.minedResourceCount >= this.totalResourceCount;
    }

    getCanUpgrade() {
        return this.upgradeLevel < this.maxUpgradeLevel;
    }

    incrementPlayerClock() {
        this.player.clock.incrementTimeUsed();
    }
    
    mineResource() {
        if (!this.getIsEmpty()) {
            this.incrementPlayerClock();
            this.minedResourceCount += this.resourcePerHour;
            if (this.minedResourceCount > this.totalResourceCount) {
                this.minedResourceCount = this.totalResourceCount;
            }
            return this.resourcePerHour;
        }
        else {
            return 0;
        }
    }

    upgrade() {
        switch (this.upgradeLevel) {
            case 1:
                UpgradeWell2(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                break;
            case 2:
                UpgradeWell3(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        addImageToCoordinate("IMG/Construction.png", this.coordinate, 'CONSTRUCTION');
        gameApp.closePlaceActionsModal();
        // gameApp.openConstructionModal();
    }
}

/*Decorator Pattern Upgrade 2*/
function UpgradeWell2(well) {
    well.name = "Steel Well";
    well.desc = "Steel encased upgrade of well to prevent collapse, used to extract water from the ground.";
    well.totalHoursToConstruct = 10;
    well.currentHoursConstructed = 0;
    well.totalResourceCount += 75;
    well.resourcePerHour = 5;
    well.img = './IMG/places/well2.png';
}

/*Decorator Pattern Upgrade 3*/
function UpgradeWell3(well) {
    well.name = "Hydraulic Well";
    well.desc = "Hydraulically pumps and filters heaps of ice-cold mars h2o.";
    well.totalHoursToConstruct = 16;
    well.currentHoursConstructed = 0;
    well.totalResourceCount += 185;
    well.resourcePerHour = 15;
    well.img = './IMG/places/well3.png';
}