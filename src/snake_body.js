import {Board} from "./board";

export class SnakeBody {
    static headColor = '#c48d4d';
    static bodyColor = '#85c44d';

    constructor(position, is_head = true) {
        this.position = position;
        this.is_head = is_head;
    }

    changeToBody() {
        this.is_head = false;
    }

    draw(context) {
        context.fillStyle = this.is_head ? SnakeBody.headColor : SnakeBody.bodyColor;
        context.fillRect(this.position.x, this.position.y, Board.tileSize, Board.tileSize);

        context.strokeStyle = '#111';
        context.lineWidth = 2;
        context.strokeRect(this.position.x + 1, this.position.y + 1, Board.tileSize - 1, Board.tileSize - 1);
    }
}
