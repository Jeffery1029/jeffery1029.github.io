document.addEventListener('DOMContentLoaded', function() {
    // 獲取畫布和上下文
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 獲取遊戲元素
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const levelDisplay = document.getElementById('level');
    const startScreen = document.getElementById('start-screen');
    const levelCompleteScreen = document.getElementById('level-complete');
    const gameOverScreen = document.getElementById('game-over');
    const pauseScreen = document.getElementById('pause-screen');
    const levelScoreDisplay = document.getElementById('level-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const finalLevelDisplay = document.getElementById('final-level');
    
    // 獲取按鈕
    const startButton = document.getElementById('start-button');
    const nextLevelButton = document.getElementById('next-level-button');
    const restartButton = document.getElementById('restart-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const speedSelect = document.getElementById('speed-select');
    
    // 遊戲變數
    let score = 0;
    let lives = 3;
    let level = 1;
    let gameRunning = false;
    let gamePaused = false;
    let animationId;
    
    // 球的變數
    let ball = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        radius: 10,
        dx: 4,
        dy: -4,
        speed: 1
    };
    
    // 擋板變數
    let paddle = {
        width: 100,
        height: 15,
        x: canvas.width / 2 - 50,
        y: canvas.height - 30,
        dx: 8,
        leftPressed: false,
        rightPressed: false
    };
    
    // 磚塊變數
    let bricks = [];
    let brickRowCount = 5;
    let brickColumnCount = 9;
    let brickWidth = 80;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 60;
    let brickOffsetLeft = 35;
    
    // 顏色設定
    const colors = [
        '#FF5252', // 紅色
        '#FF9800', // 橙色
        '#FFEB3B', // 黃色
        '#4CAF50', // 綠色
        '#2196F3'  // 藍色
    ];
    
    // 初始化磚塊
    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                // 根據關卡增加磚塊的耐久度
                const durability = Math.min(Math.ceil(level / 3), 3);
                bricks[c][r] = { 
                    x: brickX, 
                    y: brickY, 
                    status: durability,
                    maxDurability: durability
                };
            }
        }
    }
    
    // 設置球速
    function setBallSpeed() {
        const speed = speedSelect.value;
        switch (speed) {
            case 'slow':
                ball.speed = 0.7;
                break;
            case 'normal':
                ball.speed = 1;
                break;
            case 'fast':
                ball.speed = 1.3;
                break;
        }
    }
    
    // 重置球和擋板
    function resetBallAndPaddle() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        ball.dx = 4 * ball.speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -4 * ball.speed;
        
        paddle.x = canvas.width / 2 - paddle.width / 2;
    }
    
    // 繪製球
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();
    }
    
    // 繪製擋板
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#3498db';
        ctx.fill();
        ctx.closePath();
    }
    
    // 繪製磚塊
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status > 0) {
                    const brick = bricks[c][r];
                    
                    // 根據耐久度選擇顏色
                    const colorIndex = brick.maxDurability - brick.status;
                    const color = colors[colorIndex] || colors[0];
                    
                    ctx.beginPath();
                    ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
                    ctx.closePath();
                    
                    // 如果磚塊有多個耐久度，顯示數字
                    if (brick.maxDurability > 1) {
                        ctx.font = '12px Arial';
                        ctx.fillStyle = '#FFF';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(brick.status, brick.x + brickWidth / 2, brick.y + brickHeight / 2);
                    }
                }
            }
        }
    }
    
    // 繪製分數和生命
    function drawStats() {
        scoreDisplay.textContent = `得分: ${score}`;
        livesDisplay.textContent = `生命: ${lives}`;
        levelDisplay.textContent = `關卡: ${level}`;
    }
    
    // 檢測碰撞
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const brick = bricks[c][r];
                if (brick.status > 0) {
                    if (
                        ball.x > brick.x &&
                        ball.x < brick.x + brickWidth &&
                        ball.y > brick.y &&
                        ball.y < brick.y + brickHeight
                    ) {
                        ball.dy = -ball.dy;
                        brick.status--;
                        
                        // 根據磚塊耐久度給分
                        if (brick.status === 0) {
                            score += 10 * brick.maxDurability;
                        } else {
                            score += 1;
                        }
                        
                        // 檢查是否所有磚塊都被打破
                        if (checkLevelComplete()) {
                            showLevelComplete();
                        }
                    }
                }
            }
        }
    }
    
    // 檢查關卡是否完成
    function checkLevelComplete() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status > 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // 顯示關卡完成畫面
    function showLevelComplete() {
        gameRunning = false;
        levelScoreDisplay.textContent = score;
        levelCompleteScreen.style.display = 'flex';
    }
    
    // 顯示遊戲結束畫面
    function showGameOver() {
        gameRunning = false;
        finalScoreDisplay.textContent = score;
        finalLevelDisplay.textContent = level;
        gameOverScreen.style.display = 'flex';
    }
    
    // 移動擋板
    function movePaddle() {
        if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.dx;
        } else if (paddle.leftPressed && paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    }
    
    // 移動球
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // 檢測牆壁碰撞
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }
        
        // 檢測擋板碰撞
        if (
            ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            // 根據擊中擋板的位置改變反彈角度
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            const angle = hitPoint * Math.PI / 3; // 最大 60 度角
            
            ball.dx = ball.speed * 4 * Math.sin(angle);
            ball.dy = -ball.speed * 4 * Math.cos(angle);
        }
        
        // 檢測底部碰撞（失去生命）
        if (ball.y + ball.radius > canvas.height) {
            lives--;
            
            if (lives <= 0) {
                showGameOver();
            } else {
                resetBallAndPaddle();
            }
        }
    }
    
    // 繪製遊戲
    function draw() {
        if (!gameRunning || gamePaused) return;
        
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 繪製遊戲元素
        drawBall();
        drawPaddle();
        drawBricks();
        drawStats();
        
        // 碰撞檢測
        collisionDetection();
        
        // 移動元素
        movePaddle();
        moveBall();
        
        // 繼續動畫
        animationId = requestAnimationFrame(draw);
    }
    
    // 開始遊戲
    function startGame() {
        startScreen.style.display = 'none';
        gameRunning = true;
        setBallSpeed();
        initBricks();
        resetBallAndPaddle();
        draw();
    }
    
    // 下一關
    function nextLevel() {
        level++;
        levelCompleteScreen.style.display = 'none';
        
        // 增加難度
        if (level % 2 === 0 && brickRowCount < 8) {
            brickRowCount++;
        }
        
        gameRunning = true;
        initBricks();
        resetBallAndPaddle();
        draw();
    }
    
    // 重新開始遊戲
    function restartGame() {
        score = 0;
        lives = 3;
        level = 1;
        brickRowCount = 5;
        
        gameOverScreen.style.display = 'none';
        
        startGame();
    }
    
    // 暫停/繼續遊戲
    function togglePause() {
        if (!gameRunning) return;
        
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            pauseScreen.style.display = 'flex';
            cancelAnimationFrame(animationId);
        } else {
            pauseScreen.style.display = 'none';
            draw();
        }
    }
    
    // 鍵盤事件處理
    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            paddle.rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            paddle.leftPressed = true;
        } else if (e.key === 'p' || e.key === 'P') {
            togglePause();
        }
    }
    
    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            paddle.rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            paddle.leftPressed = false;
        }
    }
    
    // 滑鼠移動事件處理
    function mouseMoveHandler(e) {
        if (!gameRunning || gamePaused) return;
        
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width / 2;
            
            // 確保擋板不超出畫布
            if (paddle.x < 0) {
                paddle.x = 0;
            } else if (paddle.x > canvas.width - paddle.width) {
                paddle.x = canvas.width - paddle.width;
            }
        }
    }
    
    // 觸摸移動事件處理
    function touchMoveHandler(e) {
        if (!gameRunning || gamePaused) return;
        
        e.preventDefault();
        const relativeX = e.touches[0].clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddle.x = relativeX - paddle.width / 2;
            
            // 確保擋板不超出畫布
            if (paddle.x < 0) {
                paddle.x = 0;
            } else if (paddle.x > canvas.width - paddle.width) {
                paddle.x = canvas.width - paddle.width;
            }
        }
    }
    
    // 事件監聽器
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false });
    
    startButton.addEventListener('click', startGame);
    nextLevelButton.addEventListener('click', nextLevel);
    restartButton.addEventListener('click', restartGame);
    pauseButton.addEventListener('click', togglePause);
    resumeButton.addEventListener('click', togglePause);
    
    speedSelect.addEventListener('change', setBallSpeed);
    
    // 調整畫布大小
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        
        if (containerWidth < 800) {
            const ratio = containerWidth / 800;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${500 * ratio}px`;
        } else {
            canvas.style.width = '';
            canvas.style.height = '';
        }
    }
    
    // 監聽視窗大小變化
    window.addEventListener('resize', resizeCanvas);
    
    // 初始調整畫布大小
    resizeCanvas();
}); 