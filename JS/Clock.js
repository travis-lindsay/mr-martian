class Clock {
    constructor() {
        this.usedTime = 0;
        this.totalTime = 24;
        this.isDone = false;
    }

    incrementTimeUsed() {
        if (!this.getIsDone()) {
            this.usedTime += 1;
        } else {
            this.usedTime = 0;
            gameApp.changeCurrentPlayer();
        }
    }
    
    // For manually taking away time from player
    setUsedtime(amount) {
        this.usedTime = amount;
    }
    
    getTimeLeft() {
        return this.totalTime - this.usedTime;
    }
    
    getIsDone() {
        return this.usedTime >= this.totalTime;
    }
}