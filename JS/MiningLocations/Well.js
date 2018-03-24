class Well
{
    constructor(player, coordinate) {
        this.name = "Well";
        this.type = "Place";
        this.img = "./IMG/materials/water.png";
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
    
}