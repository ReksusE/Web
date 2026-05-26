// === CSS-ПЕРЕМЕННЫЕ ДЛЯ ТЕМ ===
const themeVariables = {
  light: {
    '--bg-primary': '#FFFFFF',
    '--bg-secondary': '#FBFBFB',
    '--bg-tertiary': '#EDEDED',
    '--text-primary': '#0F0F0F',
    '--text-secondary': '#464646',
    '--text-muted': '#757575',
    '--accent': '#E48D8B',
    '--accent-hover': '#d17a78',
    '--border': '#F0F0F0',
    '--shadow': 'rgba(0, 0, 0, 0.05)',
    '--card-bg': '#FFFFFF',
    '--input-bg': '#fafafa',
    '--input-border': '#e0e0e0'
  },
  dark: {
    '--bg-primary': '#1a1a2e',
    '--bg-secondary': '#16213e',
    '--bg-tertiary': '#0f3460',
    '--text-primary': '#f8f9fa',
    '--text-secondary': '#e9ecef',
    '--text-muted': '#adb5bd',
    '--accent': '#e94560',
    '--accent-hover': '#ff6b6b',
    '--border': '#2a2a4a',
    '--shadow': 'rgba(0, 0, 0, 0.3)',
    '--card-bg': '#1f1f3a',
    '--input-bg': '#2a2a4a',
    '--input-border': '#3a3a5a'
  }
};

// === ПРИМЕНЕНИЕ ТЕМЫ ===
function applyTheme(themeName) {
  const variables = themeVariables[themeName];
  
  Object.entries(variables).forEach(([prop, value]) => {
    document.documentElement.style.setProperty(prop, value);
  });
  
  // Меняем изображения при смене темы (если есть data-theme-img)
  document.querySelectorAll('[data-theme-img]').forEach(img => {
    const darkSrc = img.dataset.themeImgDark;
    const lightSrc = img.dataset.themeImgLight || img.src;
    img.src = themeName === 'dark' && darkSrc ? darkSrc : lightSrc;
  });
  
  // Обновляем иконку переключателя
  const toggleBtn = document.querySelector('.theme-switcher button');
  if (toggleBtn) {
    toggleBtn.innerHTML = themeName === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', themeName === 'dark' ? 'Светлая тема' : 'Тёмная тема');
  }
}

// === ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ===
function toggleTheme() {
  const currentTheme = localStorage.getItem('coursely_theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  localStorage.setItem('coursely_theme', newTheme);
  applyTheme(newTheme);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  // Применяем сохранённую тему
  const savedTheme = localStorage.getItem('coursely_theme') || 'light';
  applyTheme(savedTheme);
  
  // Навешиваем обработчик на кнопку
  document.querySelector('.theme-switcher button')?.addEventListener('click', toggleTheme);
  
  // Слушаем системные предпочтения (опционально)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('coursely_theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
});