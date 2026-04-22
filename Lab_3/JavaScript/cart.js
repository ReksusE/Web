const API_URL = "http://localhost:3000";

async function loadCart() {
    const res = await fetch(`${API_URL}/cart`);
    const data = await res.json();
    const items = data.data || data;

    renderCart(items);
    calculateTotal(items);
}

function renderCart(items) {
    const grid = document.getElementById('cart-container');
    grid.innerHTML = items.map(item => `
        <div class="course--card">
            <div class="course--card--content">
                <h3>${item.title}</h3>
                <p>Цена: $${item.price}</p>
                <div style="margin: 10px 0;">
                    <span>Кол-во: </span>
                    <input type="number" value="${item.quantity || 1}" min="1" 
                           onchange="updateQuantity('${item.id}', this.value)" style="width: 50px;">
                </div>
                <button onclick="removeFromCart('${item.id}')" class="btn-main" style="background:#ccc">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Расчет суммы (Пункт 4 требований)
function calculateTotal(items) {
    const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    document.getElementById('totalPrice').textContent = `Итого: $${total}`;
}

// Изменение количества (Пункт 3 требований)
async function updateQuantity(id, newQty) {
    await fetch(`${API_URL}/cart/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ quantity: parseInt(newQty) })
    });
    loadCart();
}

async function removeFromCart(id) {
    await fetch(`${API_URL}/cart/${id}`, { method: 'DELETE' });
    loadCart();
}

// Оформление покупки (Пункт 5 требований)
async function checkout() {
    const res = await fetch(`${API_URL}/cart`);
    const items = (await res.json()).data || (await res.json());

    // Очищаем корзину (удаляем каждый элемент)
    for (let item of items) {
        await fetch(`${API_URL}/cart/${item.id}`, { method: 'DELETE' });
    }

    alert("Покупка успешно оформлена! Ваша корзина очищена.");
    window.location.href = "index.html";
}

window.onload = loadCart;