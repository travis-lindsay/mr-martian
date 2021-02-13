export class Tile {

    isRoad : boolean;
    building: any;

    constructor(isRoad : boolean) {
        this.isRoad = isRoad;
        this.building = null;
    }

    getIsRoad() {
        return this.isRoad;
    }
    
    setBuilding(building : any) {
        this.building = building;
    }

    destroyBuilding() {
        this.building = null; 
    }
    
    getBuilding()  {
        return this.building;
    }
    
    hasBuilding() {
        return this.building != null;
    }

}