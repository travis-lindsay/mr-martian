export default class Utils {
    /*
        Params:
        String imgPath: relative path to the image you want to add
        Coordinate coord: Coordinate object of the tile you want to place the image on
        String id: string identifier to help access the image for future instances (e.g. document.getElementById("uniqueID"))
    */
    static addImageToCoordinate(imgPath : any, coord : any, id : any) {
        let existingImage : any = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_' + id);
        if (existingImage) {
            existingImage.src = imgPath;
        } else {
            var tiles : any = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate());
            var img : any = document.createElement("IMG");
            img.src = imgPath;
            img.classList.add("genericIMG");
            img.id = coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_' + id;
            tiles.appendChild(img);
        }
    }

    /*
        Params:
        String id: unique identifier of the image you would like to remove
        Coordinate coord: Coordinate object of the thing you want to remove
    */
    static removeImageFromCoordinate(id : any, coord : any) {
        var element : any = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_' + id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }
}
