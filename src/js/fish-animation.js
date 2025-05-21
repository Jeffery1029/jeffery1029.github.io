// 小魚動畫
class Fish {
  constructor(color = '') {
    this.element = document.createElement('div');
    this.element.className = `swimming-fish ${color}`;
    
    // 創建魚的身體
    const fishBody = document.createElement('div');
    fishBody.className = 'fish-body';
    
    // 創建魚尾
    const fishTail = document.createElement('div');
    fishTail.className = 'fish-tail';
    
    // 創建上鰭
    const fishFin = document.createElement('div');
    fishFin.className = 'fish-fin';
    
    // 創建下鰭
    const fishBottomFin = document.createElement('div');
    fishBottomFin.className = 'fish-bottom-fin';
    
    // 創建胸鰭
    const fishPectoralFin = document.createElement('div');
    fishPectoralFin.className = 'fish-pectoral-fin';
    
    // 創建魚眼
    const fishEye = document.createElement('div');
    fishEye.className = 'fish-eye';
    
    // 組合魚的各部分
    this.element.appendChild(fishBody);
    this.element.appendChild(fishTail);
    this.element.appendChild(fishFin);
    this.element.appendChild(fishBottomFin);
    this.element.appendChild(fishPectoralFin);
    fishBody.appendChild(fishEye);
    
    // 初始位置
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    
    // 初始速度和方向
    this.speed = 0.8 + Math.random() * 1.2; // 降低速度在 0.8-2 之間
    this.angle = Math.random() * 2 * Math.PI; // 隨機方向 (0-2π)
    
    // 氣泡相關參數
    this.bubbleTime = 0;
    this.bubbleInterval = 2000 + Math.random() * 3000; // 2-5秒間隔
    
    // 更新位置
    this.updatePosition();
    
    // 添加到頁面
    document.body.appendChild(this.element);
  }
  
  updatePosition() {
    // 計算新位置
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    // 記錄碰撞前的方向
    let directionChanged = false;
    let oldAngle = this.angle;
    
    // 檢查是否碰到邊界
    if (this.x < 0 || this.x > window.innerWidth - 80) {
      // 水平邊界碰撞，產生隨機反彈角度
      this.angle = Math.PI - this.angle + (Math.random() * 0.5 - 0.25);
      // 確保魚不會卡在邊界
      this.x = Math.max(0, Math.min(this.x, window.innerWidth - 80));
      directionChanged = true;
      
      // 添加轉向動畫
      this.addTurningAnimation();
    }
    
    if (this.y < 0 || this.y > window.innerHeight - 50) {
      // 垂直邊界碰撞，產生隨機反彈角度
      this.angle = -this.angle + (Math.random() * 0.5 - 0.25);
      // 確保魚不會卡在邊界
      this.y = Math.max(0, Math.min(this.y, window.innerHeight - 50));
      directionChanged = true;
      
      // 添加轉向動畫
      this.addTurningAnimation();
    }
    
    // 更新 CSS 位置
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    
    // 根據移動方向旋轉魚，確保魚頭朝向移動方向
    let degrees = (this.angle * 180 / Math.PI);
    
    // 調整角度使魚頭朝向移動方向
    if (Math.cos(this.angle) < 0) {
      // 向左移動時，魚應該朝左
      this.element.style.transform = `rotate(${degrees}deg) scaleX(-1)`;
    } else {
      // 向右移動時，魚應該朝右
      this.element.style.transform = `rotate(${degrees}deg)`;
    }
    
    // 每間隔一段時間產生氣泡
    this.bubbleTime += 16; // 假設每幀約16ms
    if (this.bubbleTime >= this.bubbleInterval) {
      this.createBubble();
      this.bubbleTime = 0;
      // 隨機調整下一次氣泡的間隔
      this.bubbleInterval = 2000 + Math.random() * 3000;
    }
  }
  
  createBubble() {
    // 創建多個氣泡
    const bubbleCount = 1 + Math.floor(Math.random() * 3); // 每次創建 1-3 個氣泡
    
    for (let i = 0; i < bubbleCount; i++) {
      setTimeout(() => {
        // 創建氣泡元素
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 設定氣泡大小
        const size = 6 + Math.random() * 8; // 增大氣泡大小
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // 設定氣泡位置，從魚的嘴部向上冒出
        let bubbleX, bubbleY;
        
        if (Math.cos(this.angle) < 0) {
          // 向左移動時，氣泡從左側冒出
          bubbleX = this.x + 10 + (Math.random() * 5 - 2.5);
          bubbleY = this.y + 15 + (Math.random() * 5 - 2.5);
        } else {
          // 向右移動時，氣泡從右側冒出
          bubbleX = this.x + 70 + (Math.random() * 5 - 2.5);
          bubbleY = this.y + 15 + (Math.random() * 5 - 2.5);
        }
        
        bubble.style.left = `${bubbleX}px`;
        bubble.style.top = `${bubbleY}px`;
        
        // 設定氣泡上升動畫時間
        const duration = 3 + Math.random() * 3;
        bubble.style.animationDuration = `${duration}s`;
        
        // 添加到頁面
        document.body.appendChild(bubble);
        
        // 動畫結束後移除氣泡
        setTimeout(() => {
          if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
          }
        }, duration * 1000);
      }, i * 150); // 每個氣泡間隔 150ms 創建，造成連續冒泡效果
    }
  }
  
  animate() {
    this.updatePosition();
    requestAnimationFrame(() => this.animate());
  }
  
  // 添加轉向動畫
  addTurningAnimation() {
    // 添加轉向時的變化效果
    this.element.classList.add('turning');
    
    // 0.5秒後移除轉向效果
    setTimeout(() => {
      this.element.classList.remove('turning');
    }, 500);
  }
}

