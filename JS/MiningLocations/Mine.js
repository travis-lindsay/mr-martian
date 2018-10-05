class Mine {

    constructor(player, coordinate) {
        this.name = "Mine";
        this.type = "Place";
        this.img = "./IMG/places/mine1.png";
        this.desc = "Open pit mine for extracting iron ore from the rusted crust.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 26;
        this.currentHoursConstructed = 0;

        // TODO, assign a random value to the total resources
        this.totalResourceCount = 125;
        this.resourcePerHour = 4;
        this.minedResourceCount = 0;
    }
    
    getIsConstructed() {
        return this.currentHoursConstructed >= this.totalHoursToConstruct;
    }

    getIsEmpty() {
        return this.minedResourceCount >= this.totalResourceCount;
    }

    getCanUpgrade() {
        return this.upgradeLevel < this.maxUpgradeLevel;
    }

    incrementPlayerClock() {
        this.player.clock.incrementTimeUsed();
    }

    mineResource() {
        if (this.player.clock.getIsDone()) {
            this.player.clock.resetClock();
            gameApp.closeAllModals();
            return;
        }
        if (!this.getIsEmpty()) {
            this.incrementPlayerClock();
            this.minedResourceCount += this.resourcePerHour;
            if (this.minedResourceCount > this.totalResourceCount) {
                this.minedResourceCount = this.totalResourceCount;
            }
            return this.resourcePerHour;
        }
        else {
            return 0;
        }
    }

    construct() {
        if (this.player.clock.getIsDone()) {
            this.player.clock.resetClock();
            gameApp.closeAllModals();
            return;
        }
        if (this.getIsConstructed()) {
            // Then don't let them construct anymore, and close the window
            if (this.getIsConstructed()) {
                removeImageFromCoordinate('CONSTRUCTION', this.coordinate);
            }
            gameApp.closeConstructionModal();
        }
        else {
            this.currentHoursConstructed += 1;
            this.player.clock.incrementTimeUsed();
        }
    }

    upgrade() {
        switch (this.upgradeLevel) {
            case 1:
                UpgradeMine2(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 2;
                break;
            case 2:
                UpgradeMine3(this);
                addImageToCoordinate(this.img, this.coordinate, 'IMG');
                this.upgradeLevel = 3;
                break;
            default:
                console.log("Cannot upgrade");
                break;
        }
        addImageToCoordinate("IMG/Construction.png", this.coordinate, 'CONSTRUCTION');
        gameApp.closePlaceActionsModal();
    }
}

/*Decorator Pattern Upgrade 2*/
function UpgradeMine2(mine) {
    mine.name = "Railed Mine";
    mine.desc = "This mine features a railway which makes for more efficient transportation of mined materials.";
    mine.totalHoursToConstruct = 24;
    mine.currentHoursConstructed = 0;
    mine.totalResourceCount += 295;
    mine.resourcePerHour = 10;
    mine.img = './IMG/places/mine2.png';
}

/*Decorator Pattern Upgrade 2*/
function UpgradeMine3(mine) {
    mine.name = "Automated Shaft Mine";
    mine.desc = "Digs deeper and faster than its predecessors";
    mine.totalHoursToConstruct = 28;
    mine.currentHoursConstructed = 0;
    mine.totalResourceCount += 455;
    mine.resourcePerHour = 15;
    mine.img = './IMG/places/mine3.png';
}