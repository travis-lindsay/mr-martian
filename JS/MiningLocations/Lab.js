class Lab {

    constructor(player, coordinate) {
        this.name = "Lab";
        this.type = "Place";
        this.img = "./IMG/roverparts/roverengine.png";
        this.desc = "A designated location for researching this fascinating planet, and building a research base big enough to barter for your escape from this planet.";

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 30;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;
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
