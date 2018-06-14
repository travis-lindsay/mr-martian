class Well
{
    constructor(player, coordinate) {
        this.name = "Well";
        this.type = "Place";
        this.img = "./IMG/places/well1.png";
        this.desc = "An unsophisticated hole dug deep into the mars crust, used to extract water from the ground.";
        
        // take a player object, so we can assign an owner of the place, as well as manipulate the clock upon construction
        this.player = player;
        // coordinate the building is at
        this.coordinate = coordinate;
        
        // Time to construct the Well
        this.totalHoursToConstruct = 8;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;
        
        // TODO, assign a random value to the total resources
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
            gameApp.closeConstructionPanel();
        }
        else {
            this.currentHoursConstructed += 1;
            this.currentHoursRemaining -= 1;
            this.player.clock.incrementTimeUsed();
        }
    }
    
    getIsEmpty() {
        return this.minedResourceCount >= this.totalResourceCount;
    }
    
    mineResource() {
        if (!this.getIsEmpty()) {
            this.minedResourceCount += this.resourcePerHour;
            return this.resourcePerHour;
        }
        else {
            return 0;
        }
    }

    upgrade() {
        UpgradeWellToSteel(this);
    }
}

/*Decorator Pattern Spike 1*/
function UpgradeWellToSteel(well) {
    well.name = "Steel Well";
    well.desc = "Steel encased upgrade of well to prevent collapse, used to extract water from the ground.";
    well.totalResourceCount += 75;
    well.resourcePerHour = 5;
    well.img = './IMG/places/well2.png';
}

/*
/!* Decorator pattern spike solution *!/
class SteelWell {
    constructor(well) {
        this.well = well;
        this.resourcePerHour = 5;
        this.name = "Steel Well";
        this.type = "Place";
        this.img = well.img;
        this.desc = "Steel encased upgrade of well to prevent collapse, used to extract water from the ground.";

        this.player = well.player;
        this.coordinate = well.coordinate;

        this.totalHoursToConstruct = 12;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;

        this.totalResourceCount = 65;
        this.minedResourceCount = 0;
    }

    mineResource() {
        if (!this.getIsEmpty()) {
            this.minedResourceCount += this.resourcePerHour;
            return this.resourcePerHour;
        }
        else {
            return 0;
        }
    }
}*/
