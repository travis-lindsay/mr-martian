class Lab {

    constructor(player, coordinate) {
        this.name = "Lab";
        this.type = "Place";
        this.img = "./IMG/places/lab1.png";
        this.desc = "A designated location for researching this fascinating planet, and building a research base big enough to barter for your escape from this planet.";
        this.maxUpgradeLevel = 3;
        this.upgradeLevel = 1;

        this.player = player;
        this.coordinate = coordinate;

        // Time to construct the Farm
        this.totalHoursToConstruct = 30;
        this.currentHoursConstructed = 0;
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

    construct() {
        if (this.player.clock.getIsDone() || this.getIsConstructed()) {
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

    upgrade() {
        switch (this.upgradeLevel) {
        case 1:
            UpgradeLab2(this);
            addImageToCoordinate(this.img, this.coordinate, 'IMG');
            this.upgradeLevel = 2;
            break;
        case 2:
            console.log("This is a stubbed upgrade for lab level 3");
            // UpgradeLab3(this);
            // addImageToCoordinate(this.img, this.coordinate, 'IMG');
            // this.upgradeLevel = 3;
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
function UpgradeLab2(lab) {
    lab.name = "Advanced Lab";
    lab.desc = "Extra beakers, additional counter space, all makes for faster research time.";
    lab.totalHoursToConstruct = 24;
    lab.currentHoursConstructed = 0;
    lab.totalResourceCount += 205;
    lab.resourcePerHour = 10;
    lab.img = './IMG/places/lab2.png';
}
