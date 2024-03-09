class Game {
    static frameRate = 125;

    constructor(canvas, ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.board = new Board(21, '#2e3336', '#3f4549');
    }
}

class Board {
    static tileSize = 21;

    constructor(tileColor, secondaryTileColor) {
        this.tileColors = [tileColor, secondaryTileColor];
    }

    draw(context, canvas) {
        const widthTiles = Math.floor(canvas.width / Board.tileSize);
        const heightTiles = Math.floor(canvas.height / Board.tileSize);

        for (let y = 0; y < heightTiles; y++) {
            for (let x = 0; x < widthTiles; x++) {
                context.fillStyle = this.tileColors[(x + y) % 2];
                context.fillRect(x * Board.tileSize, y * Board.tileSize, Board.tileSize, Board.tileSize);
            }
        }
    }
}

class Snake {
    constructor(length, startPosition) {
        this.body = Array.from({length}, (_, i) => (
            new SnakeBody(
                new Vector(
                    startPosition.x - i * Board.tileSize,
                    startPosition.y
                ),
                i === 0
            )
        ));
    }

    draw(context, canvas) {
        this.body.forEach(body => body.draw(context, canvas));
    }
}

class SnakeBody {
    static headColor = '#c48d4d';
    static bodyColor = '#85c44d';

    constructor(position, is_head = false) {
        this.position = position;
        this.is_head = is_head;
    }

    changeToBody() {
        this.is_head = false;
    }

    draw(context, canvas) {
        this.position.drawRect(context, this.is_head ? SnakeBody.headColor : SnakeBody.bodyColor);
    }
}

class Apple {
    static color = '#ab4343';

    constructor(position) {
        this.position = position;
    }

    draw(context, canvas) {
        this.position.drawRect(context, Apple.color);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    drawRect(context, color) {
        context.fillStyle = color;
        context.fillRect(this.x, this.y, Board.tileSize, Board.tileSize);
    }
}


(function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const wallSize = 21;
    const snakeColor = {head: '#c48d4d', body: '#85c44d'};
    const mapColors = ['#2e3336', '#3f4549'];
    const foodColor = '#ab4343';
    const frameRate = 125;
    const directionMap = {
        'left': {x: -wallSize, y: 0},
        'up': {x: 0, y: -wallSize},
        'right': {x: wallSize, y: 0},
        'down': {x: 0, y: wallSize},
    };

    let snake = [];
    let food = {};
    let delta = {};
    let moves = [];


    function resetGame() {
        delta = directionMap.right;
        snake = initSnake(3);
        placeRandomFood();
    }

    function initSnake(length) {
        const xStart = Math.floor(canvas.width * 0.25);
        const yCenter = Math.floor(canvas.height / 2);

        return Array.from({length}, (_, i) => ({
            x: xStart - i * wallSize,
            y: yCenter
        }));
    }

    function drawMap() {
        const widthTiles = Math.floor(canvas.width / wallSize);
        const heightTiles = Math.floor(canvas.height / wallSize);

        for (let y = 0; y < heightTiles; y++) {
            for (let x = 0; x < widthTiles; x++) {
                context.fillStyle = mapColors[(x + y) % 2];
                context.fillRect(x * wallSize, y * wallSize, wallSize, wallSize);
            }
        }
    }

    function drawSnake() {
        snake.forEach(function (segment, index) {
            context.fillStyle = index === 0 ? snakeColor.head : snakeColor.body;
            context.fillRect(segment.x, segment.y, wallSize, wallSize);

            context.strokeStyle = '#111';
            context.lineWidth = 2;
            context.strokeRect(segment.x + 1, segment.y + 1, wallSize - 1, wallSize - 1);
        });
    }

    function drawFood() {
        context.fillStyle = foodColor;
        context.fillRect(food.x, food.y, wallSize, wallSize);
    }

    function appendMove(newDelta) {
        const lastMove = moves.length ? moves[moves.length - 1] : delta;
        if ((lastMove.x === 0 && newDelta.x === 0) || (lastMove.y === 0 && newDelta.y === 0)) {
            return;
        }
        moves.push(newDelta);
    }

    function updateDirection() {
        if (moves.length > 0) {
            delta = moves.shift();
        }
    }

    function moveSnake() {
        updateDirection();
        const head = snake[0];
        const newHead = {
            x: head.x + delta.x,
            y: head.y + delta.y,
        };
        snake.unshift(newHead);
        if (checkFoodCollision(newHead)) {
            placeRandomFood();
        } else {
            snake.pop();
        }
    }

    function checkWallCollision(head) {
        return head.x > (canvas.width - wallSize) || head.x < 0 || head.y > (canvas.height - wallSize) || head.y < 0;
    }

    function checkSelfCollision(head) {
        return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    function checkFoodCollision(head) {
        return food.x === head.x && food.y === head.y;
    }

    function placeRandomFood() {
        const freeSpots = {};
        for (let x = 0; x < canvas.width; x += wallSize) {
            for (let y = 0; y < canvas.height; y += wallSize) {
                freeSpots[`${x},${y}`] = {x, y};
            }
        }

        snake.forEach(segment => {
            delete freeSpots[`${segment.x},${segment.y}`];
        });

        const freeSpotsList = Object.values(freeSpots);
        if (freeSpotsList.length) {
            food = freeSpotsList[Math.floor(Math.random() * freeSpotsList.length)];
        }
    }

    function handleKeyDown(event) {
        switch (event.keyCode) {
            case 37: // ←
            case 65: // a
                appendMove(directionMap.left);
                break;
            case 38: // ↑
            case 87: // w
                appendMove(directionMap.up);
                break;
            case 39: // →
            case 68: // d
                appendMove(directionMap.right);
                break;
            case 40: // ↓
            case 83: // s
                appendMove(directionMap.down);
                break;
        }
    }

    function checkCollisions() {
        const head = snake[0];
        return checkWallCollision(head) || checkSelfCollision(head);
    }

    function renderScene() {
        drawMap();
        drawFood();
        drawSnake();
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
