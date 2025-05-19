// 所有頁面共用的 JavaScript 功能

// 確保在 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
  // 設置導覽列 active 標記
  setupNavigation();
  
  // 注意：語言切換按鈕功能已移至 i18n.js，統一管理
  console.log('common.js 載入完成');
});


// 設置導覽列 active 標記
function setupNavigation() {
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const isActive = location.pathname.endsWith(href) || 
                     (href === 'index.html' && (location.pathname.endsWith('/') || location.pathname.endsWith('/src/')));
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}