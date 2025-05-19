// 首頁 JS 功能 - 完全重構版 v1.1.0
console.log('正在載入 main.js v1.1.0...');

// 確保 window.worksData 和 window.newsData 被正確定義
if (!window.worksData) {
  console.error('worksData 未定義！檔案載入順序可能有問題');
  window.worksData = [];
}

if (!window.newsData) {
  console.error('newsData 未定義！檔案載入順序可能有問題');
  window.newsData = [];
}

// 防止重複渲染的標記
let isRendering = false;

// 將 renderWorks 設為全局函數，使其可以被 i18n.js 調用
window.renderWorks = function() {
  console.log('renderWorks 被調用，時間:', new Date().toISOString());
  
  // 如果正在渲染，則直接返回
  if (isRendering) {
    console.log('正在渲染中，跳過此次調用');
    return;
  }
  
  isRendering = true;
  console.log('開始渲染作品列表...');
  
  try {
    // 確認是否有數據和目標元素
    if (!window.worksData || !Array.isArray(window.worksData)) {
      throw new Error('worksData 不是有效的陣列');
    }
    
    let worksList = document.getElementById('works-list');
    if (!worksList) {
      console.log('警告：找不到 works-list 元素，嘗試創建一個');
      const featuredWorks = document.querySelector('section#featured-works');
      console.log('featuredWorks 元素:', featuredWorks);
      
      if (featuredWorks) {
        // 創建 works-list 容器
        worksList = document.createElement('div');
        worksList.id = 'works-list';
        worksList.className = 'works-list';
        
        // 創建一個標題
        const title = document.createElement('h2');
        title.textContent = '精選作品';
        
        // 清空 featured-works 並添加新元素
        featuredWorks.innerHTML = '';
        featuredWorks.appendChild(title);
        featuredWorks.appendChild(worksList);
        
        console.log('已創建 works-list 元素');
      } else {
        console.error('錯誤：找不到 #featured-works 元素');
        return; // 如果找不到父元素，直接返回
      }
    }
    
    // 清空現有內容，但保留 works-list 元素本身
    while (worksList.firstChild) {
      worksList.removeChild(worksList.firstChild);
    }
    
    // 獲取當前語言
    const currentLang = (window.i18n && window.i18n.lang) ? window.i18n.lang : 'zh';
    const viewMoreText = currentLang === 'zh' ? '查看詳情 →' : 'View Details →';
    
    console.log('當前語言:', currentLang);
    console.log('可用的作品數據:', window.worksData.length);
    
    // 篩選出精選作品
    const featuredWorks = window.worksData.filter(work => work.featured);
    
    // 按類別分組
    const webWorks = featuredWorks.filter(work => work.category === 'web');
    const chromeWorks = featuredWorks.filter(work => work.category === 'chrome');
    const appWorks = featuredWorks.filter(work => work.category === 'app');
    
    // 添加 Web 作品區段
    if (webWorks.length > 0) {
      const webSection = document.createElement('div');
      webSection.className = 'works-section';
      webSection.innerHTML = `<h3 class="category-title">1. Web</h3>`;
      
      const gridContainer = document.createElement('div');
      gridContainer.className = 'works-grid';
      
      webWorks.forEach(work => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.id = work.id;
        
        // 檢查是否有對應的翻譯
        let title = work.title;
        let desc = work.desc;
        
        // 嘗試獲取翻譯
        try {
          if (currentLang === 'en' && window.i18n && 
              window.i18n.translations && 
              typeof window.i18n.translations === 'function' && 
              window.i18n.translations().en && 
              window.i18n.translations().en.works && 
              window.i18n.translations().en.works[work.id]) {
            
            const langData = window.i18n.translations().en.works[work.id];
            if (langData) {
              title = langData.title || title;
              desc = langData.desc || desc;
              console.log(`找到 ${work.id} 的翻譯:`, title);
            }
          }
        } catch (e) {
          console.error('獲取翻譯時出錯:', e);
        }
        
        card.innerHTML = `
          <h4>${title}</h4>
          <p>${desc}</p>
          <div style="margin-top: auto; padding-top: 1rem;">
            <a href="portfolio.html#${work.id}" class="work-link">${viewMoreText}</a>
          </div>
        `;
        gridContainer.appendChild(card);
      });
      
      webSection.appendChild(gridContainer);
      worksList.appendChild(webSection);
    }
    
    // 添加 Chrome 擴充程式區段
    if (chromeWorks.length > 0) {
      const chromeSection = document.createElement('div');
      chromeSection.className = 'works-section';
      chromeSection.innerHTML = `<h3 class="category-title">2. ${currentLang === 'zh' ? 'Chrome 擴充程式' : 'Chrome Extensions'}</h3>`;
      
      const gridContainer = document.createElement('div');
      gridContainer.className = 'works-grid';
      
      chromeWorks.forEach(work => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.id = work.id;
        
        // 檢查是否有對應的翻譯
        let title = work.title;
        let desc = work.desc;
        
        try {
          if (currentLang === 'en' && window.i18n && 
              window.i18n.translations && 
              typeof window.i18n.translations === 'function' && 
              window.i18n.translations().en && 
              window.i18n.translations().en.works && 
              window.i18n.translations().en.works[work.id]) {
            
            const langData = window.i18n.translations().en.works[work.id];
            if (langData) {
              title = langData.title || title;
              desc = langData.desc || desc;
            }
          }
        } catch (e) {
          console.error('獲取翻譯時出錯:', e);
        }
        
        card.innerHTML = `
          <h4>${title}</h4>
          <p>${desc}</p>
          <div style="margin-top: auto; padding-top: 1rem;">
            <a href="portfolio.html#${work.id}" class="work-link">${viewMoreText}</a>
          </div>
        `;
        gridContainer.appendChild(card);
      });
      
      chromeSection.appendChild(gridContainer);
      worksList.appendChild(chromeSection);
    }
    
    // 添加 iOS App 區段
    if (appWorks.length > 0) {
      const appSection = document.createElement('div');
      appSection.className = 'works-section';
      appSection.innerHTML = `<h3 class="category-title">3. ${currentLang === 'zh' ? 'iOS 應用程式' : 'iOS Apps'}</h3>`;
      
      const gridContainer = document.createElement('div');
      gridContainer.className = 'works-grid';
      
      appWorks.forEach(work => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.id = work.id;
        
        // 檢查是否有對應的翻譯
        let title = work.title;
        let desc = work.desc;
        
        try {
          if (currentLang === 'en' && window.i18n && 
              window.i18n.translations && 
              typeof window.i18n.translations === 'function' && 
              window.i18n.translations().en && 
              window.i18n.translations().en.works && 
              window.i18n.translations().en.works[work.id]) {
            
            const langData = window.i18n.translations().en.works[work.id];
            if (langData) {
              title = langData.title || title;
              desc = langData.desc || desc;
            }
          }
        } catch (e) {
          console.error('獲取翻譯時出錯:', e);
        }
        
        card.innerHTML = `
          <h4>${title}</h4>
          <p>${desc}</p>
          <div style="margin-top: auto; padding-top: 1rem;">
            <a href="portfolio.html#${work.id}" class="work-link">${viewMoreText}</a>
          </div>
        `;
        gridContainer.appendChild(card);
      });
      
      appSection.appendChild(gridContainer);
      worksList.appendChild(appSection);
    }
    
    console.log('作品列表渲染完成');
  } catch (error) {
    console.error('渲染作品時發生錯誤:', error);
  } finally {
    isRendering = false;
  }
};

