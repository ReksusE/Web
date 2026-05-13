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
        
        // Опционально: полностью удаляем из DOM после завершения анимации, 
        // чтобы не нагружать дерево элементов
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

    /**
     * Основной метод создания уведомления
     * @param {string} message - Текст сообщения
     * @param {string} type - 'success' или 'error'
     */
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

// ... существующий код main.js ...

// Инициализация Swiper Slider
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли слайдер на странице
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
                // Эффект перехода (опционально, можно убрать для стандартного slide)
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

document.addEventListener('DOMContentLoaded', () => {
    new Preloader()
    new Toast()
})