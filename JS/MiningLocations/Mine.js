class Mine {

    constructor(player, coordinate) {
        this.name = "Mine";
        this.type = "Place";
        this.img = "./IMG/places/mine1.png";
        this.desc = "Open pit mine for extracting iron ore from the rusted crust.";

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 26;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;

        // TODO, assign a random value to the total resources
        this.totalResourceCount = 125;
        this.resourcePerHour = 4;
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
}