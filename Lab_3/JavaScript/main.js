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

document.addEventListener('DOMContentLoaded', () => {
    new Preloader()
    new Toast()
})