import { RandomEvent } from "./RandomEvent";
import { PickAxe } from "../Tools/PickAxe";

export class EventLists {
    public static moveEvents : Array<RandomEvent> = [
        new RandomEvent("You tripped on some loose rocks and broke your wrist.", -10, -5, 0, 0, 0, null),
        new RandomEvent("You encounter a breathtaking vista.", 0, 10, 0, 0, 0, null),
        new RandomEvent("You found a nifty looking rock.", 0, 1, 0, 0, 1, null),
        new RandomEvent("You stumble across a pickaxe somebody left lying around.", 0, 0, 0, 0, 0, [new PickAxe()]),
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