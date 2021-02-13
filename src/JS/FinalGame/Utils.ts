
export abstract class Utils {

    public static componentToHex(c : number) {
        var hex = Number(Math.floor(c)).toString(16);
        if (hex.length < 2) {
             hex = "0" + hex;
        }
        return hex;
    }
    
    public static rgbToHex(r : number, g : number, b : number) {
        return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
}
