export class SolEvent {

    desc : string;
    category : string;
    badEvent : boolean;
    points : number;

    constructor(desc : string, category : string, badEvent : boolean, points : number) {
        this.desc = desc;
        this.category = category;
        this.badEvent = badEvent;
        this.points = points;
    }
}