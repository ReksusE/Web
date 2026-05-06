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

function calculateTotal(items) {
    const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    document.getElementById('totalPrice').textContent = `Итого: $${total}`;
}

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

async function checkout() {
    try {
        const res = await fetch(`${API_URL}/cart`);
        const cartData = await res.json();
        const items = cartData.data || cartData;

        if (items.length === 0) {
            alert("Ваша корзина пуста!");
            return;
        }

        const currentUserId = localStorage.getItem('currentUserId'); 
        
        const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

        const newOrder = {
            userId: currentUserId,
            date: new Date().toISOString(),
            items: items.map(item => ({
                courseId: item.id,  // ← Используем ID из курса
                title: item.title,
                price: item.price,
                quantity: item.quantity || 1
            })),
            totalAmount: totalAmount
        };

        const orderResponse = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });

        if (!orderResponse.ok) throw new Error("Ошибка при создании заказа");

        for (let item of items) {
            await fetch(`${API_URL}/cart/${item.id}`, { method: 'DELETE' });
        }

        alert("Покупка успешно оформлена! Заказ сохранен в истории.");
        
        loadCart(); 

    } catch (error) {
        console.error("Ошибка оформления заказа:", error);
        alert("Не удалось оформить заказ. Попробуйте позже.");
    }
}

window.onload = loadCart;