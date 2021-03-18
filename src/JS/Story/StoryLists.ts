import { StoryTile } from "./StoryTile";

export class StoryLists {
    public static intro : Array<StoryTile> = [
        new StoryTile(`After months of travel your space station has finally arrived. Mars. 
        Your years of training have prepared you for this moment to finally be able to set foot on the red planet, 
        and gain some much anticipated (and protected) information regarding life on the planet.`
        , "./src/IMG/story/SpaceStation.png"),
        new StoryTile(`Once thought to be uninhabited, several races of intelligent life have since been discovered to be thriving on the planet.
		However, years of poorly executed inter-planetary politics have raised tensions higher than ever between Earth and Mars.`
        ,"./src/IMG/story/FlyingToMars.png"),
        new StoryTile(`Amidst this aggressive political climate, you've been given a rare opportunity by your corporation to carry out research on the planet. 
        But first you must setup everything you'll need to survive...`
        ,"./src/IMG/story/MarsLandscape.png"),
    ];
    public static act2 : Array<StoryTile> = [
        // TODO
    ];
    public static act3 : Array<StoryTile> = [
        // TODO
    ];
    public static act4 : Array<StoryTile> = [
        // TODO
    ];
    public static final : Array<StoryTile> = [
        // TODO
    ];
}