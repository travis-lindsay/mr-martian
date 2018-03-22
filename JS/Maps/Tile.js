class Tile {

    constructor(isRoad) {
        this.isRoad = isRoad;
        // this.items = new Array();
        this.building = null;
    }

    getIsRoad() {
        return this.isRoad;
    }
    
    setBuilding(building) {
        this.building = building;
    }
    
    getBuilding()  {
        return this.building;
    }

    /*addItem(item) {
        this.items.push(item);
    }*/

    /*hasPlace() {
        // At this point, I imagine we should only allow 1 place or thing to be here... But keeping it an array to make it scalable
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == 'Place') {
                return true;
            }
        }
        return false;
    }*/
    
    hasBuilding() {
        return this.building != null;
    }

/*    getItems() {
        return this.items;
    }*/

}