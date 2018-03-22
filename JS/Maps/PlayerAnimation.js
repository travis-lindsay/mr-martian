class PlayerAnimation {

    constructor(player, coordinateArray) {
        this.player = player;
        this.coordinateArray = coordinateArray;

        this.counter = 0;
    }

    animatePlayerMovement() {
        // Add the players current position to path array
        this.coordinateArray.unshift(this.player.getCoordinate());
        let self = this;
        let interval = window.setInterval(function() {
            if (self.counter + 1 < self.coordinateArray.length) {
                // Then we are still iterating through the path
                // First remove the img
                let fail = self.removePlayerIMG(self.coordinateArray[self.counter]);
                if (fail == 0) {
                    clearInterval(interval);
                } else {
                    // Then add it in the new position
                    self.counter += 1;
                    self.addPlayerIMG(self.coordinateArray[self.counter]);
                    self.player.clock.incrementTimeUsed();
                }
            }
            else {
                // stop the animation interval
                clearInterval(interval);
                self.player.setCoordinate(self.coordinateArray[self.counter]);
            }
        }, 250);

    }

    removePlayerIMG(coordinate) {
        let img = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number);
        let tile = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate());
        if (img == undefined) {
            return 0;
        }
        tile.removeChild(img);
    }

    addPlayerIMG(coordinate) {
        var tiles = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate());
        var playerIMG = document.createElement("IMG");
        playerIMG.src = './IMG/spaceman/' + this.player.getImagePath();
        playerIMG.classList.add("playerIMG");
        playerIMG.id = coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number;
        tiles.appendChild(playerIMG);
    }
}
