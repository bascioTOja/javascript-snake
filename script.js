(function () {
    let canvas;
    let context2d;
    const wallSize = 21;
    let snake = [];
    let food = {x: 0, y: 0, color: '#ab4343'};
    let delta = {x: wallSize, y: 0};
    let moves = [];

    function initSnake(length) {
        snake = [];
        for (let i = 0; i < length; i++) {
            let x = Math.floor(canvas.width * 0.25) - i * wallSize;
            let y = canvas.height / 2;
            snake.push({x: x, y: y});
        }
    }

    function drawMap() {
        const widthTiles = Math.floor(canvas.width / wallSize);
        const heightTiles = Math.floor(canvas.height / wallSize);

        for (let y = 0; y < heightTiles; y++) {
            for (let x = 0; x < widthTiles; x++) {
                context2d.fillStyle = (x % 2) !== (y % 2) ? '#2e3336' : '#3f4549';
                context2d.fillRect(x * wallSize, y * wallSize, wallSize, wallSize);
            }
        }
    }

    function drawSnake() {
        snake.forEach(function (segment, index) {
            context2d.fillStyle = index === 0 ? '#c48d4d' : '#85c44d';
            context2d.fillRect(segment.x, segment.y, wallSize, wallSize);

            context2d.strokeStyle = '#111';
            context2d.lineWidth = 2;
            context2d.strokeRect(segment.x + 1, segment.y + 1, wallSize - 1, wallSize - 1);
        });
    }

    function drawFood() {
        context2d.fillStyle = food.color;
        context2d.fillRect(food.x, food.y, wallSize, wallSize);
    }

    function resetGame() {
        delta = {x: wallSize, y: 0};
        initSnake(3);
        randomFood();
    }

    function appendMove(newDelta) {
        const lastMove = moves.length ? moves[moves.length - 1] : delta;

        if ((lastMove.x === 0 && newDelta.x === 0) || (lastMove.y === 0 && newDelta.y === 0)) {
            return;
        }

        moves.push(newDelta);
    }

    function nextMove() {
        delta = moves.length ? moves.shift() : delta;
    }

    function moveSnake() {
        nextMove();
        snake.unshift({
            x: snake[0].x + delta.x,
            y: snake[0].y + delta.y,
        });
        snake.pop();
    }

    function keyDown(event) {
        switch (event.keyCode) {
            case 37: // ←
            case 65: // a
                appendMove({x: -wallSize, y: 0});
                break;
            case 38: // ↑
            case 87: // w
                appendMove({x: 0, y: -wallSize});
                break;
            case 39: // →
            case 68: // d
                appendMove({x: wallSize, y: 0});
                break;
            case 40: // ↓
            case 83: // s
                appendMove({x: 0, y: wallSize});
                break;
        }
    }

    function checkWallCollision() {
        const head = snake[0];
        if (head.x > (canvas.width - wallSize) || head.x < 0 || head.y > (canvas.height - wallSize) || head.y < 0) {
            resetGame();
        }
    }

    function checkSelfCollision() {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                resetGame();
                return;
            }
        }
    }

    function checkFoodCollision() {
        const head = snake[0];
        if (food.x === head.x && food.y === head.y) {
            snake.push({...snake[snake.length - 1]});
            randomFood();
        }
    }

    function randomFood() {
        function randV(min, max) {
            return Math.floor((Math.random() * (max - min) + min) / wallSize) * wallSize;
        }

        food.x = randV(20, canvas.width - 20);
        food.y = randV(20, canvas.height - 20);
    }

    function startApp() {
        canvas = document.getElementById('canvas');
        context2d = canvas.getContext('2d');
        document.addEventListener('keydown', keyDown);

        resetGame();
        setInterval(function () {
            drawMap();
            moveSnake();
            checkWallCollision();
            checkSelfCollision();
            checkFoodCollision();
            drawFood();
            drawSnake();
        }, 125);
    }

    window.onload = startApp;
})();
