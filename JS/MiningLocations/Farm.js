class Farm {

    constructor(player, coordinate) {
        this.name = "Farm";
        this.type = "Place";
        this.img = "./IMG/places/farm1.png";
        this.desc = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 14;
        this.currentHoursConstructed = 0;

        // TODO, assign a random value to the total resources
        this.totalResourceCount = 85;
        this.resourcePerHour = 1;
        this.minedResourceCount = 0;
    }
    
        
    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
    }

    getCanUpgrade() {
        return this.upgradeLevel < this.maxUpgradeLevel;
    }

    getIsEmpty() {
        return this.minedResourceCount >= this.totalResourceCount;
    }
    
    construct() {
        if (this.player.clock.getIsDone() || this.getIsConstructed()) {
            if (this.getIsConstructed()) {
                removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
            }
            // Then don't let them construct anymore, and close the window
            gameApp.closeConstructionModal();
        }
        else {
            this.currentHoursConstructed += 1;
            this.incrementPlayerClock();
        }
    }

    incrementPlayerClock() {
        this.player.clock.incrementTimeUsed();
    }

    /* Returns number of resources gained */
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
                UpgradeFarm2(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                break;
            case 2:
                UpgradeFarm3(this);
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
function UpgradeFarm2(farm) {
    farm.name = "Tilled Farm";
    farm.desc = "Properly fertilized and tilled soil allows for a much better harvest.";
    farm.totalHoursToConstruct = 14;
    farm.currentHoursConstructed = 0;
    farm.totalResourceCount += 295;
    farm.resourcePerHour = 10;
    farm.img = './IMG/places/farm2.png';
}

/*Decorator Pattern Upgrade 2*/
function UpgradeFarm3(farm) {
    farm.name = "Industrial Farm";
    farm.desc = "Optimized for storage of the massive harvests it produces";
    farm.totalHoursToConstruct = 18;
    farm.currentHoursConstructed = 0;
    farm.totalResourceCount += 355;
    farm.resourcePerHour = 15;
    farm.img = './IMG/places/farm3.png';
}