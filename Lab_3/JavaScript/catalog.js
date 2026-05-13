const API_URL = "http://localhost:3000";
let currentPage = 1;
const limit = 6;

document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
    setupEventListeners();
});

async function loadCatalog() {
    const search = document.getElementById('searchInput')?.value;
    const category = document.getElementById('categorySelect')?.value;
    const sort = document.getElementById('sortSelect')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;

    const params = new URLSearchParams();
    
    params.append('_page', currentPage);
    params.append('_per_page', limit); 

    if (search) params.append('q', search);

    if (category && category !== 'All') params.append('category', category);

    if (minPrice) params.append('price_gte', minPrice);
    if (maxPrice) params.append('price_lte', maxPrice);

    if (sort === 'priceAsc') { 
        params.append('_sort', 'price'); 
    } else if (sort === 'priceDesc') { 
        params.append('_sort', '-price'); 
    } else if (sort === 'ratingDesc') { 
        params.append('_sort', '-rating'); 
    }

    try {
        const response = await fetch(`${API_URL}/courses?${params}`);
        const result = await response.json();

        const courses = result.data ? result.data : result;
        
        updateCategorySelect(courses);

        renderCards(courses);
        
        document.getElementById('pageInfo').textContent = `Страница ${currentPage}`;
    } catch (err) {
        console.error("Ошибка загрузки:", err);
    }
}


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
                    <button onclick="addTo('cart', '${item.id}', event)" class="btn-main" type="button">В корзину</button>
                    <button onclick="addTo('favorites', '${item.id}', event)" class="btn-fav" type="button">❤️</button>
                </div>
            </div>
        </div>
    `).join('');
}


function updateCategorySelect(data) {
    const select = document.getElementById('categorySelect');
    if (!select || select.options.length > 5) return; 

    const categories = new Set(data.map(item => item.category));
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

async function addTo(target, id, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    console.log(`--- Попытка добавить в ${target} (ID: ${id}) ---`);

    try {
        // 2. Получаем данные о курсе из основной базы
        const response = await fetch(`${API_URL}/courses/${id}`);
        if (!response.ok) throw new Error("Курс не найден в базе данных");
        const courseData = await response.json();

        // 3. Проверяем, нет ли уже этого товара в целевой коллекции (cart или favorites)
        const checkRes = await fetch(`${API_URL}/${target}`);
        const currentItems = await checkRes.json();
        
        // JSON-server может возвращать массив или объект с полем data
        const itemsArray = Array.isArray(currentItems) ? currentItems : (currentItems.data || []);

        const isDuplicate = itemsArray.some(item => item.id === id);

        if (isDuplicate) {
            console.warn("Товар уже добавлен ранее");
            if (window.showToast) {
                showToast("Этот курс уже добавлен!", "error");
            } else {
                alert("Этот курс уже добавлен!");
            }
            return; // Прерываем выполнение
        }

        // 4. Если дубликата нет — отправляем POST запрос
        console.log(`Отправляю данные в ${target}...`);
        const postResponse = await fetch(`${API_URL}/${target}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...courseData,
                quantity: 1
            })
        });

        if (postResponse.ok) {
            console.log("Успешно добавлено на сервер");
            if (window.showToast) {
                showToast("Успешно добавлено!", "success");
            } else {
                alert("Успешно добавлено!");
            }
        } else {
            throw new Error(`Ошибка сервера: ${postResponse.status}`);
        }

    } catch (error) {
        console.error("Ошибка при добавлении:", error);
        if (window.showToast) {
            showToast("Произошла ошибка при добавлении", "error");
        }
    }
}

function setupEventListeners() {
    const inputs = document.querySelectorAll('.control--input, .control--select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            currentPage = 1;
            loadCatalog();
        });
    });

    const filterForm = document.querySelector('.controls--section'); 
    if (filterForm && filterForm.tagName === 'FORM') {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    document.getElementById('prevPage')?.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (currentPage > 1) {
            currentPage--;
            loadCatalog();
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage++;
        loadCatalog();
    });
}