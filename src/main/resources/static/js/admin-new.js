// Admin Panel - Production Ready
document.addEventListener('DOMContentLoaded', async () => {
    // Check admin authentication
    if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('login-required').style.display = 'block';
        return;
    }

    // Show admin content
    document.getElementById('admin-content').style.display = 'block';
    document.getElementById('login-required').style.display = 'none';

    // Load initial data
    await Promise.all([
        loadProducts(),
        loadCategories(),
        loadUsers(),
        loadAllOrders()
    ]);

    setupEventListeners();
});

// Section Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
}

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('category-form').addEventListener('submit', saveCategory);
    document.getElementById('user-form').addEventListener('submit', saveUser);
    document.getElementById('stock-form').addEventListener('submit', updateStock);
}

// ===== PRODUCTS MANAGEMENT =====
let currentProductId = null;

async function loadProducts() {
    try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load products');
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        showToast('Error loading products: ' + error.message, 'error');
    }
}

function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span class="stock-badge ${product.stockQuantity < 10 ? 'stock-low' : ''}">
                    ${product.stockQuantity}
                </span>
            </td>
            <td>${product.category?.name || 'N/A'}</td>
            <td>
                <span class="status-badge ${product.active ? 'status-active' : 'status-inactive'}">
                    ${product.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="action-buttons">
                <button onclick="editProduct(${product.id})" class="btn-icon" title="Edit">
                    ✏️
                </button>
                <button onclick="showStockUpdate(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.stockQuantity})" class="btn-icon" title="Update Stock">
                    📦
                </button>
                <button onclick="deleteProduct(${product.id})" class="btn-icon btn-danger" title="Delete">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showProductForm() {
    currentProductId = null;
    document.getElementById('product-form-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-active').checked = true;
    document.getElementById('product-modal').style.display = 'flex';
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load product');
        
        const product = await response.json();
        currentProductId = id;
        
        document.getElementById('product-form-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-sku').value = product.sku;
        document.getElementById('product-stock').value = product.stockQuantity;
        document.getElementById('product-category').value = product.category?.id || '';
        document.getElementById('product-image').value = product.imageUrl || '';
        document.getElementById('product-active').checked = product.active;
        
        document.getElementById('product-modal').style.display = 'flex';
    } catch (error) {
        showToast('Error loading product: ' + error.message, 'error');
    }
}

