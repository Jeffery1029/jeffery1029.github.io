// 簡易後台登入驗證與主控台權限
const ADMIN_PW = 'demo1234'; // 可自訂
const ADMIN_KEY = 'resume_admin_login';

function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === 'yes';
}

if (location.pathname.endsWith('admin.html')) {
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const pw = document.getElementById('admin-pw').value;
    if (pw === ADMIN_PW) {
      localStorage.setItem(ADMIN_KEY, 'yes');
      location.href = 'admin_dashboard.html';
    } else {
      document.getElementById('login-msg').textContent = '密碼錯誤，請重試';
    }
  });
}

if (location.pathname.endsWith('admin_dashboard.html')) {
  if (!isAdmin()) {
    location.href = 'admin.html';
  }
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem(ADMIN_KEY);
      location.href = 'admin.html';
    });
  }
}
