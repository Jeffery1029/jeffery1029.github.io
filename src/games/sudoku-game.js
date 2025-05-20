document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const board = document.getElementById('sudoku-board');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const hintBtn = document.getElementById('hint-btn');
    const solveBtn = document.getElementById('solve-btn');
    const timerDisplay = document.getElementById('timer');
    const statusMessage = document.getElementById('status-message');
    const numberButtons = document.querySelectorAll('.number-btn');
    const gameCompleteModal = document.getElementById('game-complete-modal');
    const completionTimeDisplay = document.getElementById('completion-time');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // 遊戲變數
    let selectedCell = null;
    let notesMode = false;
    let gameBoard = Array(9).fill().map(() => Array(9).fill(0));
    let solution = Array(9).fill().map(() => Array(9).fill(0));
    let fixedCells = Array(9).fill().map(() => Array(9).fill(false));
    let timer = 0;
    let timerInterval = null;
    let gameStarted = false;
    
    // 初始化遊戲
    function initGame() {
        clearBoard();
        stopTimer();
        timer = 0;
        updateTimerDisplay();
        
        const difficulty = difficultySelect.value;
        generateSudoku(difficulty);
        renderBoard();
        
        gameStarted = true;
        startTimer();
        
        // 使用多語言文本
        const newGameStart = document.getElementById('new-game-start') ? 
            document.getElementById('new-game-start').textContent : '開始新的';
        const difficultyGame = document.getElementById('difficulty-game') ? 
            document.getElementById('difficulty-game').textContent : '難度遊戲！';
        
        statusMessage.textContent = `${newGameStart} ${getDifficultyText(difficulty)} ${difficultyGame}`;
        statusMessage.className = 'status-message info';
    }
    
    // 清空棋盤
    function clearBoard() {
        board.innerHTML = '';
        gameBoard = Array(9).fill().map(() => Array(9).fill(0));
        solution = Array(9).fill().map(() => Array(9).fill(0));
        fixedCells = Array(9).fill().map(() => Array(9).fill(false));
        selectedCell = null;
    }
    
    // 生成數獨
    function generateSudoku(difficulty) {
        // 生成完整解答
        generateSolution();
        
        // 複製解答到遊戲板
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                gameBoard[i][j] = solution[i][j];
            }
        }
        
        // 根據難度移除數字
        let cellsToRemove;
        switch (difficulty) {
            case 'easy':
                cellsToRemove = 40; // 留下 41 個數字
                break;
            case 'medium':
                cellsToRemove = 50; // 留下 31 個數字
                break;
            case 'hard':
                cellsToRemove = 55; // 留下 26 個數字
                break;
            case 'expert':
                cellsToRemove = 60; // 留下 21 個數字
                break;
            default:
                cellsToRemove = 50;
        }
        
        // 隨機移除數字
        let positions = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                positions.push({row: i, col: j});
            }
        }
        
        // 打亂位置數組
        shuffleArray(positions);
        
        // 移除指定數量的數字
        for (let i = 0; i < cellsToRemove; i++) {
            const pos = positions[i];
            gameBoard[pos.row][pos.col] = 0;
        }
        
        // 標記固定的單元格
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                fixedCells[i][j] = gameBoard[i][j] !== 0;
            }
        }
    }
    
    // 生成完整解答
    function generateSolution() {
        // 創建空棋盤
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                solution[i][j] = 0;
            }
        }
        
        // 填充解答
        solveSudoku(solution);
    }
    
    // 解數獨算法
    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    // 打亂數字順序以生成不同的解答
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffleArray(nums);
                    
                    for (let num of nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (solveSudoku(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 檢查數字是否有效
    function isValid(board, row, col, num) {
        // 檢查行
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                return false;
            }
        }
        
        // 檢查列
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                return false;
            }
        }
        
        // 檢查3x3宮格
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 打亂數組
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 渲染棋盤
    function renderBoard() {
        board.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                if (gameBoard[i][j] !== 0) {
                    cell.textContent = gameBoard[i][j];
                    cell.classList.add('fixed');
                } else {
                    // 創建筆記容器
                    const notesContainer = document.createElement('div');
                    notesContainer.classList.add('notes-container');
                    
                    for (let k = 1; k <= 9; k++) {
                        const note = document.createElement('div');
                        note.classList.add('note');
                        note.dataset.note = k;
                        notesContainer.appendChild(note);
                    }
                    
                    cell.appendChild(notesContainer);
                }
                
                cell.addEventListener('click', () => selectCell(cell));
                board.appendChild(cell);
            }
        }
    }
    
    // 選擇單元格
    function selectCell(cell) {
        // 移除之前選中的單元格
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        
        // 移除相同數字的高亮
        document.querySelectorAll('.cell.same-number').forEach(cell => {
            cell.classList.remove('same-number');
        });
        
        // 設置新選中的單元格
        selectedCell = cell;
        selectedCell.classList.add('selected');
        
        // 高亮相同數字
        const num = parseInt(selectedCell.textContent);
        if (!isNaN(num) && num !== 0) {
            document.querySelectorAll('.cell').forEach(cell => {
                if (parseInt(cell.textContent) === num) {
                    cell.classList.add('same-number');
                }
            });
        }
    }
    
    // 輸入數字
    function inputNumber(number) {
        if (!selectedCell || !gameStarted) return;
        
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        
        // 如果是固定單元格，不允許修改
        if (fixedCells[row][col]) return;
        
        if (notesMode && number !== 0) {
            // 筆記模式
            toggleNote(number);
        } else {
            // 正常模式
            gameBoard[row][col] = number;
            
            if (number === 0) {
                // 清除數字
                selectedCell.textContent = '';
                
                // 創建筆記容器
                const notesContainer = document.createElement('div');
                notesContainer.classList.add('notes-container');
                
                for (let k = 1; k <= 9; k++) {
                    const note = document.createElement('div');
                    note.classList.add('note');
                    note.dataset.note = k;
                    notesContainer.appendChild(note);
                }
                
                selectedCell.appendChild(notesContainer);
            } else {
                // 設置數字
                selectedCell.textContent = number;
                
                // 移除錯誤和提示類
                selectedCell.classList.remove('error', 'hint');
                
                // 高亮相同數字
                document.querySelectorAll('.cell.same-number').forEach(cell => {
                    cell.classList.remove('same-number');
                });
                
                document.querySelectorAll('.cell').forEach(cell => {
                    if (parseInt(cell.textContent) === number) {
                        cell.classList.add('same-number');
                    }
                });
            }
            
            // 檢查是否完成遊戲
            if (checkCompletion()) {
                gameComplete();
            }
        }
    }
    
    // 切換筆記
    function toggleNote(number) {
        if (!selectedCell) return;
        
        const notesContainer = selectedCell.querySelector('.notes-container');
        if (!notesContainer) return;
        
        const note = notesContainer.querySelector(`.note[data-note="${number}"]`);
        if (!note) return;
        
        if (note.textContent === '') {
            note.textContent = number;
        } else {
            note.textContent = '';
        }
    }
    
    // 切換筆記模式
    function toggleNotesMode() {
        notesMode = !notesMode;
        const notesButton = document.querySelector('.number-btn[data-number="notes"]');
        
        if (notesMode) {
            notesButton.classList.add('active');
        } else {
            notesButton.classList.remove('active');
        }
    }
    
    // 檢查當前棋盤
    function checkCurrentBoard() {
        if (!gameStarted) return;
        
        let hasError = false;
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                
                // 跳過空白單元格
                if (gameBoard[i][j] === 0) continue;
                
                // 檢查是否正確
                if (gameBoard[i][j] !== solution[i][j]) {
                    cell.classList.add('error');
                    hasError = true;
                } else {
                    cell.classList.remove('error');
                    cell.classList.add('correct');
                }
            }
        }
        
        if (hasError) {
            statusMessage.textContent = '有些數字填寫錯誤！';
            statusMessage.className = 'status-message error';
        } else {
            statusMessage.textContent = '目前填寫的數字都是正確的！';
            statusMessage.className = 'status-message success';
        }
    }
    
    // 檢查是否完成遊戲
    function checkCompletion() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (gameBoard[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 遊戲完成
    function gameComplete() {
        stopTimer();
        gameStarted = false;
        
        // 顯示完成時間
        completionTimeDisplay.textContent = formatTime(timer);
        
        // 顯示遊戲完成模態框
        gameCompleteModal.style.display = 'flex';
    }
    
    // 提供提示
    function giveHint() {
        if (!gameStarted || !selectedCell) {
            statusMessage.textContent = '請先選擇一個單元格！';
            statusMessage.className = 'status-message info';
            return;
        }
        
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);
        
        // 如果是固定單元格或已經填寫正確，不提供提示
        if (fixedCells[row][col] || gameBoard[row][col] === solution[row][col]) {
            statusMessage.textContent = '請選擇一個空白或錯誤的單元格！';
            statusMessage.className = 'status-message info';
            return;
        }
        
        // 填入正確答案
        gameBoard[row][col] = solution[row][col];
        selectedCell.textContent = solution[row][col];
        selectedCell.classList.add('hint');
        selectedCell.classList.remove('error');
        
        statusMessage.textContent = '已提供提示！';
        statusMessage.className = 'status-message info';
        
        // 檢查是否完成遊戲
        if (checkCompletion()) {
            gameComplete();
        }
    }
    
    // 解答整個數獨
    function solveEntireBoard() {
        if (!gameStarted) return;
        
        // 確認用戶真的想要解答
        if (!confirm('確定要顯示完整解答嗎？這將結束當前遊戲。')) {
            return;
        }
        
        // 填入所有答案
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (gameBoard[i][j] !== solution[i][j]) {
                    gameBoard[i][j] = solution[i][j];
                    
                    const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
                    cell.textContent = solution[i][j];
                    cell.classList.add('hint');
                    cell.classList.remove('error');
                }
            }
        }
        
        stopTimer();
        gameStarted = false;
        
        statusMessage.textContent = '已顯示完整解答！';
        statusMessage.className = 'status-message info';
    }
    
    // 開始計時器
    function startTimer() {
        stopTimer();
        timerInterval = setInterval(() => {
            timer++;
            updateTimerDisplay();
        }, 1000);
    }
    
    // 停止計時器
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    // 更新計時器顯示
    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timer);
    }
    
    // 格式化時間
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // 獲取難度文字 - 現在已由 HTML 中的函數處理
    function getDifficultyText(difficulty) {
        // 當 i18n 可用時使用多語言版本
        if (window.i18n && window.gameTranslations) {
            const lang = window.i18n.lang;
            const translations = window.gameTranslations[lang];
            
            switch (difficulty) {
                case 'easy': return translations['difficulty-easy'] || '簡單';
                case 'medium': return translations['difficulty-medium'] || '中等';
                case 'hard': return translations['difficulty-hard'] || '困難';
                case 'expert': return translations['difficulty-expert'] || '專家';
                default: return translations['difficulty-medium'] || '中等';
            }
        } else {
            // 後備方案，使用預設的中文
            switch (difficulty) {
                case 'easy': return '簡單';
                case 'medium': return '中等';
                case 'hard': return '困難';
                case 'expert': return '專家';
                default: return '中等';
            }
        }
    }
    
    // 事件監聽器
    newGameBtn.addEventListener('click', initGame);
    checkBtn.addEventListener('click', checkCurrentBoard);
    hintBtn.addEventListener('click', giveHint);
    solveBtn.addEventListener('click', solveEntireBoard);
    playAgainBtn.addEventListener('click', () => {
        gameCompleteModal.style.display = 'none';
        initGame();
    });
    
    // 數字按鈕事件
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.dataset.number;
            
            if (number === 'notes') {
                toggleNotesMode();
            } else {
                inputNumber(parseInt(number));
            }
        });
    });
    
    // 鍵盤事件
    document.addEventListener('keydown', (e) => {
        if (!gameStarted) return;
        
        const key = e.key;
        
        // 數字鍵 1-9
        if (/^[1-9]$/.test(key)) {
            inputNumber(parseInt(key));
        }
        
        // 刪除鍵或 0 鍵清除
        if (key === 'Delete' || key === 'Backspace' || key === '0') {
            inputNumber(0);
        }
        
        // N 鍵切換筆記模式
        if (key === 'n' || key === 'N') {
            toggleNotesMode();
        }
    });
    
    // 初始化遊戲
    initGame();
}); 