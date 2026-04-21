const API_URL = "http://localhost:3000";
let currentPage = 1;
const limit = 6;

async function loadCatalog() {
    // Получаем значения фильтров
    const search = document.getElementById('searchInput')?.value;
    const category = document.getElementById('categorySelect')?.value;
    const sort = document.getElementById('sortSelect')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;

    // В НОВОЙ ВЕРСИИ JSON Server пагинация часто работает через _start и _end
    // Но мы попробуем стандартный набор параметров, который понимает объектный ответ
    const params = new URLSearchParams();
    
    // Пагинация
    params.append('_page', currentPage);
    params.append('_per_page', limit); // В версии 1.0 используется _per_page вместо _limit

    // Поиск и фильтры
    if (search) params.append('title_like', search); // title_like ищет часть слова
    if (category && category !== 'All') params.append('category', category);
    
    // Цены
    if (minPrice) params.append('price_gte', minPrice);
    if (maxPrice) params.append('price_lte', maxPrice);

    // Сортировка
    if (sort === 'priceAsc') { params.append('_sort', 'price'); params.append('_order', 'asc'); }
    if (sort === 'priceDesc') { params.append('_sort', 'price'); params.append('_order', 'desc'); }

    try {
        const response = await fetch(`${API_URL}/courses?${params}`);
        const result = await response.json();

        console.log("Ответ сервера:", result);

        // В версии 1.0 данные лежат в result.data
        // Если данных нет, используем пустой массив
        const coursesArray = result.data ? result.data : (Array.isArray(result) ? result : []);

        renderCards(coursesArray);
        
        // Обновляем текст страницы
        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) pageInfo.textContent = `Страница ${currentPage}`;

    } catch (err) {
        console.error("Ошибка запроса:", err);
    }
}

function renderCards(data) {
    const grid = document.getElementById('catalog-container');
    if (!grid) return;

    if (data.length === 0) {
        grid.innerHTML = `<div class="empty-state">Ничего не найдено 😕</div>`;
        return;
    }

    grid.innerHTML = data.map(item => `
        <div class="course--card">
            <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="course--card--content">
                <span class="category--badge" style="background:#f0f0f0; padding:4px 8px; border-radius:4px; font-size:12px; margin-bottom:10px; display:inline-block;">${item.category}</span>
                <h3>${item.title}</h3>
                <p style="font-size:14px; color: #666; margin-bottom: 20px;">${item.description}</p>
                <div class="course--card--meta" style="display:flex; justify-content:space-between; margin-top:auto;">
                    <span class="price" style="color: #017CFF; font-weight: bold; font-size: 18px;">$${item.price}</span>
                    <span class="rating" style="color: #FFB800;">★ ${item.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Слушатели для живого поиска
document.querySelectorAll('.control--input, .control--select').forEach(el => {
    el.addEventListener('input', () => {
        currentPage = 1;
        loadCatalog();
    });
});

// Кнопки пагинации
document.getElementById('prevPage').onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadCatalog();
    }
};

document.getElementById('nextPage').onclick = () => {
    currentPage++;
    loadCatalog();
};

window.onload = loadCatalog;