import { gameApp } from "./game";
import { ActionType } from "./Enums/ActionType";
import { RandomEventController } from "./RandomEvents/RandomEventController";

export class Clock {

    usedTime : number = 0;
    totalTime : number = 24;
    isDone : boolean = false;
    randomEventController : RandomEventController;

    constructor() {
        this.randomEventController = new RandomEventController();
    }

    incrementTimeUsed(actionType : ActionType) {
        if (!this.getIsDone()) {
            this.usedTime += 1;
        } else {
            this.resetClock();
        }

        // See if random event occurs based on action being taken
        return this.randomEventController.tryGenerateRandomEvent(actionType);
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