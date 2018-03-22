/* 
    Breadth First Search algorithm to find shortest path through map based on given current and destination locations
    Params: A beginning and destination coordinate
    Returns: An array of coordinates of how to get to the destination
    Dependencies: Requires Coordinate.js
*/
class ShortestPathCalculator
{
    constructor(beginCoord, destinationCoord)
    {
        this.GameMap = [
            [0,0,0,0,0,0,0,0],
            [0,1,1,0,1,1,1,0],
            [0,1,1,0,1,1,1,0],
            [0,1,1,0,0,0,0,0],
            [0,0,0,0,0,1,1,0],
            [0,1,1,1,0,1,1,0],
            [0,1,1,1,0,1,1,0],
            [0,0,0,0,0,0,0,0],
            ];
        this.beginCoord = beginCoord;
        this.destinationCoord = destinationCoord;
    }
    
    calculateShortestPath()
    {
          // Each "location" will store its coordinates
          // and the shortest path required to arrive there
          var location = {
            x: this.beginCoord.getXCoordinate(),
            y: this.beginCoord.getYCoordinate(),
            path: [],
            status: 'Start'
          };
        
          // Initialize the queue with the start location already inside
          var queue = [location];
        
          // Loop through the grid searching for the goal
          while (queue.length > 0) {
            // Take the first location off the queue
            var currentLocation = queue.shift();
        
            var newLocation = this.exploreInDirection(currentLocation, 'North');
            if (newLocation.status === 'Goal') {
              return newLocation.path;
            } else if (newLocation.status === 'Valid') {
              queue.push(newLocation);
            }
        
            var newLocation = this.exploreInDirection(currentLocation, 'East');
            if (newLocation.status === 'Goal') {
              return newLocation.path;
            } else if (newLocation.status === 'Valid') {
              queue.push(newLocation);
            }
        
            var newLocation = this.exploreInDirection(currentLocation, 'South');
            if (newLocation.status === 'Goal') {
              return newLocation.path;
            } else if (newLocation.status === 'Valid') {
              queue.push(newLocation);
            }
        
            var newLocation = this.exploreInDirection(currentLocation, 'West');
            if (newLocation.status === 'Goal') {
              return newLocation.path;
            } else if (newLocation.status === 'Valid') {
              queue.push(newLocation);
            }
          }
        
          // No valid path found
          return false;
        
    }
    
    locationStatus(location) {
          var gridSize = 8;
          
          if (location.x < 0 || location.x >= gridSize || location.y < 0 || location.y >= gridSize) {
            // location is not on the grid--return false
            return 'Invalid';
          } else if (location.x == this.destinationCoord.getXCoordinate() && location.y == this.destinationCoord.getYCoordinate()) {
            return 'Goal';
          } else if (this.GameMap[location.y][location.x] !== 0) {
            // location is either an obstacle or has been visited
            return 'Blocked';
          } else {
            return 'Valid';
          }
    };
        
        
    // Explores the grid from the given location in the given
    // direction
     exploreInDirection(currentLocation, direction) {
        
          var dfl = currentLocation.x;
          var dft = currentLocation.y;
        
          if (direction === 'North') {
            dft -= 1;
          } else if (direction === 'East') {
            dfl += 1;
          } else if (direction === 'South') {
            dft += 1;
          } else if (direction === 'West') {
            dfl -= 1;
          }
          
          var newPath = currentLocation.path.slice();
          newPath.push(new Coordinate(dfl, dft));
        
          var newLocation = {
            x: dfl,
            y: dft,
            path: newPath,
            status: 'Unknown'
          };
          newLocation.status = this.locationStatus(newLocation);
        
          // If this new location is valid, mark it as 'Visited'
          if (newLocation.status === 'Valid') {
            this.GameMap[newLocation.y][newLocation.x] = 1; // 1 means either blocked or visited
          }
        
          return newLocation;
        };
    
}