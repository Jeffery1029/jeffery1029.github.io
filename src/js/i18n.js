// 多語言切換（簡易版）- 修訂版 v1.0.4

console.log('載入 i18n.js v1.0.4...');

// 將作品和消息資料整合到 i18n 中
window.worksData = [
  // Web 作品
  { id: 'web1', title: 'UOF Web apps', desc: '企業內部 e 化專案，涉蓋多項流程管理系統', featured: true, category: 'web' },
  { id: 'web2', title: 'iPAS 考題模擬作答器', desc: '協助考生練習 iPAS 相關考試題目的互動式平台', featured: true, category: 'web' },
  { id: 'web3', title: 'YouTube 下載器', desc: '提供 YouTube 影片下載與轉檔功能的網頁應用', featured: true, category: 'web' },
  { id: 'web4', title: '個人資訊網站', desc: '展示個人作品、經歷與技能的響應式網站', featured: true, category: 'web' },
  { id: 'web5', title: 'Luxgen N7 使用手冊快速搜尋器', desc: '針對 Luxgen N7 車款使用手冊的快速搜尋工具', featured: true, category: 'web' },
  
  // Chrome 擴充程式
  { id: 'chrome1', title: 'PDF 分割成圖片', desc: 'Chrome 擴充程式，可將 PDF 文件轉換為圖片格式', featured: true, category: 'chrome' },
  { id: 'chrome2', title: 'PDF Merger以及批次列印', desc: 'Chrome 擴充程式，提供 PDF 合併與批次列印功能', featured: true, category: 'chrome' },
  { id: 'chrome3', title: 'PostIt!', desc: 'Chrome 擴充程式，提供網頁便利貼功能', featured: true, category: 'chrome' },
  { id: 'chrome4', title: '文件比照器', desc: 'Chrome 擴充程式，用於比對文件差異', featured: true, category: 'chrome' },
  
  // iOS app
  { id: 'ios1', title: 'Explore Note 旅途規劃', desc: '旅途規劃與記錄 iOS 應用程式（建構中）', featured: true, category: 'app' },
];

window.newsData = [
  { date: '2025-05-01', text: '個人網站正式上線！' },
  { date: '2025-04-20', text: '新增多語言切換功能' },
];

