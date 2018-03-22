class Shelter {

    constructor(player) {
        this.name = "Shelter";
        this.type = "Place";
        this.img = "./IMG/materials/wood.png";
        this.desc = "Necessary for survival in the harsh and unpredictable environment of Mars.";

        // take a player object, so we can assign an owner of the place, as well as manipulate the clock upon construction
        this.player = player;

        this.totalHoursToConstruct = 5;
        this.currentHoursConstructed = 0;
        this.currentHoursRemaining = this.totalHoursToConstruct;

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