var gameApp;

window.onload = function() {

	var clockpanel = {
		props: ['time'],
		template: `
  		       <div class="col-sm-12" style="margin-top: 15px;">
					<canvas id="solTime" width="200" height="200">
					</canvas>
				</div>
  		`,
		mounted: function() {
			var c = document.getElementById('solTime');
			var ctx = c.getContext('2d');
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.beginPath();
			ctx.arc(100, 100, 85, 0, Math.PI * 2);
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 4;
			ctx.stroke();
		},
		watch: {
			time: function() {
				var c = document.getElementById('solTime');
				var ctx = c.getContext('2d');
				ctx.clearRect(0, 0, c.width, c.height);
				ctx.beginPath();
				ctx.arc(100, 100, 85, 0, Math.PI * 2);
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 4;
				ctx.stroke();
				ctx.beginPath();
				let percentage = (this.time / 24) * 2;
				ctx.arc(100, 100, 85, Math.PI * 1.5, (1.5 + percentage) * Math.PI);
				ctx.lineWidth = 8;
				ctx.strokeStyle = "#ce400a";
				ctx.stroke();
			}
		}
	}

	gameApp = new Vue({
		el: '#app',
		data: {
			Players: [],
			Ships: [],
			currentPlayer: new Player(0),
			currentBuilding: new Well(),
			currentPlayerIndex: 0,
			JaredMap: new Map(),
			dayCount: 0,
			dropMenuIsOpen: false,
			tileMap: [],
			playerPick: true,
			mapSize: 8,
			sol: 0,
			buildOptionVisible: false,
			lastClickedTileCoord: new Coordinate(0, 0),
			hoveredBuildingDescription: "",
			hoveredBuildingBuildTime: 0,
			hoveredBuildingName: "",
            solEvents: [],
		},
		components: {
			'clockpanel': clockpanel,
		},
		created: function() {
			// This event is hit once the page is done loading
			this.tileMap = new Map();
		},
		methods: {
			handleTileClickEvent: function(event) {
				var id = event.target.id.split('_');
				if (id && id.length >= 2) {
					var y = id[0];
					var x = id[1];
					var isRoad = this.tileMap.isRoad(y, x);
				}
				else {
					// Now try again with the parent node
					var id = event.target.parentNode.id.split('_');
					var y = id[0];
					var x = id[1];
					var isRoad = this.tileMap.isRoad(y, x);
				}

				// if road tile, movePlayer();
				if (isRoad) {
					this.movePlayerTo(x, y);
				}
                else {
                    
                    if (this.checkIfInActionRange(parseInt(x), parseInt(y))) {
                        this.handlePlace(new Coordinate(x, y));
                    }					
				}
            },
            checkIfInActionRange: function (x, y) {
                var PlayerCoord = this.currentPlayer.getCoordinate();
                if (PlayerCoord.x == x + 1 && PlayerCoord.y == y) {
                    return true;
                }
                else if (PlayerCoord.x == x - 1 && PlayerCoord.y == y) {
                    return true;
                }
                else if (PlayerCoord.x == x && PlayerCoord.y == y + 1) {
                    return true;
                }
                else if (PlayerCoord.x == x && PlayerCoord.y == y - 1) {
                    return true;
                }
                else {
                    return false;
                }
            },
			highlightClickableTiles() {
				var surfaces = $('.surface');
				for (var surface of surfaces) {
					var id = surface.id.split('_');
					(this.checkIfInActionRange(parseInt(id[1]), parseInt(id[0])))
						? surface.classList.add('clickable')
                		: surface.classList.remove('clickable');
				}
			},
			closeAllModals: function() {
				this.closePlaceActionsModal();
				this.closeConstructionModal();
			},
			closeConstructionModal: function() {
                $("#constructionModal").modal("hide");
            },
            openConstructionModal: function() {
                $("#constructionModal").modal("show");
            },
            closePlaceActionsModal: function() {
                $("#placeActionsModal").modal("hide");
            },
            openPlaceActionsModal: function() {
                $("#placeActionsModal").modal("show");
            },
			openTurnResultsModal: function() {
				$("#turnResultsModal").modal("show");
			},
            closeTurnResultsModal: function() {
                $("#turnResultsModal").modal("hide");
            },
			movePlayerTo: function(x, y) {
				var currentCoord = this.currentPlayer.getCoordinate();
				var destinationCoord = new Coordinate(x, y);
				var calculator = new ShortestPathCalculator(currentCoord, destinationCoord);
				var coordinatePath = calculator.calculateShortestPath();
				// Trim path array to size of leftover hours
				let timeInDay = this.currentPlayer.clock.getTimeLeft();
				if (coordinatePath.length > timeInDay) {
					coordinatePath = coordinatePath.slice(0, timeInDay + 1);
				}
				console.log(coordinatePath);
				var animation = new PlayerAnimation(this.currentPlayer, coordinatePath);
				animation.animatePlayerMovement(this.highlightClickableTiles);
			},
			handlePlace: function(tileCoordinate) {
				
				this.lastClickedTileCoord = tileCoordinate;
				let tile = this.tileMap.getTile(tileCoordinate.getYCoordinate(), tileCoordinate.getXCoordinate());
				if (!tile.hasBuilding()) {
					// If no buildings, open construction options
					// this.buildOptionVisible = true;
					$("#buildOptionsModal").modal("show");
				} else {
					this.currentBuilding = tile.getBuilding();
					if (this.currentBuilding.player == this.currentPlayer) {
						if (!this.currentBuilding.getIsConstructed()) {
							// If there is a building, but it isn't constructed yet, open the build panel
							//this.buildingConstructionVisible = true;
							$("#constructionModal").modal("show");
						}
						else {
							$("#placeActionsModal").modal("show");
						}
					} else {
						// TODO, determine what the other players can do to your buildings
						alert("this doesn't belong to you");
					}
				}
			},
			updateDescription: function(name) {
				switch (name) {
					case "well":
						this.hoveredBuildingName = Well.name;
						this.hoveredBuildingBuildTime = 8;
						this.hoveredBuildingDescription = "An unsophisticated hole dug deep into the mars crust, used to extract water from the ground.";
						break;
					case "shelter":
						this.hoveredBuildingName = Shelter.name;
						this.hoveredBuildingBuildTime = 5;
						this.hoveredBuildingDescription = "Necessary for survival in the harsh and unpredictable environment of Mars."
						break;
					case "farm":
						this.hoveredBuildingName = Farm.name;
						this.hoveredBuildingBuildTime = 14;
						this.hoveredBuildingDescription = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";
						break;
					case "mine":
						this.hoveredBuildingName = Mine.name;
						this.hoveredBuildingBuildTime = 36;
						this.hoveredBuildingDescription = "Open pit mine for extracting iron ore from the rusted crust."
						break;
					case "lab":
						this.hoveredBuildingName = Lab.name;
						this.hoveredBuildingBuildTime = 42;
						this.hoveredBuildingDescription = "A designated location for researching this fascinating planet, and building a research base big enough to barter for your escape from Mars."
						break;
					default:
						this.hoveredBuildingDescription = "";
				}

			},
			constructBuilding: function(place) {
				if (!this.tileMap.getTile(this.lastClickedTileCoord.getYCoordinate(), this.lastClickedTileCoord.getXCoordinate()).hasBuilding()) {
					let coordinate = new Coordinate(this.lastClickedTileCoord.getXCoordinate(), this.lastClickedTileCoord.getYCoordinate());
					switch (place) {
						case "well":
							this.currentBuilding = new Well(this.currentPlayer, coordinate);
							break;
						case "shelter":
							this.currentBuilding = new Shelter(this.currentPlayer, coordinate);
							break;
						case "mine":
							this.currentBuilding = new Mine(this.currentPlayer, coordinate);
							break;
						case "lab":
							this.currentBuilding = new Lab(this.currentPlayer, coordinate);
							break;
						case "farm":
							this.currentBuilding = new Farm(this.currentPlayer, coordinate);
							break;
						default:
							console.log("no place specified");
					}
					this.tileMap.getTile(this.lastClickedTileCoord.getYCoordinate(), this.lastClickedTileCoord.getXCoordinate())
						.setBuilding(this.currentBuilding);
					addImageToCoordinate("IMG/spaceman/corner" + this.currentPlayer.number + ".png", this.lastClickedTileCoord, 'CORNER');
					addImageToCoordinate(this.currentBuilding.img, this.lastClickedTileCoord, 'IMG');
					addImageToCoordinate("IMG/Construction.png", this.lastClickedTileCoord, 'CONSTRUCTION');
					$("#buildOptionsModal").modal("hide");
					$("#constructionModal").modal("show");
				}
			},
			changeCurrentPlayer: function() {
				this.currentPlayerIndex += 1;
				if (this.currentPlayerIndex >= this.Players.length) {
					this.currentPlayerIndex = 0;
					this.incrementSol();
				}
				this.currentPlayer = this.Players[this.currentPlayerIndex];
				// Show the 'mission progress' dialog
				if (this.sol > 0) {
                    this.calcRationUsageAndEvents();
					this.openTurnResultsModal();
				}
			},
            calcRationUsageAndEvents() { // break this and other event code into other files
			    const HEALTHY_FOOD_RATION = 4;
			    const HEALTHY_WATER_RATION = 4;
			    const HEALTH_DEDUCTION = 2;

                let p = this.currentPlayer;
                if (p.water - p.waterRation < 0) {
                    p.water = 0;
                    p.waterRation = 0;
                    p.usedWaterRation = p.water;
                } else {
                    p.water -= p.waterRation;
                    p.usedWaterRation = p.waterRation;
                }
                if (p.food - p.foodRation < 0) {
                    p.food = 0;
                    p.foodRation = 0;
                    p.usedFoodRation = p.food;
                } else {
                    p.food -= p.foodRation;
                    p.usedFoodRation = p.foodRation;
                }

                // If the ration is below the healthy amount, then subtract health
                let healthMultiplier = p.usedFoodRation - HEALTHY_FOOD_RATION;
                p.health += healthMultiplier * HEALTH_DEDUCTION;
                healthMultiplier = p.usedWaterRation - HEALTHY_WATER_RATION;
                p.health += healthMultiplier * HEALTH_DEDUCTION;

                this.solEvents = []; // reset events
                this.solEvents.push(new SolEvent(
                    "You gained",
                    "Health",
                    false,
                    healthMultiplier * HEALTH_DEDUCTION
                ));
                this.solEvents.push(new SolEvent(
                    "Something catastrophic happened, and you lost",
                    "Limbs",
                    true,
                    13
                ));

                if (p.health <= 0) {
                    p.alive = false; // TODO, figure out what to do when somebody dies.
                }
            },
			incrementSol: function() {
				this.sol += 1;
			},
			pickPlayers: function(numPlayers) {
				for (var i = 0; i < numPlayers; i++) {
					this.Players.push(new Player(i));

					// TODO, clean this up, abstract it to a different class
					var coord = this.Players[i].getCoordinate();
					var tiles = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate());
					var playerIMG = document.createElement("IMG");
					playerIMG.src = './IMG/spaceman/' + this.Players[i].getImagePath();
					playerIMG.classList.add("playerIMG");
					playerIMG.id = coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_IMG_' + this.Players[i].number;
					tiles.appendChild(playerIMG);
				}
				// Set the currentPlayer to the first in the array
				this.currentPlayer = this.Players[0];
				// Hide the start menu
				this.playerPick = false;
				this.setShip();
			},
			setShip: function() {
				this.Ships.push(new Ship());
				var coord = this.Ships[0].getCoordinate();
				var tiles = document.getElementById(coord.getXCoordinate() + '_' + coord.getYCoordinate());
				var shipIMG = document.createElement("IMG");
				shipIMG.src = './IMG/' + this.Ships[0].getImagePath();
				shipIMG.classList.add("shipIMG");
				tiles.appendChild(shipIMG);
				var self = this;
				var stuff = this.Ships[0].GetAllStuff();
                shipIMG.onclick = function () {

                    if(self.checkIfInActionRange(parseInt(coord.x), parseInt(coord.y)))
                    {
                        self.currentPlayer.addFood(stuff[3]);
                        stuff[3] = 0;
                        self.currentPlayer.addWater(stuff[2]);
                        stuff[2] = 0;
                        self.currentPlayer.addSupply(stuff[0]);
                        self.currentPlayer.addSupply(stuff[1]);
                        self.currentPlayer.SupplyToString();
                        shipIMG.classList.remove("shipIMG");
                        tiles.removeChild(shipIMG);
                    }				
				};
			}
		}
	});
}
