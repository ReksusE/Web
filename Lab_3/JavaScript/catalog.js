// Используем IP вместо localhost и новый порт 3001
const API_URL = "http://127.0.0.1:3000"; 
let currentPage = 1;
const limit = 6;

async function loadCatalog() {
    console.log("Попытка загрузки данных...");

    // Создаем параметры
    const params = new URLSearchParams({
        _page: currentPage,
        _limit: limit
    });

    try {
        // Делаем максимально простой запрос для теста
        const response = await fetch(`${API_URL}/courses?${params}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();
        console.log("Данные успешно получены:", result);

        // Обработка разных версий JSON Server (v0 vs v1)
        const coursesArray = Array.isArray(result) ? result : result.data;

        renderCards(coursesArray);
    } catch (err) {
        console.error("Ошибка в fetch:", err);
        const grid = document.getElementById('catalog-container');
        if (grid) {
            grid.innerHTML = `
                <div class="empty-state" style="color: red;">
                    Ошибка: Не удалось подключиться к серверу.<br>
                    1. Убедись, что в терминале запущен порт 3001<br>
                    2. Попробуй открыть в браузере: <a href="${API_URL}/courses" target="_blank">${API_URL}/courses</a>
                </div>`;
        }
    }
}

function renderCards(data) {
    const grid = document.getElementById('catalog-container');
    if (!grid) return;
    grid.innerHTML = '';

    if (!data || data.length === 0) {
        grid.innerHTML = `<div class="empty-state">Массив данных пуст или отфильтрован 😕</div>`;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'course--card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="course--card--content">
                <span class="category--badge">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="course--card--meta">
                    <span class="price">$${item.price}</span>
                    <span class="rating">★ ${item.rating}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', loadCatalog);