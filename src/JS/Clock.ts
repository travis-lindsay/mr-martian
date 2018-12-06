import { gameApp } from "./game";

export class Clock {

    usedTime : number = 0;
    totalTime : number = 24;
    isDone : boolean = false;

    constructor() {

    }

    incrementTimeUsed() {
        if (!this.getIsDone()) {
            this.usedTime += 1;
        } else {
            this.resetClock();
        }
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