// 頁面載入完成後初始化小魚
document.addEventListener('DOMContentLoaded', function() {
  // 確保不會與現有的 DOMContentLoaded 事件衝突
  setTimeout(() => {
    // 創建金魚(黃色)
    const goldFish = new Fish();
    goldFish.x = Math.random() * (window.innerWidth - 100) + 50; // 隨機位置
    goldFish.y = Math.random() * (window.innerHeight - 100) + 50;
    goldFish.animate();
    
    // 創建藍色魚
    const blueFish = new Fish('fish-blue');
    blueFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    blueFish.y = Math.random() * (window.innerHeight - 100) + 50;
    blueFish.speed = 0.6 + Math.random() * 1.0; // 稍微調整速度
    blueFish.animate();
    
    // 創建紅色魚
    const redFish = new Fish('fish-red');
    redFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    redFish.y = Math.random() * (window.innerHeight - 100) + 50;
    redFish.speed = 1.0 + Math.random() * 1.5; // 稍微調整速度
    redFish.animate();
    
    // 創建紫色魚
    const purpleFish = new Fish('fish-purple');
    purpleFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    purpleFish.y = Math.random() * (window.innerHeight - 100) + 50;
    purpleFish.speed = 0.7 + Math.random() * 1.2; // 稍微調整速度
    purpleFish.animate();
    
    // 創建棕色魚
    const brownFish = new Fish('fish-brown');
    brownFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    brownFish.y = Math.random() * (window.innerHeight - 100) + 50;
    brownFish.speed = 0.5 + Math.random() * 0.8; // 稍微調整速度，棕色魚比較慢
    brownFish.animate();
    
    // 創建白色魚
    const whiteFish = new Fish('fish-white');
    whiteFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    whiteFish.y = Math.random() * (window.innerHeight - 100) + 50;
    whiteFish.speed = 1.2 + Math.random() * 1.5; // 稍微調整速度，白色魚比較快
    whiteFish.animate();
    
    // 創建灰色魚
    const grayFish = new Fish('fish-gray');
    grayFish.x = Math.random() * (window.innerWidth - 100) + 50; // 不同的隨機位置
    grayFish.y = Math.random() * (window.innerHeight - 100) + 50;
    grayFish.speed = 0.9 + Math.random() * 1.0; // 稍微調整速度
    grayFish.animate();
    
    // 當視窗大小改變時，確保魚不會卡在邊界外
    window.addEventListener('resize', () => {
      // 金魚
      if (goldFish.x > window.innerWidth - 80) {
        goldFish.x = window.innerWidth - 80;
      }
      if (goldFish.y > window.innerHeight - 50) {
        goldFish.y = window.innerHeight - 50;
      }
      
      // 藍魚
      if (blueFish.x > window.innerWidth - 80) {
        blueFish.x = window.innerWidth - 80;
      }
      if (blueFish.y > window.innerHeight - 50) {
        blueFish.y = window.innerHeight - 50;
      }
      
      // 紅魚
      if (redFish.x > window.innerWidth - 80) {
        redFish.x = window.innerWidth - 80;
      }
      if (redFish.y > window.innerHeight - 50) {
        redFish.y = window.innerHeight - 50;
      }
      
      // 紫魚
      if (purpleFish.x > window.innerWidth - 80) {
        purpleFish.x = window.innerWidth - 80;
      }
      if (purpleFish.y > window.innerHeight - 50) {
        purpleFish.y = window.innerHeight - 50;
      }
      
      // 棕魚
      if (brownFish.x > window.innerWidth - 80) {
        brownFish.x = window.innerWidth - 80;
      }
      if (brownFish.y > window.innerHeight - 50) {
        brownFish.y = window.innerHeight - 50;
      }
      
      // 白魚
      if (whiteFish.x > window.innerWidth - 80) {
        whiteFish.x = window.innerWidth - 80;
      }
      if (whiteFish.y > window.innerHeight - 50) {
        whiteFish.y = window.innerHeight - 50;
      }
      
      // 灰魚
      if (grayFish.x > window.innerWidth - 80) {
        grayFish.x = window.innerWidth - 80;
      }
      if (grayFish.y > window.innerHeight - 50) {
        grayFish.y = window.innerHeight - 50;
      }
    });
  }, 100);
});