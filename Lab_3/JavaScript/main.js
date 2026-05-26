const API = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    const feedbackLink = document.getElementById('feedback-link');
    const adminLink = document.getElementById('admin-link');
    const authLink = document.getElementById('auth-link');
    const userRole = localStorage.getItem('userRole');
    const currentUserId = localStorage.getItem('currentUserId');

    if (userRole === 'admin') {
        adminLink.style.display = 'inline-flex';
        feedbackLink.style.display = 'none';
    }

    if (currentUserId) {
        authLink.textContent = 'Выход';
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'authorization.html';
        });
    }
});

class Preloader {
    selectors = {
        root: '[data-js-preloader]',
    }

    stateClasses = {
        isHidden: 'is-hidden',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)

        if (!this.rootElement) return

        this.bindEvents()
    }

    hide = () => {
        this.rootElement.classList.add(this.stateClasses.isHidden)
        
        this.rootElement.addEventListener('transitionend', () => {
            this.rootElement.remove()
        }, { once: true })
    }

    bindEvents() {
        window.addEventListener('load', this.hide)
    }
}

class Toast {
    selectors = {
        container: '[data-js-toast-container]',
    }

    constructor() {
        this.containerElement = document.querySelector(this.selectors.container);
        
        window.showToast = this.show;
    }

    
    show = (message, type = 'success') => {
        if (!this.containerElement) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast__message">${message}</span>
        `;

        this.containerElement.appendChild(toast);

        setTimeout(() => {
            this.hide(toast);
        }, 3500 );

        toast.addEventListener('click', () => this.hide(toast));
    }

    hide(toast) {
        toast.classList.add('is-hidden');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        setTimeout(() => toast.remove(), 400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const swiperContainer = document.querySelector('.mySwiper');
    
    if (swiperContainer) {
        // Убедимся, что библиотека Swiper загружена
        if (typeof Swiper !== 'undefined') {
            new Swiper('.mySwiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true, // Пауза при наведении
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                },
                effect: 'slide', 
                speed: 800,
            });
        } else {
            console.warn('Swiper library is not loaded');
        }
    }
});

ymaps.ready(initMap);

function initMap() {
    var myMap = new ymaps.Map("yandex-map", {
        center: [53.9045, 27.5615], // Координаты Минска (или вашего офиса)
        zoom: 15
    });

    var myPlacemark = new ymaps.Placemark([53.9045, 27.5615], {
        hintContent: 'Coursely Office',
        balloonContent: 'Главный офис Coursely'
    });

    myMap.geoObjects.add(myPlacemark);
}


class MediaGallery {
    constructor() {
        this.container = document.getElementById('media-gallery');
        if (!this.container) return;
 
        this.images = [
            { url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800', label: 'Подкаст студия' },
            { url: 'https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?w=800', label: 'Видеомонтаж' },
            { url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', label: 'Звукозапись' },
            { url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800', label: 'Дизайн' },
            { url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800', label: 'Маркетинг' },
            { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', label: 'Команда' },
            { url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800', label: 'Творчество' },
            { url: 'https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=800', label: 'Технологии' },
            { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', label: 'Рабочее место' },
            { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', label: 'Онлайн-обучение' },
            { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', label: 'Студент' },
        ];
 
        this.videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
        this.videoThumbnail = 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800';
 
        // Web Audio API — звуки при смене изображений
        this.audioCtx = null;
        this.soundFreqs = [261, 294, 329, 349, 392, 440, 493, 523, 587, 659, 698];
        this.soundTypes = ['sine', 'square', 'triangle', 'sawtooth', 'sine', 'square', 'triangle', 'sine', 'sawtooth', 'triangle', 'square'];
 
        this.currentIndex = 0;
        this.isVideoMode = false;      // показан ли <video> прямо сейчас
        this.videoIsPlaying = false;   // состояние воспроизведения видео
        this.volume = 0.5;             // единая громкость (и для видео, и для Web Audio)
 
        this.render();
        this.bindEvents();
    }
 
    // ── Web Audio ────────────────────────────────────────────
    getAudioCtx() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioCtx;
    }
 
    playSound(index) {
        try {
            const ctx = this.getAudioCtx();
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = this.soundTypes[index % this.soundTypes.length];
            osc.frequency.setValueAtTime(this.soundFreqs[index % this.soundFreqs.length], ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
                this.soundFreqs[index % this.soundFreqs.length] * 1.5,
                ctx.currentTime + 0.3
            );
            gain.gain.setValueAtTime(this.volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
            console.warn('Audio not available:', e);
        }
    }
 
    // ── Состояние плеера ─────────────────────────────────────
    updatePlayerState() {
        const playPauseBtn = this.container.querySelector('.gallery__btn--playpause');
        if (!playPauseBtn) return;
 
        if (this.isVideoMode) {
            playPauseBtn.textContent = this.videoIsPlaying ? '⏸ Стоп' : '▶ Играть';
            playPauseBtn.disabled = false;
        } else {
            playPauseBtn.textContent = '▶ Играть';
            playPauseBtn.disabled = true;
        }
    }
 
    // ── Переключение между изображениями / видео ─────────────
    showImage(index) {
        const img     = this.container.querySelector('.gallery__main-img');
        const video   = this.container.querySelector('.gallery__main-video');
        const label   = this.container.querySelector('.gallery__label');
        const counter = this.container.querySelector('.gallery__counter');
        if (!img) return;
 
        // Плавный переход — сначала скрываем
        img.style.opacity   = '0';
        video.style.opacity = '0';
 
        setTimeout(() => {
            if (index === -1) {
                // ── Режим видео ──
                this.isVideoMode     = true;
                this.videoIsPlaying  = false;
                img.style.display    = 'none';
                video.style.display  = 'block';
                video.volume         = this.volume;
                // Сбрасываем к началу, но не запускаем автоматически —
                // пользователь сам нажмёт кнопку «Играть»
                video.src            = this.videoUrl;
                video.pause();
                video.style.opacity  = '1';
                if (label)   label.textContent   = '🎬 Видео';
                if (counter) counter.textContent  = '🎬 / ' + this.images.length;
            } else {
                // ── Режим изображения ──
                this.isVideoMode    = false;
                this.videoIsPlaying = false;
                video.pause();
                video.style.display = 'none';
                img.style.display   = 'block';
                img.src             = this.images[index].url;
                img.alt             = this.images[index].label;
                img.style.opacity   = '1';
                if (label)   label.textContent   = this.images[index].label;
                if (counter) counter.textContent  = `${index + 1} / ${this.images.length}`;
                // Уникальный звук при смене изображения
                this.playSound(index);
            }
            this.currentIndex = index;
            this.updatePlayerState();
        }, 200);
    }
 
    showRandom() {
        // Исключаем текущий индекс, чтобы картинка всегда менялась
        let rand;
        do { rand = Math.floor(Math.random() * this.images.length); }
        while (rand === this.currentIndex && this.images.length > 1);
        this.showImage(rand);
        // Обновляем активную миниатюру
        this.container.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
        const thumbs = this.container.querySelectorAll('.gallery__thumb[data-index]');
        if (thumbs[rand]) thumbs[rand].classList.add('active');
    }
 
    // ── Play / Pause видео ───────────────────────────────────
    toggleVideoPlayback() {
        const video = this.container.querySelector('.gallery__main-video');
        if (!video || !this.isVideoMode) return;
 
        if (this.videoIsPlaying) {
            video.pause();
            this.videoIsPlaying = false;
        } else {
            video.play();
            this.videoIsPlaying = true;
        }
        this.updatePlayerState();
    }
 
    
    setVolume(val) {
        this.volume = parseFloat(val);
        const video = this.container.querySelector('.gallery__main-video');
        if (video) video.volume = this.volume;
 
        // Обновляем иконку кнопки (немой / тихо / громко)
        const volBtn = this.container.querySelector('.gallery__btn--mute');
        if (volBtn) {
            if (this.volume === 0)        volBtn.textContent = '🔇';
            else if (this.volume < 0.5)   volBtn.textContent = '🔉';
            else                           volBtn.textContent = '🔊';
        }
    }
 
    toggleMute() {
        const slider = this.container.querySelector('.gallery__volume-range');
        if (this.volume > 0) {
            this._prevVolume = this.volume;
            this.setVolume(0);
            if (slider) slider.value = 0;
        } else {
            const restore = this._prevVolume || 0.5;
            this.setVolume(restore);
            if (slider) slider.value = restore;
        }
    }
 
    // ── Рендер HTML галереи ──────────────────────────────────
    render() {
        this.container.innerHTML = `
            <div class="gallery__wrapper">
                <div class="gallery__stage">
                    <div class="gallery__media-container">
                        <img class="gallery__main-img" src="${this.images[0].url}" alt="${this.images[0].label}">
                        <video class="gallery__main-video" style="display:none;"></video>
                        <div class="gallery__overlay">
                            <span class="gallery__label">${this.images[0].label}</span>
                            <span class="gallery__counter">1 / ${this.images.length}</span>
                        </div>
                    </div>
 
                    <div class="gallery__controls">
                        <!-- Случайное изображение -->
                        <button class="gallery__btn gallery__btn--random" title="Случайное изображение">
                            🎲 Случайное
                        </button>
 
                        <!-- Открыть видео -->
                        <button class="gallery__btn gallery__btn--video" title="Открыть видео">
                            🎬 Видео
                        </button>
 
                        <!-- Play / Pause видео (неактивна вне режима видео) -->
                        <button class="gallery__btn gallery__btn--playpause" title="Воспроизвести / остановить видео" disabled>
                            ▶ Играть
                        </button>
 
                        <!-- Кнопка mute + слайдер громкости -->
                        <div class="gallery__volume">
                            <button class="gallery__btn gallery__btn--mute" title="Вкл/выкл звук">🔊</button>
                            <input type="range" class="gallery__volume-range" min="0" max="1" step="0.05" value="${this.volume}">
                            <span class="gallery__volume-label">${Math.round(this.volume * 100)}%</span>
                        </div>
                    </div>
                </div>
 
                <!-- Миниатюры -->
                <div class="gallery__thumbnails">
                    ${this.images.map((img, i) => `
                        <div class="gallery__thumb ${i === 0 ? 'active' : ''}" data-index="${i}" title="${img.label}">
                            <img src="${img.url}" alt="${img.label}">
                        </div>
                    `).join('')}
                    <div class="gallery__thumb gallery__thumb--video" data-index="-1" title="Видео">
                        <img src="${this.videoThumbnail}" alt="Видео">
                        <span class="gallery__thumb-video-icon">▶</span>
                    </div>
                </div>
            </div>
        `;
    }
 
    // ── Привязка событий ─────────────────────────────────────
    bindEvents() {
        // Случайное изображение
        this.container.querySelector('.gallery__btn--random')
            .addEventListener('click', () => this.showRandom());
 
        // Открыть видео
        this.container.querySelector('.gallery__btn--video')
            .addEventListener('click', () => {
                this.container.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
                this.container.querySelector('.gallery__thumb--video').classList.add('active');
                this.showImage(-1);
            });
 
        // Play / Pause
        this.container.querySelector('.gallery__btn--playpause')
            .addEventListener('click', () => this.toggleVideoPlayback());
 
        // Mute
        this.container.querySelector('.gallery__btn--mute')
            .addEventListener('click', () => this.toggleMute());
 
        // Слайдер громкости
        const slider = this.container.querySelector('.gallery__volume-range');
        slider.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
            const lbl = this.container.querySelector('.gallery__volume-label');
            if (lbl) lbl.textContent = Math.round(e.target.value * 100) + '%';
        });
 
        // Миниатюры
        this.container.querySelectorAll('.gallery__thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.container.querySelectorAll('.gallery__thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                this.showImage(parseInt(thumb.dataset.index));
            });
        });
 
        // Синхронизация состояния плеера с нативными событиями <video>
        const video = this.container.querySelector('.gallery__main-video');
        video.addEventListener('play',  () => { this.videoIsPlaying = true;  this.updatePlayerState(); });
        video.addEventListener('pause', () => { this.videoIsPlaying = false; this.updatePlayerState(); });
        video.addEventListener('ended', () => { this.videoIsPlaying = false; this.updatePlayerState(); });
    }
}

class ScrollReveal {
    constructor() {
        // Элементы, которые появляются при скролле
        this.selectors = [
            '.features--card',
            '.stats--card',
            '.review--card',
            '.include--card',
            '.curriculum--list li',
            '.pricing--card',
            '.teacher--card',
            '.editing--card',
            '.questions--item',
        ];
        this.init();
        this.bindScroll();
    }

    init() {
        this.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('scroll-hidden');
                el.style.transitionDelay = `${(i % 4) * 0.1}s`;
            });
        });
        // Проверим сразу видимые
        this.check();
    }

    isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
    }

    check() {
        this.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (this.isInViewport(el)) {
                    el.classList.add('scroll-visible');
                }
            });
        });
    }

    bindScroll() {
        window.addEventListener('scroll', () => this.check(), { passive: true });
    }
}

class Parallax {
    constructor() {
        this.section = document.querySelector('.parallax-section');
        if (!this.section) return;

        this.layers = {
            bg: this.section.querySelector('.parallax-layer--bg'),
            mid: this.section.querySelector('.parallax-layer--mid'),
            fg: this.section.querySelector('.parallax-layer--fg'),
            reverse: this.section.querySelector('.parallax-layer--reverse'),
        };

        this.bindScroll();
    }

    bindScroll() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
    }

    update() {
        const rect = this.section.getBoundingClientRect();
        const viewH = window.innerHeight;

        // Считаем прогресс секции в экране (от 1 = верх экрана до -1 = низ экрана)
        const progress = (viewH / 2 - rect.top - rect.height / 2) / viewH;

        if (this.layers.bg) this.layers.bg.style.transform = `translateY(${progress * 40}px)`;
        if (this.layers.mid) this.layers.mid.style.transform = `translateY(${progress * 80}px)`;
        if (this.layers.fg) this.layers.fg.style.transform = `translateY(${progress * 140}px)`;
        // Обратное направление для усиления глубины
        if (this.layers.reverse) this.layers.reverse.style.transform = `translateY(${progress * -60}px)`;
    }
}

class AnimatedCounters {
    constructor() {
        this.API = 'http://localhost:3000';
        this.cartBadge = null;
        this.favBadge = null;

        this.injectBadges();
        this.updateAll();

        // Обновляем при загрузке и по таймеру
        setInterval(() => this.updateAll(), 5000);
    }

    injectBadges() {
        const cartLink = document.querySelector('a[href="cart.html"]');
        const favLink = document.querySelector('a[href="favorites.html"]');

        if (cartLink) {
            cartLink.style.position = 'relative';
            this.cartBadge = document.createElement('span');
            this.cartBadge.className = 'nav-badge';
            this.cartBadge.style.display = 'none';
            cartLink.appendChild(this.cartBadge);
        }

        if (favLink) {
            favLink.style.position = 'relative';
            this.favBadge = document.createElement('span');
            this.favBadge.className = 'nav-badge nav-badge--fav';
            this.favBadge.style.display = 'none';
            favLink.appendChild(this.favBadge);
        }
    }

    animateCount(badge, from, to) {
        if (to === 0) {
            badge.style.display = 'none';
            return;
        }
        badge.style.display = 'flex';

        const duration = 600;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            badge.textContent = Math.round(from + (to - from) * eased);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    async updateAll() {
        try {
            const [cartRes, favRes] = await Promise.all([
                fetch(`${this.API}/cart`).catch(() => null),
                fetch(`${this.API}/favorites`).catch(() => null),
            ]);

            if (cartRes && cartRes.ok && this.cartBadge) {
                const data = await cartRes.json();
                const items = data.data || data;
                const prevCount = parseInt(this.cartBadge.textContent) || 0;
                this.animateCount(this.cartBadge, prevCount, items.length);
            }

            if (favRes && favRes.ok && this.favBadge) {
                const data = await favRes.json();
                const items = data.data || data;
                const prevCount = parseInt(this.favBadge.textContent) || 0;
                this.animateCount(this.favBadge, prevCount, items.length);
            }
        } catch (e) {
            // Сервер недоступен — не показываем бейджи
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Preloader()
    new Toast()
    new ScrollReveal();
    new Parallax();
    new AnimatedCounters();

    if (document.getElementById('media-gallery')) {
        new MediaGallery();
    }
})

// === ИНИЦИАЛИЗАЦИЯ ХЕДЕРА ===
document.addEventListener('DOMContentLoaded', () => {
    initHeaderControls();
});

function initHeaderControls() {
  // 1. Обновление UI авторизации
    updateAuthUI();
  
  // 2. Обработчик выхода
    const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            if (window.showToast) showToast('Вы вышли из аккаунта', 'success');
            setTimeout(() => window.location.href = 'authorization.html', 1000);
        });
    } 
  
  // 3. Переключатель языка (если translate.js уже подключен — дублирование не страшно)
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      localStorage.setItem('coursely_lang', lang);
      if (typeof getTranslate === 'function') getTranslate(lang);
      document.querySelectorAll('.lang-switcher button').forEach(b => 
        b.classList.toggle('active', b === btn)
      );
    });
  });
  
  
  // 5. Кнопка профиля
  const profileBtn = document.getElementById('user-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      const modal = document.getElementById('user-profile-modal');
      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
      }
    });
  }
}

// Обновление UI в зависимости от авторизации
function updateAuthUI() {
  const userId = localStorage.getItem('currentUserId');
  const userName = localStorage.getItem('userName');
  const nickname = localStorage.getItem('userNickname');
  
  const authLink = document.getElementById('auth-link');
  const logoutLink = document.getElementById('logout-link');
  const profileBtn = document.getElementById('user-profile-btn');
  const avatar = document.getElementById('user-avatar');
  
  if (userId) {
    // Пользователь вошёл
    if (authLink) authLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline-flex';
    if (profileBtn) {
      profileBtn.style.display = 'flex';
      const initial = (userName || nickname || 'U')[0].toUpperCase();
      if (avatar) avatar.textContent = initial;
    }
  } else {
    // Пользователь не вошёл
    if (authLink) authLink.style.display = 'inline-flex';
    if (logoutLink) logoutLink.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'none';
  }
}