import {Board} from "./board";

export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    drawRect(context, color) {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, Board.tileSize, Board.tileSize);
    }

    add(vector) {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y
        );
    }
}
