class Farm {

    constructor(player, coordinate) {
        this.name = "Farm";
        this.type = "Place";
        this.img = "./IMG/places/farm1.png";
        this.desc = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 14;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;

        // TODO, assign a random value to the total resources
        this.totalResourceCount = 85;
        this.resourcePerHour = 1;
        this.minedResourceCount = 0;
    }
    
        
    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
    }
    
    construct() {
        if (this.player.clock.getIsDone() || this.getIsConstructed()) {
            if (this.getIsConstructed()) {
                removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
            }
            // Then don't let them construct anymore, and close the window
            gameApp.closeConstructionPanel();
        }
        else {
            this.currentHoursConstructed += 1;
            this.currentHoursRemaining -= 1;
            this.incrementPlayerClock();
        }
    }

    incrementPlayerClock() {
        this.player.clock.incrementTimeUsed();
    }

    /* Returns number of resources gained */
    harvest() {
        this.totalResourceCount - this.resourcePerHour;
        this.incrementPlayerClock();
        return this.resourcePerHour;
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