document.addEventListener('DOMContentLoaded', function() {
    // 遊戲元素
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const restartButton = document.getElementById('restart-button');
    const difficultySelect = document.getElementById('difficulty-select');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalTimeDisplay = document.getElementById('final-time');
    const playAgainButton = document.getElementById('play-again-button');
    
    // 遊戲變數
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let gameStarted = false;
    let timer = 0;
    let timerInterval;
    let totalPairs = 0;
    let canFlip = true;
    
    // 卡片圖案（使用 Emoji）
    const cardSymbols = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
        '🦄', '🐙', '🦋', '🦀', '🐢', '🐬', '🦈', '🐳'
    ];
    
    // 難度設定
    const difficulties = {
        easy: { rows: 3, cols: 4 },
        medium: { rows: 4, cols: 4 },
        hard: { rows: 4, cols: 5 }
    };
    
    // 初始化遊戲
    function initGame() {
        resetGame();
        
        const difficulty = difficultySelect.value;
        const { rows, cols } = difficulties[difficulty];
        
        // 設置遊戲板格線
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
        totalPairs = (rows * cols) / 2;
        
        // 創建卡片
        createCards(rows, cols);
        
        // 重置顯示
        updateMovesDisplay();
        updateTimerDisplay();
    }
    
    // 重置遊戲
    function resetGame() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        gameStarted = false;
        canFlip = true;
        
        // 清除計時器
        clearInterval(timerInterval);
        timer = 0;
        
        // 隱藏遊戲結束模態框
        gameOverModal.style.display = 'none';
    }
    
    // 創建卡片
    function createCards(rows, cols) {
        const totalCards = rows * cols;
        const symbolsNeeded = totalCards / 2;
        
        // 選擇需要的符號
        const selectedSymbols = cardSymbols.slice(0, symbolsNeeded);
        
        // 創建卡片對
        let cardPairs = [...selectedSymbols, ...selectedSymbols];
        
        // 洗牌
        cardPairs = shuffleArray(cardPairs);
        
        // 創建卡片元素
        for (let i = 0; i < totalCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = i;
            
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            cardContent.textContent = cardPairs[i];
            
            card.appendChild(cardContent);
            card.addEventListener('click', flipCard);
            
            gameBoard.appendChild(card);
            cards.push(card);
        }
    }
    
    // 洗牌函數
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // 翻牌
    function flipCard() {
        // 如果不能翻牌或已經翻開或已經配對，則返回
        if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        // 開始遊戲計時
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        // 翻牌
        this.classList.add('flipped');
        flippedCards.push(this);
        
        // 如果翻了兩張牌，檢查是否匹配
        if (flippedCards.length === 2) {
            moves++;
            updateMovesDisplay();
            canFlip = false;
            
            const card1Content = flippedCards[0].querySelector('.card-content').textContent;
            const card2Content = flippedCards[1].querySelector('.card-content').textContent;
            
            if (card1Content === card2Content) {
                // 匹配成功
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.add('matched');
                    });
                    flippedCards = [];
                    matchedPairs++;
                    canFlip = true;
                    
                    // 檢查遊戲是否結束
                    if (matchedPairs === totalPairs) {
                        endGame();
                    }
                }, 500);
            } else {
                // 不匹配，翻回去
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    // 開始計時器
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            updateTimerDisplay();
        }, 1000);
    }
    
    // 更新移動次數顯示
    function updateMovesDisplay() {
        const movesLabel = document.getElementById('moves-label');
        const movesCount = document.getElementById('moves-count');
        if (movesLabel && movesCount) {
            movesCount.textContent = moves;
        } else {
            // 兼容舊版顯示方式
            const lang = window.i18n && window.i18n.lang === 'en' ? 'en' : 'zh';
            const movesText = lang === 'en' ? 'Moves' : '移動次數';
            movesDisplay.innerHTML = `<span id="moves-label">${movesText}</span><span class="colon">${lang === 'en' ? ': ' : '：'}</span> <span id="moves-count">${moves}</span>`;
        }
    }
    
    // 更新計時器顯示
    function updateTimerDisplay() {
        const timerLabel = document.getElementById('timer-label');
        const timerCount = document.getElementById('timer-count');
        const secondsLabel = document.getElementById('seconds-label');
        if (timerLabel && timerCount && secondsLabel) {
            timerCount.textContent = timer;
        } else {
            // 兼容舊版顯示方式
            const lang = window.i18n && window.i18n.lang === 'en' ? 'en' : 'zh';
            const timerText = lang === 'en' ? 'Time' : '時間';
            const secondsText = lang === 'en' ? 'sec' : '秒';
            timerDisplay.innerHTML = `<span id="timer-label">${timerText}</span><span class="colon">${lang === 'en' ? ': ' : '：'}</span> <span id="timer-count">${timer}</span> <span id="seconds-label">${secondsText}</span>`;
        }
    }
    
    // 結束遊戲
    function endGame() {
        clearInterval(timerInterval);
        
        // 更新遊戲結束模態框
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timer;
        
        // 顯示遊戲結束模態框
        setTimeout(() => {
            gameOverModal.style.display = 'flex';
        }, 500);
    }
    
    // 事件監聽器
    restartButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', initGame);
    
    // 初始化遊戲
    initGame();
}); 