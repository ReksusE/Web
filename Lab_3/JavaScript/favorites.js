const API_URL = "http://localhost:3000";

async function loadFavorites() {
    const res = await fetch(`${API_URL}/favorites`);
    const data = await res.json();
    const items = data.data || data; // Обработка версии 1.0

    const grid = document.getElementById('favorites-container');
    grid.innerHTML = items.map(item => `
        <div class="course--card">
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="course--card--content">
                <h3>${item.title}</h3>
                <p>$${item.price}</p>
                <button onclick="removeFromFavorites('${item.id}')" class="btn-main" style="background:#ff4d4d">Удалить</button>
            </div>
        </div>
    `).join('');
}

async function removeFromFavorites(id) {
    await fetch(`${API_URL}/favorites/${id}`, { method: 'DELETE' });
    loadFavorites(); // Перерисовываем список
}

window.onload = loadFavorites;