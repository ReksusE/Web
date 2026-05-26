const API_URL = "http://localhost:3000";

async function loadFavorites() {
    const currentUserId = localStorage.getItem('currentUserId');
    
    let url = `${API_URL}/favorites`;
    if (currentUserId) {
        url += `?userId=${currentUserId}`;
    }
    
    const res = await fetch(url);
    const data = await res.json();
    const items = data.data || data; 

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