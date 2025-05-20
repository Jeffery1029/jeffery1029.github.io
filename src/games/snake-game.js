// 等待 DOM 完全載入後再執行
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 已載入");
    // 遊戲設定
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const finalScore = document.getElementById('final-score');
    const gameOverScreen = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameSpeed = 150; // 毫秒
    let gameInterval = null;
    let gameRunning = false;
    
    // 初始化蛇和食物
    snake = [
        {x: 10, y: 10}
    ];
    placeFood();
    
    // 初始化遊戲
    function initGame() {
        console.log("遊戲初始化");
        // 重置蛇
        snake = [
            {x: 10, y: 10}
        ];
        
        // 重置食物
        placeFood();
        
        // 重置方向和分數
        dx = 0;
        dy = 0;
        score = 0;
        updateScore();
        
        // 隱藏遊戲結束畫面
        gameOverScreen.style.display = 'none';
        
        // 開始遊戲循環
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        gameRunning = true;
        gameInterval = setInterval(gameLoop, gameSpeed);
        console.log("遊戲循環已啟動");
    }
    
    // 放置食物
    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // 確保食物不會出現在蛇身上
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                placeFood();
                break;
            }
        }
    }
    
    // 更新分數
    function updateScore() {
        const scorePrefix = window.i18n && window.i18n.translations[window.i18n.lang] ? 
            window.i18n.translations[window.i18n.lang]['score-prefix'] : '得分：';
        document.getElementById('current-score').textContent = score;
    }
    
    // 遊戲循環
    function gameLoop() {
        // 移動蛇
        moveSnake();
        
        // 檢查碰撞
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        // 檢查是否吃到食物
        if (snake[0].x === food.x && snake[0].y === food.y) {
            // 增加分數
            score += 10;
            updateScore();
            
            // 增加蛇的長度（不移除尾部）
            placeFood();
            
            // 加速（每50分加速一次）
            if (score % 50 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, gameSpeed);
            }
        } else {
            // 移除尾部
            snake.pop();
        }
        
        // 繪製遊戲
        drawGame();
    }
    
    // 移動蛇
    function moveSnake() {
        // 如果沒有方向，不移動
        if (dx === 0 && dy === 0) return;
        
        // 計算新的頭部位置
        const head = {
            x: snake[0].x + dx,
            y: snake[0].y + dy
        };
        
        // 將新頭部添加到蛇的前面
        snake.unshift(head);
    }
    
    // 檢查碰撞
    function checkCollision() {
        const head = snake[0];
        
        // 檢查牆壁碰撞
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        
        // 檢查自身碰撞
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // 繪製遊戲
    function drawGame() {
        // 清除畫布
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 繪製食物
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
        
        // 繪製蛇
        for (let i = 0; i < snake.length; i++) {
            // 頭部為深綠色，身體為綠色
            if (i === 0) {
                ctx.fillStyle = '#006400';
            } else {
                ctx.fillStyle = '#32CD32';
            }
            
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
            
            // 繪製邊框
            ctx.strokeStyle = 'black';
            ctx.strokeRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }
        
        // 如果遊戲未運行，顯示開始提示
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('按任意鍵或點擊畫面開始遊戲', canvas.width / 2, canvas.height / 2);
        }
    }
    
    // 遊戲結束
    function gameOver() {
        console.log("遊戲結束");
        gameRunning = false;
        clearInterval(gameInterval);
        document.getElementById('final-score-value').textContent = score;
        gameOverScreen.style.display = 'block';
    }
    
    // 手動設置第一個方向
    function setInitialDirection(direction) {
        switch(direction) {
            case 'up':
                dx = 0;
                dy = -1;
                break;
            case 'down':
                dx = 0;
                dy = 1;
                break;
            case 'left':
                dx = -1;
                dy = 0;
                break;
            case 'right':
                dx = 1;
                dy = 0;
                break;
        }
    }
    
    // 鍵盤控制 - 使用 window 對象來確保全局捕獲按鍵事件
    window.addEventListener('keydown', function(event) {
        console.log("按鍵按下:", event.key);
        
        // 如果遊戲未運行，按任意鍵開始
        if (!gameRunning && event.key !== 'F5') {
            initGame();
            // 設置初始方向為右
            setInitialDirection('right');
            return;
        }
        
        // 防止按鍵導致頁面滾動
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key)) {
            event.preventDefault();
        }
        
        // 根據按鍵設置方向
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (dy !== 1) { // 防止直接反向移動
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    });
    
    // 添加點擊事件 - 允許點擊畫布開始遊戲
    canvas.addEventListener('click', function() {
        console.log("畫布被點擊");
        if (!gameRunning) {
            initGame();
            // 設置初始方向為右
            setInitialDirection('right');
        }
    });
    
    // 重新開始按鈕
    restartButton.addEventListener('click', function() {
        console.log("重新開始按鈕被點擊");
        initGame();
        // 設置初始方向為右
        setInitialDirection('right');
    });
    
    // 初始繪製
    drawGame();
    
    console.log("遊戲初始化完成，等待用戶操作");
}); 