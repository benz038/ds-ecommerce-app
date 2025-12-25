// Products page functionality
let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();
    setupEventListeners();
});

async function loadCategories() {
    try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        if (!response.ok) throw new Error('Failed to load categories');
        
        allCategories = await response.json();
        
        const categoryFilter = document.getElementById('category-filter');
        allCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const productsGrid = document.getElementById('products-grid');

    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';

    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS);
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        errorEl.textContent = 'Error loading products: ' + error.message;
        errorEl.style.display = 'block';
    } finally {
        loadingEl.style.display = 'none';
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
    const inStock = product.stockQuantity > 0;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description || ''}</p>
            <p class="product-category">Category: ${product.categoryName || 'N/A'}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <span class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">
                    ${inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </span>
            </div>
            ${inStock && Auth.isLoggedIn() ? 
                `<button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">Add to Cart</button>` :
                inStock && !Auth.isLoggedIn() ?
                `<a href="login.html" class="btn btn-secondary btn-block">Login to Purchase</a>` :
                `<button class="btn btn-secondary btn-block" disabled>Out of Stock</button>`
            }
        </div>
    `;
    
    return card;
}

async function addToCart(productId) {
    if (!Auth.isLoggedIn()) {
        showToast('Please login to add items to cart', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    try {
        const response = await fetch(API_ENDPOINTS.CART_ITEMS, {
            method: 'POST',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add to cart');
        }

        showToast('Product added to cart!', 'success');
        updateCartCount();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function updateCartCount() {
    if (!Auth.isLoggedIn()) return;

    try {
        const response = await fetch(API_ENDPOINTS.CART, {
            headers: Auth.getAuthHeaders()
        });

        if (response.ok) {
            const cart = await response.json();
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                cartCount.textContent = totalItems;
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryId = document.getElementById('category-filter').value;

    console.log('Filtering - Search:', searchTerm, 'Category:', categoryId);
    console.log('Total products:', allProducts.length);

    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            (p.description && p.description.toLowerCase().includes(searchTerm))
        );
        console.log('After search filter:', filtered.length);
    }

    // Apply category filter
    if (categoryId && categoryId !== '') {
        const categoryIdNum = parseInt(categoryId);
        filtered = filtered.filter(p => {
            const hasCategory = p.categoryId === categoryIdNum;
            return hasCategory;
        });
        console.log('After category filter:', filtered.length);
    }

    displayProducts(filtered);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update cart count on page load
updateCartCount();
