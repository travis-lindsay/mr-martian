/*
 * SolSummary: Basically a bunch of static strings that get randomly loaded into the 'Mission Progress' dialog each sol.
 */
export class SolSummary {
    private static START_SOL : number = 0;
    private static FINAL_SOL : number = 20; // TODO, pull these from a global context once we implement end-game stuff
    private static startInstructions : string = `Welcome to Mars... Your rescue ship is coming to get you on sol ${SolSummary.FINAL_SOL.toString()},
        as long as you can survive to that point. Tips: Set healthy rations of food and water, and build a shelter as quickly as possible to spend the night in.`;
    private static finalInstructions : string = `Say goodbye to Mars... But prepare yourself for the final test to escape the clenches of this planet.`;
    private static summaries : Array<string> = [
        "Just another day on your second favorite planet...",
        "You've found yourself getting bored of all the orange dust and rocks, perhaps planting some more green stuff will increase your moral.",
        "Another balmy -81 degrees fahrenheit day, time to break out the bermuda shorts.",
        "with a third of the gravity of earth, make sure you're hitting the squat rack so your legs don't atrophy.",
        "If you're running low on health, increasing your rations and staying in the shelter will increase your health.",
        "You have 37 extra minutes in the day here on Mars, 37 more minutes to research things, or just wander around... Whichever you prefer.",
        "Mission Control messaged you: 'Lolz, just found out there is a meteor shower headed your way the same day the rescue ship is supposed to arrive :)'",
        "You've become quite good at Sudoku puzzles in your free time.",
        "Fun fact, only 19 out of 39 mars missions have actually been successful. Hopefully the number is about to increase.",
        // TODO, just add in more random summaries to bring variety to the game
    ];

    public static getSolSummary(sol : number) : string {
        // This gets an appropriate but randomly selected summary, based on the sol that is provided

        if (sol == 0) 
        {
            return this.startInstructions;
        }
        else if (sol > this.START_SOL && sol < this.FINAL_SOL) 
        {
            return this.summaries[Math.floor(Math.random() * this.summaries.length) + 0];
        } 
        else if (sol == this.FINAL_SOL) 
        {
            return this.finalInstructions;
        }

        return "";
    }
}