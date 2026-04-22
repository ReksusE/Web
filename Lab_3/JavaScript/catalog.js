const API_URL = "http://localhost:3000";
let currentPage = 1;
const limit = 6;

// 1. Загрузка данных при старте
window.onload = () => {
    loadCatalog();
    setupEventListeners();
};

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Загрузка и фильтрация (Пункты 1, 3, 4, 6, 7, 9, 10)
 */
async function loadCatalog() {
    const search = document.getElementById('searchInput')?.value;
    const category = document.getElementById('categorySelect')?.value;
    const sort = document.getElementById('sortSelect')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;

    const params = new URLSearchParams();
    
    // Пункт 9: Пагинация (адаптировано под JSON Server 1.0)
    params.append('_page', currentPage);
    params.append('_per_page', limit); 

    // Пункт 3: Поиск (используем q для глобального поиска по всем полям)
    if (search) params.append('q', search);

    // Пункт 5: Фильтрация по категории
    if (category && category !== 'All') params.append('category', category);

    // Пункт 7: Фильтрация по диапазону цен
    if (minPrice) params.append('price_gte', minPrice);
    if (maxPrice) params.append('price_lte', maxPrice);

    // Пункт 4: Сортировка
    if (sort === 'priceAsc') { params.append('_sort', 'price'); params.append('_order', 'asc'); }
    if (sort === 'priceDesc') { params.append('_sort', 'price'); params.append('_order', 'desc'); }
    if (sort === 'ratingDesc') { params.append('_sort', 'rating'); params.append('_order', 'desc'); }

    try {
        const response = await fetch(`${API_URL}/courses?${params}`);
        const result = await response.json();

        // Обработка данных (Пункт 10)
        const courses = result.data ? result.data : result;
        
        // Пункт 5: Использование Set для категорий (динамическое создание списка)
        updateCategorySelect(courses);

        // Пункт 8: Обработка пустых результатов
        renderCards(courses);
        
        document.getElementById('pageInfo').textContent = `Страница ${currentPage}`;
    } catch (err) {
        console.error("Ошибка загрузки:", err);
    }
}

/**
 * ОТОБРАЖЕНИЕ КАРТОЧЕК (Пункт 1, 8)
 */
function renderCards(data) {
    const grid = document.getElementById('catalog-container');
    if (!grid) return;

    if (!data || data.length === 0) {
        grid.innerHTML = `<div class="empty-state">Курсы не найдены по вашему запросу 😕</div>`;
        return;
    }

    grid.innerHTML = data.map(item => `
        <div class="course--card">
            <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200'">
            <div class="course--card--content">
                <span class="category--badge">${item.category}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="course--card--meta">
                    <span class="price">$${item.price}</span>
                    <span class="rating">★ ${item.rating}</span>
                </div>
                <div class="card--buttons" style="display:flex; gap:10px; margin-top:15px;">
                    <button onclick="addTo('cart', '${item.id}')" class="btn-main">В корзину</button>
                    <button onclick="addTo('favorites', '${item.id}')" class="btn-fav">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * ПУНКТ 5: Создание списка категорий через Set
 */
function updateCategorySelect(data) {
    const select = document.getElementById('categorySelect');
    if (!select || select.options.length > 5) return; // Чтобы не дублировать

    const categories = new Set(data.map(item => item.category));
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

/**
 * ПУНКТ 11 и 12: Добавление в корзину и избранное
 */
/**
 * Универсальная функция добавления с проверкой на дубликаты
 */
async function addTo(target, id) {
    console.log(`--- СТАРТ ДОБАВЛЕНИЯ: ID ${id} В ${target.toUpperCase()} ---`);
    
    try {
        console.log(`1. Делаю запрос к: ${API_URL}/${target}`);
        const checkResponse = await fetch(`${API_URL}/${target}`);
        const currentItems = await checkResponse.json();
        console.log(`2. Что сейчас лежит в ${target}:`, currentItems);
        
        const itemsArray = currentItems.data ? currentItems.data : currentItems;
        console.log(`3. Массив для проверки:`, itemsArray);

        const isDuplicate = itemsArray.some(item => String(item.id) === String(id));
        console.log(`4. Это дубликат?`, isDuplicate);

        if (isDuplicate) {
            alert(target === 'favorites' ? "Этот курс уже в избранном!" : "Этот курс уже в корзине!");
            console.log("--- СТОП: НАЙДЕН ДУБЛИКАТ ---");
            return; 
        }

        console.log(`5. Скачиваю данные курса ${id}...`);
        const courseResponse = await fetch(`${API_URL}/courses/${id}`);
        const courseData = await courseResponse.json();
        console.log(`6. Данные курса получены:`, courseData);

        console.log(`7. Отправляю POST запрос...`);
        const postResponse = await fetch(`${API_URL}/${target}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });

        if (postResponse.ok) {
            alert("Успешно добавлено!");
            console.log("--- УСПЕХ! ---");
        } else {
            console.error("Сервер ответил ошибкой:", postResponse.status);
        }

    } catch (error) {
        console.error("!!! КРИТИЧЕСКАЯ ОШИБКА !!! :", error);
    }
}

/**
 * Слушатели событий для фильтров и пагинации
 */
function setupEventListeners() {
    const inputs = document.querySelectorAll('.control--input, .control--select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            currentPage = 1;
            loadCatalog();
        });
    });

    document.getElementById('prevPage').onclick = () => {
        if (currentPage > 1) { currentPage--; loadCatalog(); }
    };
    document.getElementById('nextPage').onclick = () => {
        currentPage++; loadCatalog();
    };
}