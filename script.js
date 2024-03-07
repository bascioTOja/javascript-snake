(function() {
    let canvas;
    let context2d;
    const wallSize = 10;
    let snake = [];
    let food = {x: 0, y: 0, color: '#5d7'};
    let dx = 0;
    let dy = wallSize;

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function drawRectRandomColor(x, y, width, height) {
        context2d.fillStyle = `rgb(${getRandomInt(255)}, ${getRandomInt(255)}, ${getRandomInt(255)})`;
        context2d.fillRect(x, y, width, height);
    }

    function clearCanvas() {
        context2d.fillStyle = '#111';
        context2d.fillRect(0, 0, canvas.width, canvas.height);
    }

    function makeSnake(length) {
        for (let i = 0; i < length; i++) {
            let x = canvas.width / 2 + i * wallSize;
            let y = canvas.height / 2;
            snake.push({x:x, y:y});
        }
    }

    function drawSnake() {
        snake.forEach(function(segment) {
            context2d.strokeStyle = '#e11';
            context2d.lineWidth = 5;
            context2d.lineJoin = 'bevel';
            context2d.strokeRect(segment.x, segment.y, wallSize, wallSize);
        });
    }

    function drawFood() {
        context2d.fillStyle = food.color;
        context2d.fillRect(food.x, food.y, wallSize, wallSize);
    }

    function resetGame() {
        snake = [];
        randomFood();
        makeSnake(2);
    }

    function moveSnake() {
        let headX = snake[0].x + dx;
        let headY = snake[0].y + dy;
        snake.unshift({x:headX, y:headY});
        snake.pop();
    }

    function  keyDown(event) {
        switch (event.keyCode) {
            case 37: // ←
            case 65: // a
                dx = -wallSize;
                dy = 0;
                break;
            case 38: // ↑
            case 87: // w
                dx = 0;
                dy = -wallSize;
                break;
            case 39: // →
            case 68: // d
                dx = wallSize;
                dy = 0;
                break;
            case 40: // ↓
            case 83: // s
                dx = 0;
                dy = wallSize;
                break;
        }
    }

    function checkWallCollision() {
        const head = snake[0];
        if(head.x > (canvas.width - wallSize) || head.x < 0 || head.y > (canvas.height - wallSize) || head.y < 0) {
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

        setInterval(function() {
            clearCanvas();
            moveSnake();
            checkWallCollision();
            checkSelfCollision();
            checkFoodCollision();
            drawFood();
            drawSnake();
        }, 100);
    }

    window.onload = startApp;
})();
