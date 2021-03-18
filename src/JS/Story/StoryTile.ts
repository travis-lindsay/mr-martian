export class StoryTile 
{
    public text : string;
    public displayText : string;
    public imgPath : string;
    public timeout : any;
    constructor(text : string, imgPath : string) {
        this.text = text;
        this.imgPath = imgPath;
        this.displayText = "";
    }

    public RunAnimation(i : number) {
        this.displayText = this.text.slice(0, ++i);
        if (this.displayText === this.text) {
            return;
        }

        let char = this.displayText.slice(-1);
        // Pause for dramatic effect on periods in the text
        if (char === '.') {
            this.timeout = setTimeout(() => {this.RunAnimation(i);}, 350);
        } else {
            this.timeout = setTimeout(() => {this.RunAnimation(i);}, 50);
        }
    }

    public StopAnimation() {
        clearTimeout(this.timeout);
        this.displayText = "";
    }
}