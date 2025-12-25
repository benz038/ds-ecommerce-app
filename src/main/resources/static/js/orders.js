// Orders page functionality
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    await loadOrders();
});

async function loadOrders() {
    const loadingEl = document.getElementById('loading');
    const emptyOrdersEl = document.getElementById('empty-orders');
    const ordersListEl = document.getElementById('orders-list');

    try {
        loadingEl.style.display = 'block';
        
        const response = await fetch(API_ENDPOINTS.ORDERS, {
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load orders');

        const orders = await response.json();
        loadingEl.style.display = 'none';

        if (!orders || orders.length === 0) {
            emptyOrdersEl.style.display = 'block';
            ordersListEl.innerHTML = '';
            return;
        }

        emptyOrdersEl.style.display = 'none';
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        loadingEl.style.display = 'none';
        showToast('Error loading orders: ' + error.message, 'error');
    }
}

function displayOrders(orders) {
    const ordersListEl = document.getElementById('orders-list');
    ordersListEl.innerHTML = '';

    orders.forEach(order => {
        const orderEl = createOrderElement(order);
        ordersListEl.appendChild(orderEl);
    });
}

function createOrderElement(order) {
    const div = document.createElement('div');
    div.className = 'order-card';
    
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusClass = getStatusClass(order.status);
    
    div.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Order #${order.id}</h3>
                <p class="order-date">${formattedDate}</p>
            </div>
            <div class="order-status">
                <span class="status-badge ${statusClass}">${order.status}</span>
                <p class="order-total">$${order.totalPrice.toFixed(2)}</p>
            </div>
        </div>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.productImageUrl || 'https://via.placeholder.com/60?text=No+Image'}" 
                         alt="${item.productName}" 
                         class="order-item-image"
                         onerror="this.src='https://via.placeholder.com/60?text=No+Image'">
                    <div class="order-item-details">
                        <h4>${item.productName}</h4>
                        <p>Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="order-item-price">
                        $${item.subtotal.toFixed(2)}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${order.tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${order.totalPrice.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    return div;
}

function getStatusClass(status) {
    const statusMap = {
        'PENDING': 'status-pending',
        'PROCESSING': 'status-processing',
        'SHIPPED': 'status-shipped',
        'DELIVERED': 'status-delivered',
        'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
