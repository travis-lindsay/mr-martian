import { StoryLists } from "./StoryLists";
import { StoryTile } from "./StoryTile";

export class StoryController 
{
    public storyShouldHappen(sol : number) { 
        return sol === 0 || sol === 5 || sol === 10 || sol === 15 || sol === 20;
    }

    public getStoryList(sol : number) : Array<StoryTile> {
        switch(sol) {
            case 0 : {
                return StoryLists.intro;
            }
            case 5 : {
                return StoryLists.act2;
            }
            case 10 : {
                return StoryLists.act3;
            }
            case 15 : {
                return StoryLists.act4;
            }
            case 20 : {
                return StoryLists.final;
            }
            default : {
                return StoryLists.intro;
            }
        }
    }
}