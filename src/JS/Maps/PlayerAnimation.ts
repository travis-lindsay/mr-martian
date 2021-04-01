import { Coordinate } from "./Coordinate";
import { ActionType } from "../Enums/ActionType";

export class PlayerAnimation {

    // Sprite sheet values
    DEFAULT_SPRITE : number = 0;
    WALK_RIGHT_SPRITE_1 : number = 100;
    WALK_RIGHT_SPRITE_2 : number = 200;
    WALK_LEFT_SPRITE_1 : number = 300;
    WALK_LEFT_SPRITE_2 : number = 400;
    WALK_DOWN_SPRITE_1 : number = 500;
    WALK_DOWN_SPRITE_2 : number = 600;
    WALK_UP_SPRITE_1 : number = 700;
    WALK_UP_SPRITE_2 : number = 800;
    RIGHT : number = 0;
    LEFT : number = 1;
    UP : number = 2;
    DOWN : number = 3;

    player: any;
    coordinateArray: any;
    position: number;
    counter: number;
    direction: number;

    constructor(player: any, coordinateArray: any) {
        this.player = player;
        this.coordinateArray = coordinateArray;
        this.position = 0; // The position of the background CSS property which toggles which sprite is displayed on the sheet
        this.counter = 0;
        this.direction = 0; // The direction the player is moving   
    }

    animatePlayerMovement(highlightTilesFunc : any) {
        // Add the players current position to path array
        this.coordinateArray.unshift(this.player.getCoordinate());
        let self = this;
        let interval = window.setInterval(function() {
            if (self.counter + 1 < self.coordinateArray.length && !self.player.isDead) {
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
                    let eventOccurred = self.player.clock.incrementTimeUsed(ActionType.Move);
                    if (eventOccurred) {
                        // Then stop moving, and let them look at the event
                        // For now, they'll just have to click back to where they were moving to continue
                        // We could potentially add some callback function when they acknowledge the event or something
                        clearInterval(interval);
                        self.resetPlayerSprite(self.coordinateArray[self.counter]);
                        self.player.setCoordinate(self.coordinateArray[self.counter]);
                        highlightTilesFunc();
                    }
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

    determinePlayerDirection(oldCoordinate : Coordinate, newCoordinate : Coordinate) {
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

    incrementPlayerIMGSprite(image : any) {
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
        document.getElementById("mainPlayerIMG")!.style.backgroundPosition = `-${this.position}px 0px`;
        image.style.backgroundPosition = `-${this.position}px 0px`;
    }

    resetPlayerSprite(coordinate : Coordinate) {
        let img : any = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number);
        this.position = this.DEFAULT_SPRITE;
        document.getElementById("mainPlayerIMG")!.style.backgroundPosition = `-${this.position}px 0px`;
        img.style.backgroundPosition = `-${this.position}px 0px`;
    }

    removePlayerIMG(coordinate : any) {
        let img : any = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number);
        let tile : any = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate());
        if (img == undefined) {
            return 0;
        }
        tile.removeChild(img);
    }

    addPlayerIMG(coordinate : Coordinate) {
        var tiles : any = document.getElementById(coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate());
        var playerIMG : any = document.createElement("DIV");
        playerIMG.style.backgroundImage =  'url(\'./src/IMG/spaceman/' + this.player.getImagePath() + '\')';
        playerIMG.classList.add("playerIMG");
        playerIMG.id = coordinate.getYCoordinate() + '_' + coordinate.getXCoordinate() + '_IMG_' + this.player.number;
        this.incrementPlayerIMGSprite(playerIMG);
        tiles.appendChild(playerIMG);
    }
}