window.i18n = {
  lang: 'zh',
  // 初始化語言系統
  init() {
    console.log('初始化 i18n 語言系統', new Date().toISOString());
    
    // 嘗試從 localStorage 取得之前儲存的語言設定
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      console.log('從 localStorage 讀取語言設定:', savedLang);
      this.lang = savedLang;
    }
    
    this.setupLangToggle();
    this.apply();
  },
  
  // 設置語言切換按鈕
  setupLangToggle() {
    console.log('嘗試設置語言切換按鈕...');
    
    // 確保按鈕存在
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) {
      console.error('錯誤: 找不到語言切換按鈕 (#lang-toggle)！');
      return;
    }
    
    console.log('成功找到語言切換按鈕元素');
    
    // 移除所有可能存在的事件監聽器
    const newButton = langBtn.cloneNode(true);
    langBtn.parentNode.replaceChild(newButton, langBtn);
    
    // 為新按鈕添加事件處理
    const self = this;
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('語言切換按鈕被點擊，當前語言:', self.lang);
      self.toggle();
      return false;
    });
    
    // 設置正確的按鈕文字
    const langText = newButton.querySelector('span');
    if (langText) {
      const buttonText = this.lang === 'zh' ? 'EN' : '繁';
      langText.textContent = buttonText;
      console.log('設置按鈕文字為:', buttonText);
    } else {
      console.error('錯誤: 按鈕中找不到 span 元素！');
    }
    
    console.log('語言切換按鈕設置完成');
  },
  
  toggle() {
    console.log('切換語言，當前:', this.lang);
    this.lang = this.lang === 'zh' ? 'en' : 'zh';
    
    // 保存偏好設定
    localStorage.setItem('preferred-language', this.lang);
    
    // 更新按鈕文字
    this.updateToggleButton();
    
    // 應用新語言
    this.apply();
    
    console.log('語言切換完成，無需重新載入頁面');
  },
  
  // 更新語言切換按鈕文字
  updateToggleButton() {
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      const langText = langBtn.querySelector('span');
      if (langText) {
        const buttonText = this.lang === 'zh' ? 'EN' : '繁';
        langText.textContent = buttonText;
        console.log('更新按鈕文字為:', buttonText);
      }
    }
  },
  apply() {
    console.log('應用翻譯，當前語言:', this.lang);
    
    // 更新語言切換按鈕文字
    this.updateToggleButton();
    
    // 應用頁面翻譯
    this.applyPageTranslations();
    
    // 觸發語言切換事件，讓頁面中的自定義元素能自行重新渲染
    const langChangeEvent = new CustomEvent('languageChanged', { detail: { lang: this.lang } });
    document.dispatchEvent(langChangeEvent);
  },
  
  // 渲染首頁內容 - 已移至 index.html 內部
  renderHomePageContent() {
    console.log('首頁內容渲染功能已移至 index.html 內部，跳過此函數');
    // 跳過此函數，經由頁面內部腳本處理首頁內容渲染
    return;
  },
  
  // 應用頁面翻譯
  applyPageTranslations() {
    console.log('開始應用頁面翻譯...');
    
    try {
      // 加載翻譯對應表
      const mapping = this.translations();
      if (!mapping || !mapping[this.lang]) {
        console.error('找不到翻譯對應表:', this.lang);
        return;
      }
      
      // 根據 lang 變更頁面文字
      const pageMapping = mapping[this.lang];
      
      // 安全更新元素文字的輔助函數
      const updateText = (id, value) => {
        const element = document.getElementById(id);
        if (element && value) {
          if (id === 'about-desc') {
            // 特殊處理 HTML 內容
            element.innerHTML = value;
          } else if (id.startsWith('exp-location') || 
                     id.startsWith('exp-industry') || 
                     id.startsWith('exp-size') || 
                     id.startsWith('exp-team') || 
                     id.startsWith('exp-date')) {
            // 對於含有圖標的元素，只替換文字部分
            if (element.childNodes.length > 1) {
              element.childNodes[1].nodeValue = ' ' + value;
            } else {
              element.textContent = value;
            }
          } else {
            element.textContent = value;
          }
        }
      };
      
      // 導覽列標題
      const navTitle = document.querySelector('.nav-logo span');
      if (navTitle && pageMapping['nav-title']) {
        navTitle.textContent = pageMapping['nav-title'];
      }
      
      // 更新頁面上所有可翻譯元素
      for (const id in pageMapping) {
        if (pageMapping.hasOwnProperty(id)) {
          updateText(id, pageMapping[id]);
        }
      }
      
      // 更新首頁特定元素 - 使用 updateText 函數確保一致性
      console.log('pageMapping:', pageMapping);
      console.log('featured-works-title:', pageMapping['featured-works-title']);
      console.log('news-title:', pageMapping['news-title']);
      
      // 直接更新標題元素
      const featuredWorksSection = document.getElementById('featured-works');
      const newsSection = document.getElementById('news');
      const featuredWorksTitle = featuredWorksSection ? featuredWorksSection.querySelector('h2') : null;
      const newsTitle = newsSection ? newsSection.querySelector('h2') : null;
      
      if (featuredWorksTitle && pageMapping['featured-works']) {
        console.log('更新 featured-works 標題為:', pageMapping['featured-works']);
        featuredWorksTitle.textContent = pageMapping['featured-works'];
      }
      
      if (newsTitle && pageMapping['news']) {
        console.log('更新 news 標題為:', pageMapping['news']);
        newsTitle.textContent = pageMapping['news'];
      }
      
      // 更新導覽列項目文字
      const navItems = {
        '首頁': 'Home',
        '關於我': 'About',
        '經歷': 'Experience',
        '作品集': 'Portfolio',
        '技能': 'Skills',
        '遊戲間': 'Game Room',
        '聯絡我': 'Contact',
        '下載履歷': 'Resume'
      };
      
      // 更新導覽列
      const navLinks = document.querySelectorAll('nav ul li a span');
      navLinks.forEach(link => {
        const currentText = link.textContent.trim();
        if (this.lang === 'en' && navItems[currentText]) {
          link.textContent = navItems[currentText];
        } else if (this.lang === 'zh') {
          // 找到英文對應的中文
          for (const [zh, en] of Object.entries(navItems)) {
            if (en === currentText) {
              link.textContent = zh;
              break;
            }
          }
        }
      });
      
      console.log('頁面翻譯完成');
    } catch (e) {
      console.error('翻譯過程中發生錯誤:', e);
    }
  },
  
  translations() {
    return {
      zh: {
        // 作品翻譯
        'works': {
          'web1': { title: 'UOF Web apps', desc: '企業內部 e 化 專案，涉蓋多項流程管理系統' },
          'web2': { title: 'iPAS 考題模擬作答器', desc: '協助考生練習 iPAS 相關考試題目的互動式平台' },
          'web3': { title: 'YouTube 下載器', desc: '提供 YouTube 影片下載與轉檔功能的網頁應用' },
          'web4': { title: '個人資訊網站', desc: '展示個人作品、經歷與技能的響應式網站' },
          'web5': { title: 'Luxgen N7 使用手冊快速搜尋器', desc: '針對 Luxgen N7 車款使用手冊的快速搜尋工具' },
          'chrome1': { title: 'PDF 分割成圖片', desc: 'Chrome 擴充程式，可將 PDF 文件轉換為圖片格式' },
          'chrome2': { title: 'PDF Merger以及批次列印', desc: 'Chrome 擴充程式，提供 PDF 合併與批次列印功能' },
          'chrome3': { title: 'PostIt!', desc: 'Chrome 擴充程式，提供網頁便利貼功能' },
          'chrome4': { title: '文件比照器', desc: 'Chrome 擴充程式，用於比對文件差異' },
          'ios1': { title: 'Explore Note 旅途規劃', desc: '旅途規劃與記錄 iOS 應用程式（建構中）' }
        },
        
        // index.html
        'intro-title': '哈囉，我是 Jeffery',
        'intro-desc': '一位專業的網站／程式／APP開發者，熱愛 AI 技術以及創新與分享。',
        'featured-works-title': '精選作品',
        'news-title': '最新消息',
        'news': '近期動態',
        'nav-title': 'Jeffery HU',
        'lang-toggle-text': 'EN',
        // about.html
        'about-name': '胡國瑞',
        'about-name-en': '(Jeffery Hu)',
        'about-tag-1': '網站開發',
        'about-tag-2': '程式設計',
        'about-tag-3': 'APP開發',
        'about-tag-4': 'AI 愛好者',
        'edu-school-1': '大葉大學',
        'edu-degree-1': '資訊管理所碩士',
        'edu-school-2': '輔仁大學',
        'edu-degree-2': '企業管理學系學士',
        'edu-school-3': '桃園高級中學',
        'about-desc': '嗨！我是 Jeffery，熱愛新技術、專注於網站與應用程式開發，喜歡用程式改變生活。<br>擅長團隊合作，也樂於分享與持續學習。AI、創新、設計思維都是我的熱情所在，平時喜歡參與社群、挑戰新領域，並將創意實踐於專案之中。<br>歡迎有志同道合的朋友一起交流合作，讓科技帶來更多美好可能！',
        // experience.html
        'exp-work-title': '工作經歷',
        'exp-job-title-1': '資訊處主任',
        'exp-company-1': '香港商立德國際商品試驗有限公司桃園分公司',
        'exp-location-1': '桃園市龜山區',
        'exp-industry-1': '商品認證業',
        'exp-size-1': '500人以上',
        'exp-team-1': '管理4人以下',
        'exp-date-1': '2010/9~仍在職',
        'exp-desc-1-1': '負責 Web/APP 專案開發與維護',
        'exp-desc-1-2': '跨部門協作，推動自動化與 AI 應用',
        'exp-desc-1-3': '軟體專案管理與團隊領導',
        'exp-job-title-2': '系統分析師',
        'exp-company-2': '艾克爾國際股份有限公司',
        'exp-location-2': '桃園市龍潭區',
        'exp-industry-2': '半導體業',
        'exp-size-2': '500人以上',
        'exp-date-2': '2003/11~2010/3',
        'exp-desc-2-1': 'Notes AP Designer',
        'exp-desc-2-2': '系統分析與設計',
        'exp-job-title-3': '系統分析師',
        'exp-company-3': '日月欣股份有限公司',
        'exp-location-3': '桃園市中壢區',
        'exp-industry-3': '半導體業',
        'exp-size-3': '500人以上',
        'exp-date-3': '2002/6~2003/10',
        'exp-desc-3-1': 'Notes AP Designer',
        'exp-desc-3-2': '系統分析與設計',
        'exp-edu-title': '學歷／證照',
        'edu-school-1-exp': '大葉大學',
        'edu-degree-1-exp': '資訊管理所碩士 (1998/9–2000/6)',
        'edu-school-2-exp': '輔仁大學',
        'edu-degree-2-exp': '企業管理學系學士 (1993/9–1998/6)',
        'edu-school-3-exp': '桃園高級中學 (1991/9–1993/6)',
        'edu-school-4-exp': '全民英檢初級',
        'edu-degree-4-exp': '(2011)',
        'exp-milestone-title': '重要里程碑',
        'milestone-1': '2025 擔任 BV NEA GenAI 社群負責人',
        'milestone-2': '2024 以 AI 技術建置公司網站',
        'milestone-3': '2021 帶領公司完成系統轉型',
        // skills.html
        'skill-title': '技術能力',
        'skill-tag-1': 'AI工具應用',
        'skill-tag-2': '系統或工具專業課程訓練',
        'skill-tag-3': '網站建立與維護',
        'skill-tag-4': '異質化資料庫串聯與管理',
        'skill-tag-5': '自動化工具操作與應用',
        'skill-tag-6': '系統架構規劃',
        'skill-tag-7': '系統維護操作',
        'skill-tag-8': '系統整合分析',
        'skill-tag-9': '功能測試(Function Test)',
        'skill-tag-10': '軟體程式設計',
        'skill-tag-11': '結構化程式設計',
        'skill-tag-12': '資料庫系統管理維護',
        'skill-tag-13': '資料庫程式設計',
        'skill-tag-14': '資料庫軟體應用',
        'skill-tag-15': '文書處理軟體操作',
        'skill-tag-16': '流程圖軟體操作',
        'skill-tag-17': '專案管理軟體操作',
        'skill-tag-18': '電子試算表軟體操作',
        'skill-tag-19': '簡報軟體操作',
        'soft-title': '軟實力',
        'soft-tag-1': '跨部門溝通協作',
        'soft-tag-2': '團隊合作',
        'soft-tag-3': '問題解決',
        'soft-tag-4': '客戶溝通',
        'soft-tag-5': '創意思考',
        'soft-tag-6': '持續學習',
        'soft-tag-7': '熱情主動',
        // portfolio.html
        'portfolio-title': '作品集',
        // games/index.html
        'games-heading': '遊戲間',
        'games-subtitle': '放鬆心情，享受遊戲的樂趣',
        'game-snake-title': '貪吃蛇',
        'game-snake-desc': '控制蛇吃食物並成長，但不要撞到自己！',
        'game-sudoku-title': '數獨',
        'game-sudoku-desc': '填充數字，訓練你的邏輯思維能力。',
        'game-tetris-title': '俄羅斯方塊',
        'game-tetris-desc': '排列下落的方塊，消除完整的行。',
        'game-breakout-title': '打磚塊',
        'game-breakout-desc': '控制擋板反彈球，打破所有磚塊。',
        'game-memory-title': '記憶配對',
        'game-memory-desc': '翻開卡片，找出所有匹配的對子。',
        'game-2048-title': '2048',
        'game-2048-desc': '合併相同數字，嘗試達到 2048 方塊！',
        'game-snake-button': '開始遊戲',
        'game-sudoku-button': '開始遊戲',
        'game-tetris-button': '開始遊戲',
        'game-breakout-button': '開始遊戲',
        'game-memory-button': '開始遊戲',
        'game-2048-button': '開始遊戲',
        // Contact.html
        'contact-title': '聯絡我',
        'contact-name-label': '姓名',
        'contact-email-label': 'Email',
        'contact-message-label': '訊息',
        'contact-submit-btn': '送出',
        'contact-social-text': '也歡迎透過社群平台聯絡：'
      },
      en: {
        // 作品翻譯
        'works': {
          'web1': { title: 'UOF Web Apps', desc: 'Enterprise internal e-project covering multiple process management systems' },
          'web2': { title: 'iPAS Exam Simulator', desc: 'Interactive platform helping students practice iPAS certification exam questions' },
          'web3': { title: 'YouTube Downloader', desc: 'Web application for downloading and converting YouTube videos' },
          'web4': { title: 'Personal Portfolio Website', desc: 'Responsive website showcasing personal projects, experience, and skills' },
          'web5': { title: 'Luxgen N7 Manual Quick Search', desc: 'Quick search tool for Luxgen N7 vehicle user manual' },
          'chrome1': { title: 'PDF to Images Splitter', desc: 'Chrome extension for converting PDF documents to image formats' },
          'chrome2': { title: 'PDF Merger and Batch Printing', desc: 'Chrome extension for merging PDFs and batch printing' },
          'chrome3': { title: 'PostIt!', desc: 'Chrome extension providing sticky notes functionality for web pages' },
          'chrome4': { title: 'Document Comparator', desc: 'Chrome extension for comparing document differences' },
          'ios1': { title: 'Explore Note Travel Planner', desc: 'iOS app for travel planning and journaling (under development)' }
        },
        
        // 新聞翻譯
        'news': {
          '2025-05-01': 'Personal website officially launched!',
          '2025-04-20': 'Added multilingual toggle feature'
        },
       'nav-title': 'Jeffery HU',
        'intro-title': 'Hello, I\'m Jeffery',
        'intro-desc': 'A professional web/software/app developer, passionate about AI technology, innovation and sharing.',
        'featured-works-title': 'Featured Works',
        'news-title': 'Latest News',
        'featured-works': 'Featured Projects',
        'news': 'Latest News',
        'nav-title': 'Jeffery HU',
        'lang-toggle-text': '繁',
        // about.html
        'about-name': 'Jeffery Hu',
        'about-name-en': '',
        'about-tag-1': 'Web Development',
        'about-tag-2': 'Programming',
        'about-tag-3': 'APP Development',
        'about-tag-4': 'AI Enthusiast',
        'edu-school-1': 'Da-Yeh University',
        'edu-degree-1': 'M.S. in Information Management',
        'edu-school-2': 'Fu Jen Catholic University',
        'edu-degree-2': 'B.B.A. in Business Administration',
        'edu-school-3': 'Taoyuan Senior High School',
        'about-desc': 'Hi! I am Jeffery, passionate about new technologies, focusing on web and app development, and love using code to change life.<br>I am good at teamwork, enjoy sharing and continuous learning. AI, innovation, and design thinking are my passions. I like to participate in communities, challenge new fields, and bring creativity into projects.<br>Welcome to connect and collaborate—let’s make more possibilities with technology!',
        // experience.html
        'exp-work-title': 'Work Experience',
        'exp-job-title-1': 'Supervisor of MIS Division',
        'exp-company-1': 'Bureau Veritas Taoyuan Branch',
        'exp-location-1': 'Guishan Dist., Taoyuan City',
        'exp-industry-1': 'Product Certification',
        'exp-size-1': '500+ employees',
        'exp-team-1': 'Team of 4 or less',
        'exp-date-1': 'Sep 2010 – Present',
        'exp-desc-1-1': 'Responsible for Web/APP project development and maintenance',
        'exp-desc-1-2': 'Cross-department collaboration, promoting automation and AI applications',
        'exp-desc-1-3': 'Software project management and team leadership',
        'exp-job-title-2': 'System Analyst',
        'exp-company-2': 'Amkor Technology, Inc',
        'exp-location-2': 'Longtan Dist., Taoyuan City',
        'exp-industry-2': 'Semiconductor',
        'exp-size-2': '500+ employees',
        'exp-date-2': 'Nov 2003 – Mar 2010',
        'exp-desc-2-1': 'Notes AP Designer',
        'exp-desc-2-2': 'System analysis and design',
        'exp-job-title-3': 'System Analyst',
        'exp-company-3': 'ADVANCED SEMICONDUCTOR ENGINEERING INC. CHUNG-LI BRANCH',
        'exp-location-3': 'Zhongli Dist., Taoyuan City',
        'exp-industry-3': 'Semiconductor',
        'exp-size-3': '500+ employees',
        'exp-date-3': 'Jun 2002 – Oct 2003',
        'exp-desc-3-1': 'Notes AP Designer',
        'exp-desc-3-2': 'System analysis and design',
        'exp-edu-title': 'Education / Certificates',
        'edu-school-1-exp': 'Da-Yeh University',
        'edu-degree-1-exp': 'M.S. in Information Management (1998/9–2000/6)',
        'edu-school-2-exp': 'Fu Jen Catholic University',
        'edu-degree-2-exp': 'B.B.A. in Business Administration (1993/9–1998/6)',
        'edu-school-3-exp': 'Taoyuan Senior High School (1991/9–1993/6)',
        'edu-school-4-exp': 'GEPT Elementary',
        'edu-degree-4-exp': '(2011)',
        'exp-milestone-title': 'Milestones',
        'milestone-1': '2025 Became a leader of BV NEA GenAI Community',
        'milestone-2': '2024 Developed company website using AI technology',
        'milestone-3': '2021 Led successful system transformation at company',
        // skills.html
        'skill-title': 'Technical Skills',
        'skill-tag-1': 'AI Tools Application',
        'skill-tag-2': 'Professional System/Tool Training',
        'skill-tag-3': 'Website Building & Maintenance',
        'skill-tag-4': 'Heterogeneous Database Integration',
        'skill-tag-5': 'Automation Tools Operation',
        'skill-tag-6': 'System Architecture Planning',
        'skill-tag-7': 'System Maintenance',
        'skill-tag-8': 'System Integration Analysis',
        'skill-tag-9': 'Function Test',
        'skill-tag-10': 'Software Programming',
        'skill-tag-11': 'Structured Programming',
        'skill-tag-12': 'Database System Management',
        'skill-tag-13': 'Database Programming',
        'skill-tag-14': 'Database Application',
        'skill-tag-15': 'Word Processing Software',
        'skill-tag-16': 'Flowchart Software',
        'skill-tag-17': 'Project Management Software',
        'skill-tag-18': 'Spreadsheet Software',
        'skill-tag-19': 'Presentation Software',
        'soft-title': 'Soft Skills',
        'soft-tag-1': 'Cross-Department Communication',
        'soft-tag-2': 'Teamwork',
        'soft-tag-3': 'Problem Solving',
        'soft-tag-4': 'Client Communication',
        'soft-tag-5': 'Creative Thinking',
        'soft-tag-6': 'Continuous Learning',
        'soft-tag-7': 'Passionate Initiative',
        'skill-desc': 'I am a professional website/programmer/APP developer passionate about new technologies and AI.',
        // portfolio.html
        'portfolio-title': 'Portfolio',
        // games/index.html
        'games-heading': 'Game Room',
        'games-subtitle': 'Relax and enjoy the fun of games',
        'game-snake-title': 'Snake Game',
        'game-snake-desc': 'Control the snake to eat food and grow, but don\'t hit yourself!',
        'game-sudoku-title': 'Sudoku',
        'game-sudoku-desc': 'Fill in numbers to train your logical thinking ability.',
        'game-tetris-title': 'Tetris',
        'game-tetris-desc': 'Arrange falling blocks to eliminate complete rows.',
        'game-breakout-title': 'Breakout',
        'game-breakout-desc': 'Control the paddle to bounce the ball and break all the bricks.',
        'game-memory-title': 'Memory Match',
        'game-memory-desc': 'Flip cards to find all matching pairs.',
        'game-2048-title': '2048',
        'game-2048-desc': 'Merge identical numbers to reach the 2048 tile!',
        'game-snake-button': 'Play Now',
        'game-sudoku-button': 'Play Now',
        'game-tetris-button': 'Play Now',
        'game-breakout-button': 'Play Now',
        'game-memory-button': 'Play Now',
        'game-2048-button': 'Play Now',
        // Contact.html
        'contact-title': 'Contact Me',
        'contact-name-label': 'Name',
        'contact-email-label': 'Email',
        'contact-message-label': 'Message',
        'contact-submit-btn': 'Submit',
        'contact-social-text': 'Also welcome to contact me through social platforms:'
      }
    };

    const langMap = mapping[this.lang];
    for (const id in langMap) {
      const el = document.getElementById(id);
      if (el) {
        // 有 FontAwesome 圖示的欄位，只替換圖示後的文字
        if (
          id.startsWith('exp-location') ||
          id.startsWith('exp-industry') ||
          id.startsWith('exp-size') ||
          id.startsWith('exp-team') ||
          id.startsWith('exp-date')
        ) {
          // 只替換圖示後的文字（childNodes[1] 是文字節點）
          if (el.childNodes.length > 1) {
            el.childNodes[1].nodeValue = ' ' + langMap[id];
          }
        } else if (id === 'about-desc') {
          el.innerHTML = langMap[id];
        } else {
          el.textContent = langMap[id];
        }
      }
    }
    // 導覽列標題
    const navTitle = document.querySelector('.nav-logo span');
    if (navTitle && langMap['nav-title']) navTitle.textContent = langMap['nav-title'];
    
    // 如果在首頁，重新渲染作品列表
    if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/')) {
      if (typeof window.renderWorks === 'function') {
        console.log('切換語言後重新渲染作品列表...');
        window.renderWorks();
      }
    }
  }
};
// 頁面載入完成後自動初始化語言系統
document.addEventListener('DOMContentLoaded', () => {
  console.log('頁面載入完成，初始化語言系統');
  window.i18n.init();
});
