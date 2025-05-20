document.addEventListener('DOMContentLoaded', function() {
    // 遊戲卡片懸停效果增強
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 添加微小的旋轉效果
            const rotation = Math.random() * 2 - 1; // -1 到 1 度之間的隨機值
            this.style.transform = `translateY(-10px) rotate(${rotation}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // 為圖標添加自定義類
    customizeIcons();
    
    // 添加頁面載入動畫
    document.body.classList.add('loaded');
    
    // 記錄最近玩過的遊戲
    trackRecentGames();
});

// 自定義圖標顯示
function customizeIcons() {
    // 由於 Font Awesome 可能沒有某些特定圖標，我們使用文字替代
    const snakeIcon = document.querySelector('[data-game="snake"] .game-icon i');
    if (snakeIcon) {
        snakeIcon.classList.remove('fa-snake');
        snakeIcon.classList.add('fa-gamepad');
        snakeIcon.textContent = '🐍';
    }
    
    // 確保其他圖標正確顯示
    const iconMap = {
        'sudoku': 'fa-table-cells',
        'tetris': 'fa-cubes',
        'breakout': 'fa-table-tennis-paddle-ball',
        'memory': 'fa-brain',
        '2048': 'fa-calculator'
    };
    
    for (const [game, icon] of Object.entries(iconMap)) {
        const gameIcon = document.querySelector(`[data-game="${game}"] .game-icon i`);
        if (gameIcon) {
            gameIcon.className = ''; // 清除所有類
            gameIcon.classList.add('fas', icon);
        }
    }
}

// 追蹤最近玩過的遊戲
function trackRecentGames() {
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const gameName = this.closest('.game-card').getAttribute('data-game');
            
            // 獲取現有的最近遊戲列表
            let recentGames = JSON.parse(localStorage.getItem('recentGames') || '[]');
            
            // 將當前遊戲添加到列表前面
            recentGames = recentGames.filter(game => game !== gameName);
            recentGames.unshift(gameName);
            
            // 只保留最近的 5 個遊戲
            if (recentGames.length > 5) {
                recentGames = recentGames.slice(0, 5);
            }
            
            // 保存到本地存儲
            localStorage.setItem('recentGames', JSON.stringify(recentGames));
        });
    });
} 