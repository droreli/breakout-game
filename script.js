const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth;
    canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight * 0.75;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Paddle
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

// Bricks
const brickRowCount = 8;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;
const brickColumnCount = Math.floor((canvas.width - brickOffsetLeft) / (brickWidth + brickPadding)); // Adjust columns based on screen width
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Score
let score = 0;

// Load and resize image
const brickImage = new Image();
brickImage.src = 'image.png'; // Use the updated image name
brickImage.onload = () => {
    console.log("Image loaded successfully");
    draw();
};

function drawBricks() {
    const imageWidth = brickImage.width;
    const imageHeight = brickImage.height;
    const cropWidth = imageWidth / brickColumnCount;
    const cropHeight = imageHeight / brickRowCount;

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.drawImage(
                    brickImage,
                    c * cropWidth, r * cropHeight, cropWidth, cropHeight,
                    brickX, brickY, brickWidth, brickHeight
                );
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDY = -ballDY;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    } else if (ballY + ballDY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
        } else {
            alert("GAME OVER");
            document.location.reload();
        }
    }

    ballX += ballDX;
    ballY += ballDY;

    requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

document.addEventListener("touchmove", touchMoveHandler, false);

function touchMoveHandler(e) {
    const relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

brickImage.onload = draw;