async function saveProduct(e) {
    e.preventDefault();

    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        sku: document.getElementById('product-sku').value,
        stockQuantity: parseInt(document.getElementById('product-stock').value),
        categoryId: parseInt(document.getElementById('product-category').value),
        imageUrl: document.getElementById('product-image').value,
        active: document.getElementById('product-active').checked
    };

    try {
        const url = currentProductId 
            ? `${API_ENDPOINTS.PRODUCTS}/${currentProductId}`
            : API_ENDPOINTS.PRODUCTS;
        
        const method = currentProductId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save product');
        }

        closeProductModal();
        await loadProducts();
        showToast('Product saved successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to delete product');

        await loadProducts();
        showToast('Product deleted successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// ===== STOCK MANAGEMENT =====
let currentStockProductId = null;

function showStockUpdate(productId, productName, currentStock) {
    currentStockProductId = productId;
    document.getElementById('stock-product-name').value = productName;
    document.getElementById('stock-current').value = currentStock;
    document.getElementById('stock-new').value = currentStock;
    document.getElementById('stock-modal').style.display = 'flex';
}

async function updateStock(e) {
    e.preventDefault();

    const newStock = parseInt(document.getElementById('stock-new').value);

    try {
        // Load current product
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${currentStockProductId}`, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load product');
        
        const product = await response.json();

        // Update only stock quantity
        product.stockQuantity = newStock;

        const updateResponse = await fetch(`${API_ENDPOINTS.PRODUCTS}/${currentStockProductId}`, {
            method: 'PUT',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(product)
        });

        if (!updateResponse.ok) throw new Error('Failed to update stock');

        closeStockModal();
        await loadProducts();
        showToast('Stock updated successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function closeStockModal() {
    document.getElementById('stock-modal').style.display = 'none';
}

// ===== CATEGORIES MANAGEMENT =====
let currentCategoryId = null;

async function loadCategories() {
    try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load categories');
        
        const categories = await response.json();
        displayCategories(categories);
        populateCategorySelect(categories);
    } catch (error) {
        showToast('Error loading categories: ' + error.message, 'error');
    }
}

function displayCategories(categories) {
    const tbody = document.getElementById('categories-table-body');
    tbody.innerHTML = '';

    categories.forEach(category => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || ''}</td>
            <td>
                <span class="status-badge ${category.active ? 'status-active' : 'status-inactive'}">
                    ${category.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="action-buttons">
                <button onclick="editCategory(${category.id})" class="btn-icon" title="Edit">
                    ✏️
                </button>
                <button onclick="deleteCategory(${category.id})" class="btn-icon btn-danger" title="Delete">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateCategorySelect(categories) {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        if (category.active) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        }
    });
}

function showCategoryForm() {
    currentCategoryId = null;
    document.getElementById('category-form-title').textContent = 'Add Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-active').checked = true;
    document.getElementById('category-modal').style.display = 'flex';
}

async function editCategory(id) {
    try {
        const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load category');
        
        const category = await response.json();
        currentCategoryId = id;
        
        document.getElementById('category-form-title').textContent = 'Edit Category';
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-description').value = category.description || '';
        document.getElementById('category-active').checked = category.active;
        
        document.getElementById('category-modal').style.display = 'flex';
    } catch (error) {
        showToast('Error loading category: ' + error.message, 'error');
    }
}

async function saveCategory(e) {
    e.preventDefault();

    const categoryData = {
        name: document.getElementById('category-name').value,
        description: document.getElementById('category-description').value,
        active: document.getElementById('category-active').checked
    };

    try {
        const url = currentCategoryId 
            ? `${API_ENDPOINTS.CATEGORIES}/${currentCategoryId}`
            : API_ENDPOINTS.CATEGORIES;
        
        const method = currentCategoryId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save category');
        }

        closeCategoryModal();
        await loadCategories();
        showToast('Category saved successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category? All products in this category will need to be reassigned.')) return;

    try {
        const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${id}`, {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to delete category');

        await loadCategories();
        showToast('Category deleted successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
}

// ===== USER MANAGEMENT =====
let currentUserId = null;

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load users');
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showToast('Error loading users: ' + error.message, 'error');
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    users.forEach(user => {
        const rolesText = user.roles ? user.roles.join(', ') : 'N/A';
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${fullName}</td>
            <td>
                <span class="role-badges">
                    ${user.roles.map(role => `<span class="role-badge ${role === 'ADMIN' ? 'role-admin' : 'role-user'}">${role}</span>`).join('')}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.active ? 'status-active' : 'status-inactive'}">
                    ${user.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="action-buttons">
                <button onclick="editUser(${user.id})" class="btn-icon" title="Edit">
                    ✏️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function editUser(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: Auth.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to load user');
        
        const user = await response.json();
        currentUserId = id;
        
        document.getElementById('user-username').value = user.username;
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-firstname').value = user.firstName || '';
        document.getElementById('user-lastname').value = user.lastName || '';
        document.getElementById('user-active').checked = user.active;
        
        // Set roles
        document.getElementById('role-user').checked = user.roles.includes('USER');
        document.getElementById('role-admin').checked = user.roles.includes('ADMIN');
        
        document.getElementById('user-modal').style.display = 'flex';
    } catch (error) {
        showToast('Error loading user: ' + error.message, 'error');
    }
}

async function saveUser(e) {
    e.preventDefault();

    const roles = [];
    if (document.getElementById('role-user').checked) roles.push('USER');
    if (document.getElementById('role-admin').checked) roles.push('ADMIN');

    if (roles.length === 0) {
        showToast('Please select at least one role', 'error');
        return;
    }

    const userData = {
        email: document.getElementById('user-email').value,
        firstName: document.getElementById('user-firstname').value,
        lastName: document.getElementById('user-lastname').value,
        active: document.getElementById('user-active').checked,
        roles: roles
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUserId}`, {
            method: 'PUT',
            headers: Auth.getAuthHeaders(),
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }

        closeUserModal();
        await loadUsers();
        showToast('User updated successfully', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
}

// ===== ORDERS MANAGEMENT =====
let allOrders = [];

async function loadAllOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/all`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (!response.ok) {
            // If endpoint doesn't exist, create placeholder
            allOrders = [];
            displayOrders([]);
            return;
        }
        
        allOrders = await response.json();
        displayOrders(allOrders);
    } catch (error) {
        console.log('Orders endpoint not available yet');
        allOrders = [];
        displayOrders([]);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No orders found</p></div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h4>Order #${order.id}</h4>
                    <p class="order-user">User: ${order.username || 'N/A'}</p>
                </div>
                <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.productName}</span>
                        <span>Qty: ${item.quantity} × $${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function filterOrders() {
    const status = document.getElementById('order-status-filter').value;
    const filtered = status ? allOrders.filter(order => order.status === status) : allOrders;
    displayOrders(filtered);
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
