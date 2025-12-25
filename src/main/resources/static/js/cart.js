// Cart page functionality
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    await loadCart();
    
    // Add event listener for clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Add event listener for checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});

async function loadCart() {
    const emptyCartEl = document.getElementById('empty-cart');
    const cartContentEl = document.getElementById('cart-content');

    try {
        const response = await fetch(API_ENDPOINTS.CART, {
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load cart');

        const cart = await response.json();
        console.log('Cart data received:', cart); // Debug log
        displayCart(cart);
    } catch (error) {
        console.error('Error loading cart:', error);
        emptyCartEl.style.display = 'block';
        cartContentEl.style.display = 'none';
        showToast('Error loading cart: ' + error.message, 'error');
    }
}

function displayCart(cart) {
    const cartItemsEl = document.getElementById('cart-items');
    const emptyCartEl = document.getElementById('empty-cart');
    const cartContentEl = document.getElementById('cart-content');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    cartItemsEl.innerHTML = '';

    if (!cart.items || cart.items.length === 0) {
        emptyCartEl.style.display = 'block';
        cartContentEl.style.display = 'none';
        return;
    }

    emptyCartEl.style.display = 'none';
    cartContentEl.style.display = 'block';

    cart.items.forEach(item => {
        const itemEl = createCartItemElement(item);
        cartItemsEl.appendChild(itemEl);
    });

    const subtotal = cart.totalPrice || 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    // The backend returns flat fields, not a nested product object
    const imageUrl = item.productImageUrl || 'https://via.placeholder.com/100?text=No+Image';
    const productName = item.productName || 'Unknown Product';
    
    div.innerHTML = `
        <img src="${imageUrl}" alt="${productName}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
        <div class="cart-item-details">
            <h3>${productName}</h3>
            <p class="cart-item-price">$${(item.price || 0).toFixed(2)} each</p>
            <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="btn btn-sm">-</button>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity(${item.id}, this.value)" class="quantity-input">
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="btn btn-sm">+</button>
            </div>
            <p class="cart-item-subtotal">Subtotal: $${(item.subtotal || 0).toFixed(2)}</p>
            <button onclick="removeItem(${item.id})" class="btn btn-danger btn-sm">Remove</button>
        </div>
    `;
    
    return div;
}

async function updateQuantity(itemId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeItem(itemId);
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.CART_ITEMS}/${itemId}`, {
            method: 'PUT',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update quantity');
        }

        await loadCart();
        showToast('Cart updated', 'success');
    } catch (error) {
        showToast(error.message, 'error');
        await loadCart(); // Reload to revert changes
    }
}

async function removeItem(itemId) {
    if (!confirm('Remove this item from cart?')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.CART_ITEMS}/${itemId}`, {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to remove item');

        await loadCart();
        showToast('Item removed from cart', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;

    try {
        const response = await fetch(API_ENDPOINTS.CART, {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to clear cart');

        await loadCart();
        showToast('Cart cleared', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function proceedToCheckout() {
    try {
        // First check if cart is empty
        const cartResponse = await fetch(API_ENDPOINTS.CART, {
            headers: Auth.getAuthHeaders()
        });

        if (!cartResponse.ok) throw new Error('Failed to load cart');

        const cart = await cartResponse.json();
        
        if (!cart.items || cart.items.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        // Calculate totals
        const subtotal = cart.totalPrice || 0;
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        // Show confirmation dialog
        const confirmMessage = `
            Order Summary:
            Subtotal: $${subtotal.toFixed(2)}
            Tax (10%): $${tax.toFixed(2)}
            Total: $${total.toFixed(2)}
            
            Proceed with checkout?
        `;

        if (!confirm(confirmMessage)) return;

        // Show processing message
        showToast('Processing order...', 'info');

        // Create order via API
        const orderResponse = await fetch(API_ENDPOINTS.ORDERS, {
            method: 'POST',
            headers: Auth.getAuthHeaders()
        });

        if (!orderResponse.ok) {
            const error = await orderResponse.json();
            throw new Error(error.message || 'Failed to create order');
        }

        const order = await orderResponse.json();

        showToast(`Order #${order.id} placed successfully! Thank you for your purchase.`, 'success');
        
        // Reload cart to show empty state
        setTimeout(() => {
            loadCart();
        }, 2000);

    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Checkout failed: ' + error.message, 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
