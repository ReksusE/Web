const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    const currentUserId = localStorage.getItem('currentUserId'); 
    const userRole = localStorage.getItem('userRole');
    
    const accessBlock = document.getElementById('feedback-access-block');
    const form = document.getElementById('feedback-form');
    const courseSelect = document.getElementById('course-select');
    const textarea = document.getElementById('feedback-text');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('btn-submit-feedback');

    // 1. Проверка авторизации
    if (!currentUserId) {
        accessBlock.innerHTML = `<div class="feedback__block--error">Для оставления отзыва необходимо <a href="authorization.html">войти в аккаунт</a>.</div>`;
        return;
    }

    // 2. Блокировка для администраторов
    if (userRole === 'admin') {
        accessBlock.innerHTML = `<div class="feedback__block--error">Администраторы не могут оставлять отзывы.</div>`;
        return;
    }

    // 3. Загрузка купленных курсов из истории заказов
    loadPurchasedCourses();

    // 4. Живая валидация и подсчёт символов
    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        charCount.textContent = `${len} / 1000`;
        validateForm();
    });

    courseSelect.addEventListener('change', validateForm);

    // 5. Обработка отправки
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(true)) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        submitBtn.classList.remove('btn-submit-active');

        const feedbackData = {
            userId: currentUserId,
            courseId: courseSelect.value,
            text: textarea.value.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const res = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData)
            });

            if (res.ok) {
                alert('✅ Спасибо! Ваш отзыв успешно отправлен.');
                form.reset();
                charCount.textContent = '0 / 1000';
                courseSelect.selectedIndex = 0;
                validateForm();
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            console.error(err);
            alert('❌ Не удалось отправить отзыв. Попробуйте позже.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить отзыв';
            submitBtn.classList.add('btn-submit-active');
        }
    });

    // --- Вспомогательные функции ---
    async function loadPurchasedCourses() {
        try {
            console.log("Ищем заказы для пользователя с ID:", currentUserId);
            const res = await fetch(`${API_URL}/orders?userId=${currentUserId}`);
            const orders = await res.json();
            console.log("Найдено заказов:", orders.length);

            const purchasedMap = new Map();
            // Собираем уникальные courseId из всех заказов пользователя
            orders.forEach(order => {
                if (order.items) {
                    order.items.forEach(item => {
                        if (!purchasedMap.has(item.courseId)) {
                            purchasedMap.set(item.courseId, item.title);
                        }
                    });
                }
            });

            courseSelect.innerHTML = '';
            if (purchasedMap.size === 0) {
                accessBlock.innerHTML = `<div class="feedback__block--info">Вы еще не совершили ни одной покупки. Отзывы доступны только для купленных курсов.</div>`;
                form.style.display = 'none';
                return;
            }

            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            defaultOpt.textContent = 'Выберите курс для отзыва';
            courseSelect.appendChild(defaultOpt);

            purchasedMap.forEach((title, id) => {
                const opt = document.createElement('option');
                opt.value = id;
                opt.textContent = title;
                courseSelect.appendChild(opt);
            });

            form.style.display = 'block';
            validateForm();
        } catch (err) {
            console.error('Ошибка загрузки заказов:', err);
            accessBlock.innerHTML = `<div class="feedback__block--error">Не удалось загрузить данные о покупках.</div>`;
        }
    }

    function validateForm(isSubmit = false) {
        const textLen = textarea.value.trim().length;
        const isTextValid = textLen >= 20;
        const isCourseSelected = courseSelect.value !== '';

        if (isSubmit) {
            toggleErrorState(textarea, isTextValid);
            toggleErrorState(courseSelect, isCourseSelected);
        }

        const isValid = isTextValid && isCourseSelected;
        submitBtn.disabled = !isValid;
        submitBtn.classList.toggle('btn-submit-active', isValid);
        return isValid;
    }

    function toggleErrorState(element, isValid) {
        const errorEl = element.closest('.feedback__field').querySelector('.feedback__error');
        if (!isValid) {
            element.classList.add('input--invalid');
            errorEl.classList.add('visible');
        } else {
            element.classList.remove('input--invalid');
            errorEl.classList.remove('visible');
        }
    }
});