class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v2){
        return new Vector2(this.x + v2.x, this.y + v2.y);
    }

    substract(v2){
        return new Vector2(this.x - v2.x, this.y - v2.y);
    }

    magnitude(v2){
        let xSqr = Math.pow(this.x - v2.x, 2);
        let ySqr = Math.pow(this.y - v2.y, 2);
        return Math.sqrt(xSqr + ySqr);
    }
}



export default Vector2;