import {Tile} from "./Tile";

export class Map
{
    gameMapTemplate : any;
    mapSize: number;
    gameMap: any;
    constructor()
    {
        this.gameMapTemplate = [
            [0,0,0,0,0,0,0,0],
            [0,1,1,0,1,1,1,0],
            [0,1,1,0,1,1,1,0],
            [0,1,1,0,0,0,0,0],
            [0,0,0,0,0,1,1,0],
            [0,1,1,1,0,1,1,0],
            [0,1,1,1,0,1,1,0],
            [0,0,0,0,0,0,0,0],
            ];
        this.mapSize = 8;
        this.gameMap = new Array();
        for (var i = 0; i < this.mapSize; i++) {
            	this.gameMap.push(new Array());
            	for (var j = 0; j < this.mapSize; j++) {
            		// If it is on the edge it is guarunteed to be a road...
            		if (i == 0 || i == 7 || j == 0 || j == 7) {
            			this.gameMap[i].push(new Tile(true));
            		} else if ((i == 3 && j >= 3) || (i == 4 && j <= 3) || (j == 3 && i <= 3) || (j == 4 && i >= 3)) {
            			this.gameMap[i].push(new Tile(true));
            		} else {
            			this.gameMap[i].push(new Tile(false));
            		}
            	}
            }
    }
    
    isRoad(y : number, x : number) {
        return this.gameMap[y][x].getIsRoad();
    }
    
    getTile(y : number, x : number) {
        return this.gameMap[y][x];
    }
    
}