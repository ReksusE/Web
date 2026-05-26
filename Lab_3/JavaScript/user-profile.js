window.API = "http://localhost:3000";

class UserProfile {
  constructor() {
    this.modal = document.getElementById('user-profile-modal');
    this.openBtn = document.getElementById('user-profile-btn');
    this.closeBtn = this.modal?.querySelector('.modal__close');
    this.form = document.getElementById('profile-form');
    this.resetBtn = document.getElementById('profile-reset-btn');
    
    if (this.openBtn) this.openBtn.addEventListener('click', () => this.open());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.modal) this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    if (this.form) this.form.addEventListener('submit', (e) => this.save(e));
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.reset());
    
    this.updateUI();
  }
  
  updateUI() {
    const userId = localStorage.getItem('currentUserId');
    const authLink = document.getElementById('auth-link');
    const profileBtn = document.getElementById('user-profile-btn');
    const logoutLink = document.getElementById('logout-link');
    
    if (userId) {
      if (authLink) authLink.style.display = 'none';
      if (logoutLink) {
        logoutLink.style.display = 'inline-flex';
        logoutLink.onclick = (e) => { e.preventDefault(); this.logout(); };
      }
      if (profileBtn) {
        profileBtn.style.display = 'flex';
        const userName = localStorage.getItem('userName') || 'U';
        profileBtn.innerHTML = `<span class="user-avatar">${userName[0].toUpperCase()}</span>`;
      }
    } else {
      if (authLink) authLink.style.display = 'inline-flex';
      if (logoutLink) logoutLink.style.display = 'none';
      if (profileBtn) profileBtn.style.display = 'none';
    }
  }
  
  async open() {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;
    try {
      const res = await fetch(`${API}/users/${userId}`);
      const user = await res.json();
      document.getElementById('profile-firstname').value = user.firstName || '';
      document.getElementById('profile-lastname').value = user.lastName || '';
      document.getElementById('profile-nickname').value = user.nickname || '';
      document.getElementById('profile-email').value = user.email || '';
      document.getElementById('profile-phone').value = user.phone || '';
      this.modal?.classList.add('show');
      this.modal.style.display = 'flex';
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
    }
  }
  
  close() {
    this.modal?.classList.remove('show');
    setTimeout(() => { if (this.modal) this.modal.style.display = 'none'; }, 300);
  }
  
  async save(e) {
    e.preventDefault();
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;
    const updatedUser = {
      firstName: document.getElementById('profile-firstname').value.trim(),
      lastName: document.getElementById('profile-lastname').value.trim(),
      nickname: document.getElementById('profile-nickname').value.trim(),
      email: document.getElementById('profile-email').value.trim(),
      phone: document.getElementById('profile-phone').value.replace(/\s/g, '')
    };
    try {
      await fetch(`${API}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      localStorage.setItem('userName', updatedUser.firstName);
      alert('Профиль обновлён!');
      this.close();
      this.updateUI();
    } catch (err) {
      alert('Не удалось сохранить изменения');
    }
  }
  
  reset() {
    if (!confirm('Сбросить настройки профиля?')) return;
    localStorage.removeItem('coursely_lang');
    localStorage.removeItem('coursely_theme');
    alert('Настройки сброшены');
    location.reload();
  }
  
  logout() {
    localStorage.clear();
    alert('Вы вышли из аккаунта');
    window.location.href = 'authorization.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UserProfile();
});