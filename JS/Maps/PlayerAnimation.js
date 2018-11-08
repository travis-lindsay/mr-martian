class PlayerAnimation {

    constructor(player, coordinateArray) {
        this.player = player;
        this.coordinateArray = coordinateArray;
        this.position = 0; // The position of the background CSS property which toggles which sprite is displayed on the sheet
        this.counter = 0;
        this.direction = 0; // The direction the player is moving

        // Sprite sheet values
        this.DEFAULT_SPRITE = 0;
        this.WALK_RIGHT_SPRITE_1 = 100;
        this.WALK_RIGHT_SPRITE_2 = 200;
        this.WALK_LEFT_SPRITE_1 = 300;
        this.WALK_LEFT_SPRITE_2 = 400;
        this.WALK_DOWN_SPRITE_1 = 500;
        this.WALK_DOWN_SPRITE_2 = 600;
        this.WALK_UP_SPRITE_1 = 700;
        this.WALK_UP_SPRITE_2 = 800;

        this.RIGHT = 0;
        this.LEFT = 1;
        this.UP = 2;
        this.DOWN = 3;
    }

    animatePlayerMovement(highlightTilesFunc) {
        // Add the players current position to path array
        this.coordinateArray.unshift(this.player.getCoordinate());
        let self = this;
        let interval = window.setInterval(function() {
            if (self.counter + 1 < self.coordinateArray.length) {
                // Then we are still iterating through the path
                // First remove the img
                let fail = self.removePlayerIMG(self.coordinateArray[self.counter]);
                if (fail == 0) {
                    console.log('Something went drastically wrong removing player img');
                    clearInterval(interval);
                } else {
                    // Then add it in the new position
                    self.counter += 1;
                    let newCoordinate = self.coordinateArray[self.counter];
                    let oldCoordinate = self.coordinateArray[self.counter - 1]; // TODO, check for bounds
                    self.determinePlayerDirection(oldCoordinate, newCoordinate);
                    self.addPlayerIMG(newCoordinate);
                    self.player.clock.incrementTimeUsed();
                }
            }
            else {
                // stop the animation interval
                clearInterval(interval);
                self.resetPlayerSprite(self.coordinateArray[self.counter]);
                self.player.setCoordinate(self.coordinateArray[self.counter]);
                highlightTilesFunc();
            }
        }, 250);
    }

    determinePlayerDirection(oldCoordinate, newCoordinate) {
        let oldX = oldCoordinate.getXCoordinate();
        let newX = newCoordinate.getXCoordinate();
        let oldY = oldCoordinate.getYCoordinate();
        let newY = newCoordinate.getYCoordinate();

        if (newX > oldX) {
            this.direction = this.RIGHT;
        } else if (newX < oldX) {
            this.direction = this.LEFT;
        } else if (newY > oldY) {
            this.direction = this.DOWN;
        } else if (newY < oldY) {
            this.direction = this.UP;
        }
    }

    incrementPlayerIMGSprite(image) {
        switch (this.direction) {
            case this.RIGHT:
                this.position = this.position == this.WALK_RIGHT_SPRITE_1 ? this.WALK_RIGHT_SPRITE_2 : this.WALK_RIGHT_SPRITE_1;
                break;
            case this.LEFT:
                this.position = this.position == this.WALK_LEFT_SPRITE_1 ? this.WALK_LEFT_SPRITE_2 : this.WALK_LEFT_SPRITE_1;
                break;
            case this.UP:
                this.position = this.position == this.WALK_UP_SPRITE_1 ? this.WALK_UP_SPRITE_2 : this.WALK_UP_SPRITE_1;
                break;
            case this.DOWN:
                this.position = this.position == this.WALK_DOWN_SPRITE_1 ? this.WALK_DOWN_SPRITE_2 : this.WALK_DOWN_SPRITE_1;
                break;
            default:
                this.position = this.DEFAULT_SPRITE;
        }
        document.getElementById("mainPlayerIMG").style.backgroundPosition = `-${this.position}px 0px`;
        image.style.backgroundPosition = `-${this.position}px 0px`;
    }

    resetPlayerSprite(coordinate) {
        let img = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number);
        this.position = this.DEFAULT_SPRITE;
        document.getElementById("mainPlayerIMG").style.backgroundPosition = `-${this.position}px 0px`;
        img.style.backgroundPosition = `-${this.position}px 0px`;
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
        var playerIMG = document.createElement("DIV");
        playerIMG.style.backgroundImage =  'url(\'./IMG/spaceman/' + this.player.getImagePath() + '\')';
        playerIMG.classList.add("playerIMG");
        playerIMG.id = coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number;
        this.incrementPlayerIMGSprite(playerIMG);
        tiles.appendChild(playerIMG);
    }
}
