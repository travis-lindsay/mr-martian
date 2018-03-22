class Farm {

    constructor(player) {
        this.name = "Farm";
        this.type = "Place";
        this.img = "./IMG/materials/food.png";
        this.desc = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";

        this.player = player;

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
            // Then don't let them construct anymore, and close the window
            gameApp.closeConstructionPanel();
        }
        else {
            this.currentHoursConstructed += 1;
            this.currentHoursRemaining -= 1;
            this.player.clock.incrementTimeUsed();
        }
    }
}