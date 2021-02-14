import { gameApp } from "./game";
import { RandomMarsEvents } from "./RandomMarsEvents";

export class Clock {

    usedTime : number = 0;
    totalTime : number = 24;
    isDone : boolean = false;
    randEvent : RandomMarsEvents;

    constructor() {
        this.randEvent = new RandomMarsEvents("Test", "Default-Test", false, 0);
    }

    incrementTimeUsed() {
        if (!this.getIsDone()) {
            this.usedTime += 1;
        } else {
            this.resetClock();
        }
        // potentially add logic, to see if a random event will occur
    }

    resetClock() {
        this.usedTime = 0;
        gameApp.changeCurrentPlayer();
    }
    
    // For manually taking away time from player
    setUsedtime(amount : number) {
        this.usedTime = amount;
    }
    
    getTimeLeft() {
        return this.totalTime - this.usedTime;
    }
    
    getIsDone() {
        return this.usedTime >= this.totalTime;
    }

    setClockToDone() {
        this.usedTime = this.totalTime;
    }
}