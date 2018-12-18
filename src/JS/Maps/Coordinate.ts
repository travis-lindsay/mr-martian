export class Coordinate {
  
    x : number;
    y : number;
    
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
    
    getXCoordinate() {
        return this.x;
    }
    
    getYCoordinate() {
        return this.y;
    }
    
    setXCoordinate(x : number) {
        this.x = x;
    }
    
    setYCoordinate(y : number) {
        this.y = y;
    }
}