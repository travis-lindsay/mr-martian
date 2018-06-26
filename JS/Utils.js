
/*
    Params:
    String imgPath: relative path to the image you want to add
    Coordinate coord: Coordinate object of the tile you want to place the image on
    String id: string identifier to help access the image for future instances (e.g. document.getElementById("uniqueID"))
 */
function addImageToCoordinate(imgPath, coord, id) {
    let existingImage = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_' + id);
    if (existingImage) {
        existingImage.src = imgPath;
    } else {
        var tiles = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate());
        var img = document.createElement("IMG");
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
function removeImageFromCoordinate(id, coord) {
    var element = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_' + id);
    element.parentNode.removeChild(element);
}