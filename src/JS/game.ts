import Vue from 'vue';
import { Player } from './Player';
import { Well } from './MiningLocations/Well';
import { Shelter } from './MiningLocations/Shelter';
import { Lab } from './MiningLocations/Lab';
import { Farm } from './MiningLocations/Farm';
import { Mine } from './MiningLocations/Mine';
import { Coordinate } from './Maps/Coordinate';
import { PlayerAnimation } from './Maps/PlayerAnimation';
import { ShortestPathCalculator } from './Maps/DetermineShortestPath';
import { Map } from './Maps/Map';
import { Building } from './MiningLocations/Building';
import { SolEvent } from './SolEvent';
import { Ship } from './Ship';
import Utils from './Utils'
import { SolSummary } from './SolSummary';
export var gameApp : any;

window.onload = function() {

	$(function () {
		$('[data-toggle="tooltip"]').tooltip() // enable tooltips
	  });

	const clockpanel = Vue.extend({
		props: ['time'],
		template: `
  		       <div class="col-sm-12" style="margin-top: 15px;">
					<canvas id="solTime" width="200" height="200">
					</canvas>
				</div>
  		`,
		mounted: function() {
			var c : any = document.getElementById('solTime');
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
				var c : any = document.getElementById('solTime');
				var ctx = c.getContext('2d');
				ctx.clearRect(0, 0, c.width, c.height);
				ctx.beginPath();
				ctx.arc(100, 100, 85, 0, Math.PI * 2);
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 4;
				ctx.stroke();
				ctx.beginPath();
				let curTime : any = this.time; // hack to get typescript to like me
				let percentage = (curTime / 24) * 2;
				ctx.arc(100, 100, 85, Math.PI * 1.5, (1.5 + percentage) * Math.PI);
				ctx.lineWidth = 8;
				ctx.strokeStyle = "#ce400a";
				ctx.stroke();
			}
		}
	});

	gameApp = new Vue({
		el: '#app',
		data: {
			Players: new Array<Player>(),
			Ships: new Array<Ship>(),
			currentPlayer: new Player(0),
			currentBuilding: new Building(),
			currentPlayerIndex: 0,
			dayCount: 0,
			dropMenuIsOpen: false,
			tileMap: new Map(),
			playerPick: true,
			mapSize: 8,
			sol: 0,
			buildOptionVisible: false,
			lastClickedTileCoord: new Coordinate(0, 0),
			hoveredBuildingDescription: "",
			hoveredBuildingBuildTime: 0,
			hoveredBuildingName: "",
			solEvents: new Array<SolEvent>(),
			solSummary: "",
			buildings: new Array<Building>(),
		},
		components: {
			'clockpanel': clockpanel,
		},
		created: function() {
			// This event is hit once the page is done loading
			this.tileMap = new Map();
		},
		methods: {
			handleTileClickEvent: function(event : any) {
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
            checkIfInActionRange: function (x : number, y : number) {
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
				var surfaces : any = $('.surface');
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
				let reqs: any = this.currentBuilding.nextUpgradeReqs;
				let newTooltip : string = `<span style="color:orange">Required Resources:</span><br>Food: ${reqs.food}<br>Water: ${reqs.water}<br>Stone: ${reqs.stone}`;
				$('#buildReqsTooltip').attr('data-original-title', newTooltip).tooltip('update');
                $("#placeActionsModal").modal("show");
            },
			openTurnResultsModal: function() {
				$("#turnResultsModal").modal("show");
			},
            closeTurnResultsModal: function() {
                $("#turnResultsModal").modal("hide");
            },
			movePlayerTo: function(x : number, y : number) {
			    this.currentPlayer.removePlayerFromShelter();
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
			handlePlace: function(tileCoordinate : Coordinate) {
				
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
							this.openPlaceActionsModal();
						}
					} else {
						// TODO, determine what the other players can do to your buildings
						alert("this doesn't belong to you");
					}
				}
			},
			updateDescription: function(name : string) {
				switch (name) {
					case "well":
						this.hoveredBuildingName = "Well";
						this.hoveredBuildingBuildTime = 8;
						this.hoveredBuildingDescription = "An unsophisticated hole dug deep into the mars crust, used to extract water from the ground.";
						break;
					case "shelter":
						this.hoveredBuildingName = "Shelter";
						this.hoveredBuildingBuildTime = 5;
						this.hoveredBuildingDescription = "Necessary for survival in the harsh and unpredictable environment of Mars."
						break;
					case "farm":
						this.hoveredBuildingName = "Farm";
						this.hoveredBuildingBuildTime = 14;
						this.hoveredBuildingDescription = "Rudimentary farm made of the finest dust on Mars. Requires water and fertilizer to grow.";
						break;
					case "mine":
						this.hoveredBuildingName = "Mine";
						this.hoveredBuildingBuildTime = 36;
						this.hoveredBuildingDescription = "Open pit mine for extracting iron ore from the rusted crust."
						break;
					case "lab":
						this.hoveredBuildingName = "Lab";
						this.hoveredBuildingBuildTime = 42;
						this.hoveredBuildingDescription = "A designated location for researching this fascinating planet, and building a research base big enough to barter for your escape from Mars."
						break;
					default:
						this.hoveredBuildingDescription = "";
				}

			},
			constructBuilding: function(place : string) {
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
					Utils.addImageToCoordinate("./src/IMG/spaceman/corner" + this.currentPlayer.number + ".png", this.lastClickedTileCoord, 'CORNER');
					Utils.addImageToCoordinate(this.currentBuilding.img, this.lastClickedTileCoord, 'IMG');
					Utils.addImageToCoordinate("./src/IMG/Construction.png", this.lastClickedTileCoord, 'CONSTRUCTION');
					this.buildings.push(this.currentBuilding);
					$("#buildOptionsModal").modal("hide");
					$("#constructionModal").modal("show");
				}
			},
			getPlayerBuildings(player : Player) {
				return this.buildings.filter(building  => { player.number == building!.player!.number });
			},
			changeCurrentPlayer: function() {
				this.currentPlayerIndex += 1;
				if (this.currentPlayerIndex >= this.Players.length) {
					this.currentPlayerIndex = 0;
					this.incrementSol();
				}
				this.currentPlayer = this.Players[this.currentPlayerIndex];
				// Show the 'mission progress' dialog
				this.solSummary = SolSummary.getSolSummary(this.sol);
				if (this.sol > 0) {
                    this.calcRationUsageAndEvents();
				}
				this.openTurnResultsModal();
				this.highlightClickableTiles();
			},
            calcRationUsageAndEvents() { // TODO, break this and other event code into other files
			    const HEALTHY_FOOD_RATION = 4;
			    const HEALTHY_WATER_RATION = 4;
			    const HEALTH_DEDUCTION = 2;
			    let totalHealthChange = 0;
                this.solEvents = []; // reset events

                let p = this.currentPlayer;
			    let previousHealth = p.health;
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
                totalHealthChange += healthMultiplier * HEALTH_DEDUCTION;
                if (healthMultiplier > 0) {
                    this.solEvents.push(new SolEvent(
                        "Due to excellent food consumption you gained",
                        "Health",
                        false,
                        healthMultiplier * HEALTH_DEDUCTION
                    ))
                } else if (healthMultiplier < 0){
                    this.solEvents.push(new SolEvent(
                        "Due to poor food consumption you lost",
                        "Health",
                        true,
                        healthMultiplier * HEALTH_DEDUCTION
                    ))
                }

                healthMultiplier = p.usedWaterRation - HEALTHY_WATER_RATION;
                totalHealthChange += healthMultiplier * HEALTH_DEDUCTION;
                if (healthMultiplier > 0) {
                    this.solEvents.push(new SolEvent(
                        "Due to copious water consumption you gained",
                        "Health",
                        false,
                        healthMultiplier * HEALTH_DEDUCTION
                    ))
                } else if (healthMultiplier < 0){
                    this.solEvents.push(new SolEvent(
                        "Due to a lack of water consumption you lost",
                        "Health",
                        true,
                        healthMultiplier * HEALTH_DEDUCTION
                    ))
				}
				
				let playersBuildings : Building[] = this.getPlayerBuildings(p);
				let shelters : Building[] = playersBuildings.filter(building => {building instanceof Shelter}); // TODO, decrease moral

                if (!this.currentPlayer.isPlayerInShelter()) {
                    this.solEvents.push(new SolEvent(
                        "You spent a miserable night braving the harsh Mars elements",
                        "Health",
                        true,
                        -25
                    ));
                    totalHealthChange -= 25;
                }
                // Now change the health, then calculate the difference
                p.changeHealth(totalHealthChange);
                let healthDifference = p.health - previousHealth;
                if (healthDifference > 0) {
                    this.solEvents.push(new SolEvent(
                        "Overall, you gained",
                        "Health",
                        false,
                        healthDifference
                    ));
                } else if (healthDifference < 0) {
                    this.solEvents.push(new SolEvent(
                        "Overall, you lost",
                        "Health",
                        true,
                        healthDifference
                    ));
                }

                // Check if player has bit the bucket
                if (p.isPlayerDead()) {
                    alert(p.name + ' died a terrible death'); // TODO, figure out to do when player dies
                }
            },
			incrementSol: function() {
				this.sol += 1;
			},
			pickPlayers: function(numPlayers : number) {
				for (var i = 0; i < numPlayers; i++) {
					this.Players.push(new Player(i));

					// TODO, clean this up, abstract it to a different class
					var coord = this.Players[i].getCoordinate();
					var tiles : any = document.getElementById(coord.getYCoordinate() + '_' + coord.getXCoordinate());
					var playerIMG = document.createElement("DIV");
					playerIMG.style.backgroundImage = 'url(\'./src/IMG/spaceman/' + this.Players[i].getImagePath() + '\')';
					playerIMG.style.backgroundPosition = `0px 0px`;
					playerIMG.classList.add("playerIMG");
					playerIMG.id = coord.getYCoordinate() + '_' + coord.getXCoordinate() + '_IMG_' + this.Players[i].number;
					tiles.appendChild(playerIMG);
				}
				// Set the currentPlayer to the first in the array
				this.currentPlayer = this.Players[0];
				// Hide the start menu
				this.playerPick = false;
				// Open the mission progress menu with start instructions
				this.solSummary = SolSummary.getSolSummary(this.sol);
				this.openTurnResultsModal();
				this.setShip();
			},
			setShip: function() {
				this.Ships.push(new Ship());
				var coord : Coordinate = this.Ships[0].getCoordinate();
				var tiles : any = document.getElementById(coord.getXCoordinate() + '_' + coord.getYCoordinate());
				var shipIMG : any = document.createElement("IMG");
				shipIMG.src = './src/IMG/' + this.Ships[0].getImagePath();
				shipIMG.classList.add("shipIMG");
				tiles.appendChild(shipIMG);
				var self = this;
				var stuff = this.Ships[0].GetAllStuff();
                shipIMG.onclick = function () {

                    if(self.checkIfInActionRange(coord.x, coord.y))
                    {
                        self.currentPlayer.addFood(stuff[3]);
                        stuff[3] = 0;
                        self.currentPlayer.addWater(stuff[2]);
                        stuff[2] = 0;
                        self.currentPlayer.addSupply(stuff[0]);
                        self.currentPlayer.addSupply(stuff[1]);
                        shipIMG.classList.remove("shipIMG");
                        tiles.removeChild(shipIMG);
                    }				
				};
			}
		}
	});
}
