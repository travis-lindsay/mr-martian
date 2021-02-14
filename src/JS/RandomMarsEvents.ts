export class RandomMarsEvents {

    description: string;
    category : string;
    badEvent : boolean;
    points : number;

    constructor(desc : string, category : string, badEvent : boolean, points : number) {
        this.description = desc;
        this.category = category;
        this.badEvent = badEvent;
        this.points = points;
    }

    // this is the base probability for a generic event, specific events will have their own probability
    // max is the number that the Math.random() is multiplied by
    // min is the number that the random number generated is compared to
    // ie if you want 3% chance, then max = 100, and min = 3
    shouldEventHappen(max : number, min : number) {   // returns a boolean, true if an event will happen, false if it won't. More often return false
        var chanceOfEvent = Math.floor(Math.random() * max);
        if(chanceOfEvent < min) {
            return true;
        }
        else {
            return false;
        }
    }

    openRandEventPopUp() {
        $("#randEventPopUp").modal("show");
    }

    closeRandEventPopUp() {
        $("randEventPopUp").modal("hide");
    }

    // determine whether or not an event will happen
    // 


    // potentially get it to stop your movement


    // TODO: First, probably get it to pop-up some event at times while playing the game
        // pop up box
        // edit the attributes or inventory of a player
        // edit the tile a player is next to

    // have lots of different classes, and then choose randomly from a set of class taht all extend RandomMarsEvents
    // make both good an bad events
    // determine how frequent events occur -- do that in the Clock.ts file, in the IncrementTime function

    //Ideas
        // have random events at the begining of each turn?
        // have random events occur while moving?
            // tripping
            // lost bearings
            // 
        // have random events occur while building stuff
        // have random events occur while using a building?
        

}