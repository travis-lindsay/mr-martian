import { gameApp } from "../game";
import { ActionType } from "../Enums/ActionType";
import { EventLists } from "./EventLists";
import { RandomEvent } from "./RandomEvent";
import { Player } from "../Player";

/*
 * RandomEventController: Determines if a random event will occur, and generates / applies the event that happened
 */
export class RandomEventController {

    // This is the base probability for a generic event, specific events will have their own probability
    // max is the number that the Math.random() is multiplied by
    // min is the number that the random number generated is compared to
    // ie if you want 3% chance, then max = 100, and min = 3
    private eventShouldHappen(max : number, min : number) {   // returns a boolean, true if an event will happen, false if it won't. More often return false
        var chanceOfEvent = Math.floor(Math.random() * max);
        if(chanceOfEvent < min) {
            return true;
        }
        else {
            return false;
        }
    }

    public tryGenerateRandomEvent(actionType : ActionType) {
        let event : RandomEvent | null = null;
        switch(actionType) {
            case ActionType.Build:
                // 5% chance during build
                if (this.eventShouldHappen(100, 5)) {
                    event = EventLists.buildingEvents[Math.floor(Math.random() * EventLists.buildingEvents.length) + 0];
                }
                break;
            case ActionType.Move:
                // 15% chance during move
                if (this.eventShouldHappen(100, 15)) {
                    event = EventLists.moveEvents[Math.floor(Math.random() * EventLists.moveEvents.length) + 0];
                }
                break;
            case ActionType.Mine:
                // 10% chance during mine
                if (this.eventShouldHappen(100, 10)) {
                    event = EventLists.mineEvents[Math.floor(Math.random() * EventLists.mineEvents.length) + 0];
                }
                break;
        }
        if (event) {
            // set current random event
            gameApp.currentRandomEvent = event;
            // apply event
            this.applyEvent(event);
            // open modal with info
            this.openRandEventPopUp();
        }
        return event !== null;
    }

    applyEvent(event : RandomEvent) {
        // apply the effects of the event to the player
        let player : Player = gameApp.currentPlayer;
        player.addFood(event.foodAmount);
        player.addWater(event.waterAmount);
        player.addStone(event.stoneAmount);
        player.changeHealth(event.healthAmount);
        player.changeMorale(event.moraleAmount);
        player.addInventoryItems(event.inventoryItems);
    }

    openRandEventPopUp() {
        $("#randEventPopUp").modal("show");
    }

    closeRandEventPopUp() {
        $("randEventPopUp").modal("hide");
    }

    // have lots of different classes, and then choose randomly from a set of class taht all extend RandomMarsEvents
    // make both good an bad events
    // determine how frequent events occur -- do that in the Clock.ts file, in the IncrementTime function

    //Ideas
        // have random events at the begining of each turn?
        // have random events occur while moving?
            // tripping
            // lost bearings
            // 
        // have random events occur while building stuff
        // have random events occur while using a building?
        // have random stuff crash down or appear on empty tiles
        // potentially get it to stop your movement
}