import { RandomEvent } from "./RandomEvent";
import { PickAxe } from "../Tools/PickAxe";
import { Spear } from "../Tools/Spear";
import { Axe } from "../Tools/Axe";

export class EventLists {
    public static moveEvents : Array<RandomEvent> = [
        new RandomEvent("You tripped on some loose rocks and broke your wrist.", -10, -5, 0, 0, 0, null),
        new RandomEvent("You encounter a breathtaking vista.", 0, 10, 0, 0, 0, null),
        new RandomEvent("You found a nifty looking rock.", 0, 1, 0, 0, 1, null),
        new RandomEvent("A rover speeds by and kicks a rock at your helmet, chipping it and obscuring your vision.", 0, -1, 0, 0, 0, null),
        new RandomEvent("You stop to rest for a moment, and ponder the orange-ness of everything around you", 2, 1, 0, 0, 0, null),
        new RandomEvent("You see a shooting star", 0, 1, 0, 0, 0, null),
        new RandomEvent("You found a pile of neatly stacked rocks. Possibly a trail marker of some kind, or a sign of intelligent life. You decide to take the rocks anyways.", 0, 0, 0, 0, 3, null),
        new RandomEvent("You stumble across a pickaxe somebody left lying around.", 0, 0, 0, 0, 0, [new PickAxe()]),
        new RandomEvent("You step on a spear", -10, -2, 0, 0, 0, [new Spear()]),
        new RandomEvent("You found a box full of tools... Finders keepers", 0, 5, 0, 0, 0, [new Axe(), new PickAxe()]),
        new RandomEvent("You come across a sizeable chunk of ice... Hopefully it's safe to drink", 0, 0, 0, 5, 0, null),
        new RandomEvent("You find a dusty but unopened box full of protein bars", 0, 0, 5, 0, 0, null),
    ];
    public static buildingEvents : Array<RandomEvent> = [
        new RandomEvent("You forgot to apply sunscreen and get a wicked sunburn on your face.", -1, 0, 0, 0, 0, null),
        new RandomEvent("After all this hard work, you're noticing some significant gains in your fitness.", 1, 10, 0, 0, 0, null),
    ];
    public static mineEvents : Array<RandomEvent> = [
        new RandomEvent("You develop some wicked blisters on your hands.", -1, -5, 0, 0, 0, null),
        new RandomEvent("You pause for a moment, and reflect on your incredible work ethic and accomplishments.", 0, 5, 0, 0, 0, null),
    ];
}