class Board {
    static tileSize = 21;
    static tileColors = ['#2e3336', '#3f4549'];

    constructor(canvas) {
        this.widthTiles = Math.floor(canvas.width / Board.tileSize);
        this.heightTiles = Math.floor(canvas.height / Board.tileSize);
    }

    draw(context) {
        for (let y = 0; y < this.widthTiles; y++) {
            for (let x = 0; x < this.heightTiles; x++) {
                context.fillStyle = Board.tileColors[(x + y) % 2];
                context.fillRect(x * Board.tileSize, y * Board.tileSize, Board.tileSize, Board.tileSize);
            }
        }
    }
}

class Snake {
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
}

class SnakeBody {
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

class Food {
    static color = '#ab4343';

    constructor(position) {
        this.position = position;
    }

    draw(context, canvas) {
        this.position.drawRect(context, Food.color);
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

    add(vector) {
        return new Vector(
            this.x + vector.x,
            this.y + vector.y
        );
    }
}

const directionMap = {
    'left': new Vector(-Board.tileSize, 0),
    'up': new Vector(0, -Board.tileSize),
    'right': new Vector(Board.tileSize, 0),
    'down': new Vector(0, Board.tileSize),
};

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
