import {Board} from "./board";
import {SnakeBody} from "./snake_body.js";
import {Vector} from "./vector";

export class Snake {
    constructor(length, startPosition, startDirection) {
        this.direction = startDirection;
        this.moves = [];
        this.body = Array.from({length}, (_, i) => (
            new SnakeBody(
                new Vector(
                    startPosition.x - i * Board.tileSize,
                    startPosition.y
                ),
                i === 0
            )
        ));
        this.head = this.getNewHead();
    }

    draw(context) {
        this.body.forEach(body => body.draw(context));
    }

    checkSelfCollision() {
        return this.body.slice(1).some(segment => segment.position.x === this.head.position.x && segment.position.y === this.head.position.y);
    }

    checkWallCollision(width, height) {
        return this.head.position.x > (width - Board.tileSize) || this.head.position.x < 0 || this.head.position.y > (height - Board.tileSize) || this.head.position.y < 0;
    }

    checkFoodCollision(food) {
        return food.position.x === this.head.position.x && food.position.y === this.head.position.y;
    }

    appendMove(newDirection) {
        const lastMove = this.moves.length ? this.moves[this.moves.length - 1] : this.direction;
        if ((lastMove.x === 0 && newDirection.x === 0) || (lastMove.y === 0 && newDirection.y === 0)) {
            return;
        }
        this.moves.push(new Vector(newDirection.x, newDirection.y));
    }

    updateDirection() {
        if (this.moves.length > 0) {
            this.direction = this.moves.shift();
        }
    }

    appendHead(newHead) {
        this.head.changeToBody();
        this.body.unshift(newHead);
        this.updateHead();
    }


    getNewHead(){
        return this.body[0];
    }

    updateHead(){
        this.head = this.getNewHead();
    }

    move() {
        this.updateDirection();
        const newHead = new SnakeBody(this.head.position.add(this.direction));
        this.appendHead(newHead);
        this.body.pop();
    }

    grow(amount = 1) {
        let lastBody = this.body[this.body.length - 1];
        for (let i = 0; i < amount; i++) {
            this.body.push(new SnakeBody(new Vector(lastBody.position.x, lastBody.position.y), false));
        }
    }
}
