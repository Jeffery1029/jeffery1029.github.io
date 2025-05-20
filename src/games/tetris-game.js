document.addEventListener('DOMContentLoaded', function() {
    // 獲取遊戲元素
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');
    const nextPieceContainer = document.getElementById('next-piece-container');
    const nextPieceCtx = document.createElement('canvas').getContext('2d');
    nextPieceContainer.appendChild(nextPieceCtx.canvas);
    nextPieceCtx.canvas.width = 100;
    nextPieceCtx.canvas.height = 80;
    
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const linesDisplay = document.getElementById('lines');
    const finalScoreDisplay = document.getElementById('final-score');
    
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const playAgainButton = document.getElementById('play-again-button');
    
    const gameOverMessage = document.getElementById('game-over-message');
    const pauseMessage = document.getElementById('pause-message');
    
    // 移動設備控制按鈕
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const rotateButton = document.getElementById('rotate-button');
    const downButton = document.getElementById('down-button');
    const dropButton = document.getElementById('drop-button');
    
    // 遊戲常數
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const COLORS = [
        null,
        '#00f0f0', // I
        '#f0f000', // O
        '#a000f0', // T
        '#00f000', // S
        '#f00000', // Z
        '#0000f0', // J
        '#f0a000'  // L
    ];
    
    // 方塊形狀定義
    const SHAPES = [
        null,
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[2, 2], [2, 2]], // O
        [[0, 3, 0], [3, 3, 3], [0, 0, 0]], // T
        [[0, 4, 4], [4, 4, 0], [0, 0, 0]], // S
        [[5, 5, 0], [0, 5, 5], [0, 0, 0]], // Z
        [[6, 0, 0], [6, 6, 6], [0, 0, 0]], // J
        [[0, 0, 7], [7, 7, 7], [0, 0, 0]]  // L
    ];
    
    // 遊戲變數
    let board = createEmptyBoard();
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let level = 1;
    let lines = 0;
    let dropCounter = 0;
    let dropInterval = 1000; // 初始下落速度 (毫秒)
    let lastTime = 0;
    let gameOver = false;
    let isPaused = false;
    let animationId = null;
    
    // 創建空遊戲板
    function createEmptyBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
    
    // 創建新方塊
    function createPiece(type) {
        return {
            position: { x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2), y: 0 },
            shape: SHAPES[type],
            type: type
        };
    }
    
    // 隨機生成方塊
    function getRandomPiece() {
        const pieceType = Math.floor(Math.random() * 7) + 1;
        return createPiece(pieceType);
    }
    
    // 繪製方塊
    function drawBlock(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    // 繪製遊戲板
    function drawBoard() {
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    drawBlock(x, y, COLORS[value]);
                }
            });
        });
    }
    
    // 繪製當前方塊
    function drawPiece(piece, ctx, offsetX = 0, offsetY = 0, scale = 1) {
        ctx.fillStyle = COLORS[piece.type];
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (scale === 1) {
                        drawBlock(
                            piece.position.x + x + offsetX,
                            piece.position.y + y + offsetY,
                            COLORS[piece.type]
                        );
                    } else {
                        ctx.fillRect(
                            (x + offsetX) * BLOCK_SIZE * scale,
                            (y + offsetY) * BLOCK_SIZE * scale,
                            BLOCK_SIZE * scale,
                            BLOCK_SIZE * scale
                        );
                        ctx.strokeStyle = '#000';
                        ctx.strokeRect(
                            (x + offsetX) * BLOCK_SIZE * scale,
                            (y + offsetY) * BLOCK_SIZE * scale,
                            BLOCK_SIZE * scale,
                            BLOCK_SIZE * scale
                        );
                    }
                }
            });
        });
    }
    
    // 繪製下一個方塊預覽
    function drawNextPiece() {
        nextPieceCtx.clearRect(0, 0, nextPieceCtx.canvas.width, nextPieceCtx.canvas.height);
        nextPieceCtx.fillStyle = '#111';
        nextPieceCtx.fillRect(0, 0, nextPieceCtx.canvas.width, nextPieceCtx.canvas.height);
        
        if (nextPiece) {
            const scale = 0.8;
            const offsetX = nextPiece.type === 1 ? 0.5 : 1;
            const offsetY = 1;
            drawPiece(nextPiece, nextPieceCtx, offsetX, offsetY, scale);
        }
    }
    
    // 繪製遊戲
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        if (currentPiece) {
            drawPiece(currentPiece, ctx);
        }
    }
    
    // 碰撞檢測
    function collide(piece, board) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] !== 0) {
                    const boardX = piece.position.x + x;
                    const boardY = piece.position.y + y;
                    
                    // 檢查是否超出邊界或與已有方塊碰撞
                    if (
                        boardY < 0 ||
                        boardY >= ROWS ||
                        boardX < 0 ||
                        boardX >= COLS ||
                        board[boardY][boardX] !== 0
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    // 移動方塊
    function movePiece(direction) {
        if (gameOver || isPaused) return;
        
        currentPiece.position.x += direction;
        if (collide(currentPiece, board)) {
            currentPiece.position.x -= direction;
        }
        draw();
    }
    
    // 旋轉方塊
    function rotatePiece() {
        if (gameOver || isPaused) return;
        
        const originalShape = currentPiece.shape;
        const rows = currentPiece.shape.length;
        const cols = currentPiece.shape[0].length;
        
        // 創建新的旋轉後的形狀
        const rotated = [];
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = currentPiece.shape[rows - 1 - j][i];
            }
        }
        
        currentPiece.shape = rotated;
        
        // 如果旋轉後發生碰撞，嘗試調整位置
        if (collide(currentPiece, board)) {
            // 嘗試向左移動
            currentPiece.position.x -= 1;
            if (collide(currentPiece, board)) {
                // 嘗試向右移動
                currentPiece.position.x += 2;
                if (collide(currentPiece, board)) {
                    // 如果仍然碰撞，恢復原始形狀
                    currentPiece.position.x -= 1;
                    currentPiece.shape = originalShape;
                }
            }
        }
        
        draw();
    }
    
    // 下落方塊
    function dropPiece() {
        if (gameOver || isPaused) return;
        
        currentPiece.position.y++;
        if (collide(currentPiece, board)) {
            currentPiece.position.y--;
            mergePiece();
            resetPiece();
            clearLines();
            updateScore();
        }
        draw();
    }
    
    // 直接落下方塊
    function hardDrop() {
        if (gameOver || isPaused) return;
        
        while (!collide(currentPiece, board)) {
            currentPiece.position.y++;
        }
        currentPiece.position.y--;
        mergePiece();
        resetPiece();
        clearLines();
        updateScore();
        draw();
    }
    
    // 合併方塊到遊戲板
    function mergePiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const boardY = currentPiece.position.y + y;
                    const boardX = currentPiece.position.x + x;
                    if (boardY >= 0) {
                        board[boardY][boardX] = currentPiece.type;
                    }
                }
            });
        });
    }
    
    // 清除完整的行
    function clearLines() {
        let linesCleared = 0;
        
        outer: for (let y = ROWS - 1; y >= 0; y--) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x] === 0) {
                    continue outer;
                }
            }
            
            // 清除該行
            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            y++; // 檢查同一行（現在是新行）
            linesCleared++;
        }
        
        if (linesCleared > 0) {
            // 更新分數和行數
            lines += linesCleared;
            
            // 根據消除的行數計算分數
            switch (linesCleared) {
                case 1:
                    score += 100 * level;
                    break;
                case 2:
                    score += 300 * level;
                    break;
                case 3:
                    score += 500 * level;
                    break;
                case 4:
                    score += 800 * level;
                    break;
            }
            
            // 每消除 10 行提升一級
            level = Math.floor(lines / 10) + 1;
            
            // 更新下落速度
            dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        }
    }
    
    // 重置方塊
    function resetPiece() {
        if (!nextPiece) {
            nextPiece = getRandomPiece();
        }
        
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        drawNextPiece();
        
        // 檢查遊戲是否結束
        if (collide(currentPiece, board)) {
            gameOver = true;
            showGameOver();
            cancelAnimationFrame(animationId);
        }
    }
    
    // 更新分數顯示
    function updateScore() {
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        linesDisplay.textContent = lines;
    }
    
    // 顯示遊戲結束訊息
    function showGameOver() {
        finalScoreDisplay.textContent = score;
        gameOverMessage.style.display = 'flex';
    }
    
    // 隱藏遊戲結束訊息
    function hideGameOver() {
        gameOverMessage.style.display = 'none';
    }
    
    // 顯示/隱藏暫停訊息
    function togglePauseMessage() {
        pauseMessage.style.display = isPaused ? 'flex' : 'none';
    }
    
    // 暫停/繼續遊戲
    function togglePause() {
        if (gameOver) return;
        
        isPaused = !isPaused;
        togglePauseMessage();
        
        if (!isPaused) {
            lastTime = performance.now();
            animate(lastTime);
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    // 重置遊戲
    function resetGame() {
        board = createEmptyBoard();
        score = 0;
        level = 1;
        lines = 0;
        dropInterval = 1000;
        gameOver = false;
        isPaused = false;
        
        hideGameOver();
        togglePauseMessage();
        
        nextPiece = getRandomPiece();
        resetPiece();
        updateScore();
        draw();
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        lastTime = performance.now();
        animate(lastTime);
    }
    
    // 遊戲循環
    function animate(time) {
        if (isPaused) return;
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            dropPiece();
            dropCounter = 0;
        }
        
        draw();
        animationId = requestAnimationFrame(animate);
    }
    
    // 鍵盤控制
    document.addEventListener('keydown', event => {
        if (gameOver) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                movePiece(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                movePiece(1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                dropPiece();
                break;
            case 'ArrowUp':
                event.preventDefault();
                rotatePiece();
                break;
            case ' ':
                event.preventDefault();
                hardDrop();
                break;
            case 'p':
            case 'P':
                event.preventDefault();
                togglePause();
                break;
        }
    });
    
    // 按鈕控制
    startButton.addEventListener('click', togglePause);
    resetButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);
    
    // 移動設備控制
    leftButton.addEventListener('click', () => movePiece(-1));
    rightButton.addEventListener('click', () => movePiece(1));
    rotateButton.addEventListener('click', rotatePiece);
    downButton.addEventListener('click', dropPiece);
    dropButton.addEventListener('click', hardDrop);
    
    // 初始化遊戲
    resetGame();
}); 