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
import { SolEvent } from './RandomEvents/SolEvent';
import { Ship } from './Ship';
import Utils from './Utils'
import { SolSummary } from './SolSummary';
import { FinalGame } from './FinalGame/FinalGame';
import { RandomEvent } from './RandomEvents/RandomEvent';
import { StoryTile } from './Story/StoryTile';
import { StoryController } from './Story/StoryController';
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

				// White circle
				ctx.beginPath();
				ctx.arc(100, 100, 85, 0, Math.PI * 2);
				ctx.strokeStyle = "#ffffff";
				ctx.lineWidth = 4;
				ctx.stroke();

				// Tick marks around the clock face
				let x = 100;
				let y = 100;
				let radius = 75;
				let n = 24;
				var hashSpacing = Math.PI * 2 / n;
				var innerPoints = [];
				var outerPoints = [];
				ctx.strokeStyle = "#686666";
				ctx.lineWidth = 1;
				for (var i = 0; i < n; i++ ) { // For each tick mark (for all 24 hrs), find it's position based on the given radius
					var a = hashSpacing * i;
					innerPoints.push( { x: x + Math.cos( a ) * radius, y: y + Math.sin( a ) * radius } );
				} 
				radius = 88; // Setting the outer radius
				for (var i = 0; i < n; i++ ) {
					var a = hashSpacing * i;
					outerPoints.push( { x: x + Math.cos( a ) * radius, y: y + Math.sin( a ) * radius } );
				} 
				for (let i = 0; i < n; i++) { // render the ticks
					ctx.beginPath();
					ctx.moveTo( outerPoints[i].x, outerPoints[i].y );
					ctx.lineTo( innerPoints[i].x, innerPoints[i].y );
					ctx.closePath();
					ctx.stroke();
				}

				// Orange circle
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
			currentRandomEvent: new RandomEvent("",0,0,0,0,0,null),
			storyController: new StoryController(),
			currentStories: new Array<StoryTile>(),
			currentStoryIndex: 0,
			currentPlayerIndex: 0,
			dayCount: 0,
			dropMenuIsOpen: false,
			tileMap: new Map(),
			playerPick: true,
			finalGameShow: false,
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
			confirmationDialogMsg: "",
			deathDialogMsg: "",
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
					if (this.currentPlayer.coordinate.x != x || this.currentPlayer.coordinate.y != y) {
						this.movePlayerTo(x, y);
					}
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
				this.closePropagandaModal();
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
			closePropagandaModal: function() {
                $("#propagandaModal").modal("hide");
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
			openConfirmationModal: function(msg : string, yesCallback : any, noCallback : any) {
				this.confirmationDialogMsg = msg;
			
				$('#btnYes').click(function() {
					$("#confirmationModal").modal("hide");
					yesCallback();
				});
				$('#btnNo').click(function() {
					$("#confirmationModal").modal("hide");
					noCallback();
				});
				$("#confirmationModal").modal("show");
			},
            closeConfirmationModal: function() {
                $("#confirmationModal").modal("hide");
			},
			openStoryModal: function(closeCallback : any) {
				$('#btnCloseStory').click(function() {
					$("#storyModal").modal("hide");
					closeCallback();
				});
				$('#storyModal').modal({backdrop: 'static', keyboard: false}) 
				$("#storyModal").modal("show");
			},
			closeStoryModal: function() {
                $("#storyModal").modal("hide");
			},
			openDeathModal: function(closeCallback : any) {
				// this.changeCurrentPlayer()
				$('#btnDeathClose').click(function() {
					$("#deathModal").modal("hide");
					closeCallback();
				});
				$('#deathModal').modal({backdrop: 'static', keyboard: false}) 
				$("#deathModal").modal("show");
			},
			closeDeathModal: function() {
				$("#deathModal").modal("hide");
			},
			getCurrentPlayer() {
				return this.currentPlayer;
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
						// Open propaganda modal
						$("#propagandaModal").modal("show");
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
				return this.buildings.filter(building => building.player == player );
			},
			nextStoryModalClicked() {
				if (this.currentStoryIndex + 1 < this.currentStories.length) {
					this.currentStories[this.currentStoryIndex].StopAnimation();
					this.currentStoryIndex += 1;
					this.currentStories[this.currentStoryIndex].RunAnimation(0);
				}
			},
			previousStoryModalClicked() {
				if (this.currentStoryIndex -1 >= 0) {
					this.currentStories[this.currentStoryIndex].StopAnimation();
					this.currentStoryIndex -= 1;
					this.currentStories[this.currentStoryIndex].RunAnimation(0);
				}
			},
			changeCurrentPlayer: function() {
				this.currentPlayerIndex += 1;
				if (this.currentPlayerIndex >= this.Players.length) {
					this.currentPlayerIndex = 0;
					this.incrementSol();
				}

				// Check if player is dead
				// Check if all players are dead... End game?
				let deadCount = 0;
				while (this.Players[this.currentPlayerIndex].isDead) {
					deadCount++;
					if (deadCount >= this.Players.length) {
						alert("Game Over");
						// TODO, maybe trigger some specific story slides, or endgame text and show end game stuff, scores, etc.
						location.reload();
						return;
					}
					this.currentPlayerIndex += 1;
					if (this.currentPlayerIndex >= this.Players.length) {
						this.currentPlayerIndex = 0;
						this.incrementSol();
					}
				}

				this.currentPlayer = this.Players[this.currentPlayerIndex];
				// Show the 'mission progress' dialog
				this.solSummary = SolSummary.getSolSummary(this.sol);
				if (this.sol > 0) {
                    this.calcRationUsageAndEvents();
				}
				// Check if player died from exposure, if so recurse to switch players turns
				if (this.currentPlayer.isDead) {
					return;
					// this.changeCurrentPlayer();
				}
				this.highlightClickableTiles();

				// Check if it's player 0's turn again, and the sol matches the correct number, then display the story modal
				// get some sort of on close event to trigger opening the turn results modal
				if (this.currentPlayerIndex === 0 && this.storyController.storyShouldHappen(this.sol)) {
					this.currentStories = this.storyController.getStoryList(this.sol);
					this.currentStoryIndex = 0;
					this.openStoryModal(() => {
						this.openTurnResultsModal();
						this.currentStories[this.currentStoryIndex].RunAnimation(0);
					});
				} else {
					this.openTurnResultsModal();
				}
			},
            calcRationUsageAndEvents() { // TODO, break this and other event code into other files
			    const HEALTHY_FOOD_RATION = 4;
			    const HEALTHY_WATER_RATION = 4;
			    const HEALTH_DEDUCTION = 2;
				let totalHealthChange = 0;
				let totalMoraleChange = 0;
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

                if (!this.currentPlayer.isPlayerInShelter()) {
                    this.solEvents.push(new SolEvent(
                        "You spent a miserable night braving the harsh Mars elements",
                        "Health",
                        true,
                        -25
					));
					this.solEvents.push(new SolEvent(
                        "Due to your sleepless night, you had extra time to think about how lonely you are. You lost",
                        "Morale",
                        true,
                        -15
                    ));
					totalHealthChange -= 25;
					totalMoraleChange -= 15;
                } else {
					let playersBuildings : Building[] = this.getPlayerBuildings(p);
					let shelters : Building[] = playersBuildings.filter(building => building.coordinate === p.shelterCoordinate);
					if (shelters.length > 0) {
						let shelter : Shelter = <Shelter> shelters[0];
						switch (shelter.upgradeLevel) {
							case 1 : 
								this.solEvents.push(new SolEvent(
									"Your shelter kept you safe, but it is a bit shabby. You lost",
									"Morale",
									true,
									-5
								));
								totalMoraleChange -= 5;
								break;
							case 2:
								this.solEvents.push(new SolEvent(
									"Your cozy shack is starting to feel a little like home. You gained",
									"Morale",
									false,
									1
								));
								totalMoraleChange += 1;
								break;
							case 3:
								this.solEvents.push(new SolEvent(
									"Your shelter is so nice you just might stick around on Mars. You gained",
									"Morale",
									false,
									10
								));
								totalMoraleChange += 10;
								break;
						}
					}
				}
                // Now change the health, then calculate the difference
				p.changeHealth(totalHealthChange);
				p.changeMorale(totalMoraleChange);
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

				// Change the amount of time the player has in the day based on their morale
				// For every 4 pts of morale take away one hour of their time
				// Don't start taking away time for morale until lower than 90
				if (p.morale < 90) {
					let hoursLost = Math.floor((90 - p.morale) / 4);
					p.clock.setUsedtime(hoursLost);
					if (hoursLost > 0) {
						this.solEvents.push(new SolEvent(
							"Due to poor morale, you wasted " + hoursLost + " hours wallowing in self pity",
							"Hours",
							true,
							-hoursLost
						));
					}
				}

                // Check if player has bit the bucket
                if (p.isPlayerDead()) {
					this.handlePlayerDied();
                }
            },
			handlePlayerDied: function() {
				// Replace the image of the player with the grave image
				var animation = new PlayerAnimation(this.currentPlayer, null);
				animation.removePlayerIMG(this.currentPlayer.coordinate);
				Utils.addImageToCoordinate("./src/IMG/Places/Grave.png", this.currentPlayer.coordinate, "P_Grave_" + this.currentPlayer.number);
				// Display some sort of dialog showing that the player died
				this.deathDialogMsg = this.currentPlayer.name + " has perished.";
				this.openDeathModal(() => { this.changeCurrentPlayer() });
			},
			incrementSol: function() {
				this.sol += 1;
			},
			startFinalGame: function() {
				var game = new FinalGame();
				this.finalGameShow = true;
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
				this.setShip();

				// Set the intro story slides and open the modal
				// When that is acknowledged / closed then open the turn results modal
				this.currentStories = this.storyController.getStoryList(0);
				this.openStoryModal(() => {
					// Open the mission progress menu with start instructions
					this.solSummary = SolSummary.getSolSummary(this.sol);
					this.openTurnResultsModal();
				});
				this.currentStories[this.currentStoryIndex].RunAnimation(0);
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
