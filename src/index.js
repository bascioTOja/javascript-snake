import {Board} from './board.js';
import {Vector} from "./Vector";
import {Food} from "./food";
import {Snake} from "./snake";
import {SnakeBody} from "./snake_body";
import {directionMap} from "./directions_map";



(function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const frameRate = 125;
    const board = new Board(canvas);

    let snake = newSnake(3);
    let food = new Food(new Vector(0, 0));

    function resetGame() {
        snake = newSnake(3);
        placeRandomFood();
    }

    function newSnake(length) {
        return new Snake(
            length,
            new Vector(
                Math.floor(canvas.width * 0.25),
                Math.floor(canvas.height / 2),
            ),
            directionMap.right,
        );
    }

    function moveSnake() {
        snake.updateDirection();

        const newHead = new SnakeBody(snake.head.position.add(snake.direction));
        snake.appendHead(newHead);

        if (snake.checkFoodCollision(food)) {
            placeRandomFood();
        } else {
            snake.body.pop();
        }
    }

    function placeRandomFood() {
        const freeSpots = {};
        for (let x = 0; x < canvas.width; x += Board.tileSize) {
            for (let y = 0; y < canvas.height; y += Board.tileSize) {
                freeSpots[`${x},${y}`] = {x, y};
            }
        }

        snake.body.forEach(segment => {
            delete freeSpots[`${segment.position.x},${segment.position.y}`];
        });

        const freeSpotsList = Object.values(freeSpots);
        if (freeSpotsList.length) {
            const freeSpot = freeSpotsList[Math.floor(Math.random() * freeSpotsList.length)];
            food = new Food(new Vector(freeSpot.x, freeSpot.y));
        }
    }

    function handleKeyDown(event) {
        switch (event.keyCode) {
            case 37: // ←
            case 65: // a
                snake.appendMove(directionMap.left);
                break;
            case 38: // ↑
            case 87: // w
                snake.appendMove(directionMap.up);
                break;
            case 39: // →
            case 68: // d
                snake.appendMove(directionMap.right);
                break;
            case 40: // ↓
            case 83: // s
                snake.appendMove(directionMap.down);
                break;
        }
    }

    function checkCollisions() {
        return snake.checkWallCollision(canvas.width, canvas.height) || snake.checkSelfCollision();
    }

    function renderScene() {
        board.draw(context);
        food.draw(context);
        snake.draw(context);
    }

    function processGameLogic() {
        moveSnake();
        if (checkCollisions()) {
            resetGame();
        }
    }

    function mainLoop() {
        setInterval(function () {
            processGameLogic();
            renderScene();
        }, frameRate);
    }

    function init() {
        document.addEventListener('keydown', handleKeyDown);
        resetGame();
        mainLoop();
    }

    window.onload = init;
})();
