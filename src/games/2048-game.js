document.addEventListener('DOMContentLoaded', function() {
    // 遊戲元素
    const gridTiles = document.querySelector('.grid-tiles');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game-button');
    const retryButton = document.getElementById('retry-button');
    const gameMessage = document.querySelector('.game-message');
    const gameMessageText = gameMessage.querySelector('p');
    
    // 遊戲變數
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-best-score') || 0;
    let gameOver = false;
    let gameWon = false;
    let touchStartX = 0;
    let touchStartY = 0;
    
    // 初始化遊戲
    function initGame() {
        // 重置遊戲狀態
        grid = createEmptyGrid();
        score = 0;
        gameOver = false;
        gameWon = false;
        
        // 更新顯示
        updateScore();
        updateBestScore();
        
        // 隱藏遊戲訊息
        gameMessage.style.display = 'none';
        gameMessage.classList.remove('game-won', 'game-over');
        
        // 清空網格
        gridTiles.innerHTML = '';
        
        // 添加初始方塊
        addRandomTile();
        addRandomTile();
        
        // 渲染網格
        renderGrid();
    }
    
    // 創建空網格
    function createEmptyGrid() {
        const newGrid = [];
        for (let i = 0; i < gridSize; i++) {
            newGrid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                newGrid[i][j] = 0;
            }
        }
        return newGrid;
    }
    
    // 添加隨機方塊
    function addRandomTile() {
        const emptyCells = [];
        
        // 找出所有空格子
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        // 如果沒有空格子，返回
        if (emptyCells.length === 0) return;
        
        // 隨機選擇一個空格子
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // 90% 機率生成 2，10% 機率生成 4
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        
        // 創建新方塊元素
        createTileElement(randomCell.row, randomCell.col, grid[randomCell.row][randomCell.col], true);
    }
    
    // 創建方塊元素
    function createTileElement(row, col, value, isNew = false) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}${isNew ? ' tile-new' : ''}`;
        tile.textContent = value;
        
        // 計算位置
        const cellSize = 100 / gridSize;
        const gap = 10; // 間隙大小
        
        tile.style.width = `calc(${cellSize}% - ${gap}px)`;
        tile.style.height = `calc(${cellSize}% - ${gap}px)`;
        tile.style.top = `calc(${row * cellSize}% + ${gap / 2}px)`;
        tile.style.left = `calc(${col * cellSize}% + ${gap / 2}px)`;
        
        // 調整字體大小
        if (value > 512) {
            tile.style.fontSize = '20px';
        } else if (value > 64) {
            tile.style.fontSize = '28px';
        } else {
            tile.style.fontSize = '32px';
        }
        
        // 如果數值超過 2048，使用特殊樣式
        if (value > 2048) {
            tile.classList.add('tile-super');
        }
        
        gridTiles.appendChild(tile);
        return tile;
    }
    
    // 渲染網格
    function renderGrid() {
        gridTiles.innerHTML = '';
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] !== 0) {
                    createTileElement(i, j, grid[i][j]);
                }
            }
        }
    }
    
    // 更新分數
    function updateScore() {
        scoreDisplay.textContent = score;
    }
    
    // 更新最高分
    function updateBestScore() {
        bestScoreDisplay.textContent = bestScore;
    }
    
    // 移動方塊
    function moveTiles(direction) {
        if (gameOver || gameWon) return false;
        
        let moved = false;
        const newGrid = createEmptyGrid();
        
        // 根據方向處理移動
        switch (direction) {
            case 'up':
                for (let j = 0; j < gridSize; j++) {
                    let col = [];
                    for (let i = 0; i < gridSize; i++) {
                        if (grid[i][j] !== 0) {
                            col.push(grid[i][j]);
                        }
                    }
                    
                    col = mergeTiles(col);
                    
                    for (let i = 0; i < gridSize; i++) {
                        newGrid[i][j] = i < col.length ? col[i] : 0;
                        if (grid[i][j] !== newGrid[i][j]) {
                            moved = true;
                        }
                    }
                }
                break;
                
            case 'right':
                for (let i = 0; i < gridSize; i++) {
                    let row = [];
                    for (let j = gridSize - 1; j >= 0; j--) {
                        if (grid[i][j] !== 0) {
                            row.push(grid[i][j]);
                        }
                    }
                    
                    row = mergeTiles(row);
                    
                    for (let j = gridSize - 1; j >= 0; j--) {
                        const index = gridSize - 1 - j;
                        newGrid[i][j] = index < row.length ? row[index] : 0;
                        if (grid[i][j] !== newGrid[i][j]) {
                            moved = true;
                        }
                    }
                }
                break;
                
            case 'down':
                for (let j = 0; j < gridSize; j++) {
                    let col = [];
                    for (let i = gridSize - 1; i >= 0; i--) {
                        if (grid[i][j] !== 0) {
                            col.push(grid[i][j]);
                        }
                    }
                    
                    col = mergeTiles(col);
                    
                    for (let i = gridSize - 1; i >= 0; i--) {
                        const index = gridSize - 1 - i;
                        newGrid[i][j] = index < col.length ? col[index] : 0;
                        if (grid[i][j] !== newGrid[i][j]) {
                            moved = true;
                        }
                    }
                }
                break;
                
            case 'left':
                for (let i = 0; i < gridSize; i++) {
                    let row = [];
                    for (let j = 0; j < gridSize; j++) {
                        if (grid[i][j] !== 0) {
                            row.push(grid[i][j]);
                        }
                    }
                    
                    row = mergeTiles(row);
                    
                    for (let j = 0; j < gridSize; j++) {
                        newGrid[i][j] = j < row.length ? row[j] : 0;
                        if (grid[i][j] !== newGrid[i][j]) {
                            moved = true;
                        }
                    }
                }
                break;
        }
        
        if (moved) {
            grid = newGrid;
            addRandomTile();
            renderGrid();
            updateScore();
            
            // 檢查遊戲狀態
            checkGameState();
        }
        
        return moved;
    }
    
    // 合併方塊
    function mergeTiles(tiles) {
        const merged = [];
        
        for (let i = 0; i < tiles.length; i++) {
            if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                const mergedValue = tiles[i] * 2;
                merged.push(mergedValue);
                score += mergedValue;
                
                // 更新最高分
                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('2048-best-score', bestScore);
                    updateBestScore();
                }
                
                // 檢查是否達到 2048
                if (mergedValue === 2048 && !gameWon) {
                    gameWon = true;
                    showGameWon();
                }
                
                i++; // 跳過下一個方塊
            } else {
                merged.push(tiles[i]);
            }
        }
        
        return merged;
    }
    
    // 檢查遊戲狀態
    function checkGameState() {
        // 檢查是否還有空格子
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    return; // 還有空格子，遊戲繼續
                }
            }
        }
        
        // 檢查是否還有可合併的方塊
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const value = grid[i][j];
                
                // 檢查右邊
                if (j < gridSize - 1 && grid[i][j + 1] === value) {
                    return; // 可以合併，遊戲繼續
                }
                
                // 檢查下面
                if (i < gridSize - 1 && grid[i + 1][j] === value) {
                    return; // 可以合併，遊戲繼續
                }
            }
        }
        
        // 沒有空格子且沒有可合併的方塊，遊戲結束
        gameOver = true;
        showGameOver();
    }
    
    // 顯示遊戲勝利
    function showGameWon() {
        gameMessageText.textContent = '恭喜！你達成了 2048！';
        gameMessage.classList.add('game-won');
        gameMessage.style.display = 'flex';
    }
    
    // 顯示遊戲結束
    function showGameOver() {
        gameMessageText.textContent = '遊戲結束！';
        gameMessage.classList.add('game-over');
        gameMessage.style.display = 'flex';
    }
    
    // 鍵盤控制
    function handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moveTiles('up');
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveTiles('right');
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveTiles('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveTiles('left');
                break;
        }
    }
    
    // 觸控控制
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // 確定滑動方向
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 水平滑動
            if (diffX > 20) {
                moveTiles('right');
            } else if (diffX < -20) {
                moveTiles('left');
            }
        } else {
            // 垂直滑動
            if (diffY > 20) {
                moveTiles('down');
            } else if (diffY < -20) {
                moveTiles('up');
            }
        }
        
        // 重置觸控起始點
        touchStartX = 0;
        touchStartY = 0;
    }
    
    // 事件監聽器
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    
    newGameButton.addEventListener('click', initGame);
    retryButton.addEventListener('click', initGame);
    
    // 初始化遊戲
    initGame();
}); 