// 渲染最新消息
function renderNews() {
  console.log('渲染近期動態...');
  
  // 確保頁面是首頁
  const isHomePage = location.pathname.endsWith('index.html') || 
                     location.pathname.endsWith('/') || 
                     location.pathname.endsWith('/src/');
  
  if (!isHomePage) {
    console.log('不是首頁，跳過渲染近期動態');
    return;
  }
  
  try {
    let newsList = document.getElementById('news-list');
    if (!newsList) {
      console.log('警告：找不到 news-list 元素，嘗試創建一個');
      const newsSection = document.querySelector('section#news');
      console.log('newsSection 元素:', newsSection);
      
      if (newsSection) {
        // 創建 news-list 容器
        newsList = document.createElement('div');
        newsList.id = 'news-list';
        newsList.className = 'news-list';
        
        // 創建一個標題
        const title = document.createElement('h2');
        title.textContent = '最新消息';
        
        // 清空 recent-news 並添加新元素
        newsSection.innerHTML = '';
        newsSection.appendChild(title);
        newsSection.appendChild(newsList);
        
        console.log('已創建 news-list 元素');
      } else {
        console.error('錯誤：找不到 #recent-news 元素');
        return; // 如果找不到父元素，直接返回
      }
    }
    
    // 清空現有內容，但保留 news-list 元素本身
    while (newsList.firstChild) {
      newsList.removeChild(newsList.firstChild);
    }
    
    // 獲取當前語言
    const currentLang = (window.i18n && window.i18n.lang) ? window.i18n.lang : 'zh';
    
    // 添加新聞條目
    window.newsData.forEach(news => {
      const li = document.createElement('li');
      
      // 嘗試獲取翻譯
      let newsText = news.text;
      try {
        if (currentLang === 'en' && window.i18n && 
            window.i18n.translations && 
            typeof window.i18n.translations === 'function' && 
            window.i18n.translations().en && 
            window.i18n.translations().en.news && 
            window.i18n.translations().en.news[news.date]) {
          
          newsText = window.i18n.translations().en.news[news.date] || newsText;
        }
      } catch (e) {
        console.error('獲取新聞翻譯時出錯:', e);
      }
      
      li.textContent = `${news.date}｜${newsText}`;
      newsList.appendChild(li);
    });
    
    console.log('近期動態渲染完成');
  } catch (error) {
    console.error('渲染近期動態時發生錯誤:', error);
  }
}

// 初始化頁面
function initPage() {
  console.log('初始化頁面...');
  
  // 確保只在首頁執行
  const isHomePage = location.pathname.endsWith('index.html') || 
                     location.pathname.endsWith('/') || 
                     location.pathname.endsWith('/src/');
  
  if (!isHomePage) {
    console.log('不是首頁，跳過初始化');
    return;
  }
  
  // 渲染作品和新聞
  window.renderWorks();
  renderNews();
}

// 確保 DOM 完全載入後再初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 已完全載入');
  
  // 延遲一下，確保 i18n.js 已完全載入並初始化
  setTimeout(initPage, 100);
});