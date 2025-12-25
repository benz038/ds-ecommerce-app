// Admin page functionality
document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
        alert('Admin access required');
        window.location.href = 'login.html';
        return;
    }

    showSection('products');
    await loadProducts();
    await loadCategories();
    setupEventListeners();
});

function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById(`${section}-section`).style.display = 'block';

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event?.target?.classList.add('active');
}

function setupEventListeners() {
    // Product form
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    
    // Category form
    document.getElementById('category-form').addEventListener('submit', saveCategory);
}

// ===== PRODUCTS =====
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
            <td>${product.stockQuantity}</td>
            <td>${product.category?.name || 'N/A'}</td>
            <td><span class="badge ${product.active ? 'badge-success' : 'badge-danger'}">${product.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button onclick="editProduct(${product.id})" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showProductForm() {
    currentProductId = null;
    document.getElementById('product-form-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
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
        document.getElementById('product-description').value = product.description;
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

// ===== CATEGORIES =====
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
            <td><span class="badge ${category.active ? 'badge-success' : 'badge-danger'}">${category.active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button onclick="editCategory(${category.id})" class="btn btn-sm btn-primary">Edit</button>
                <button onclick="deleteCategory(${category.id})" class="btn btn-sm btn-danger">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function populateCategorySelect(categories) {
    const select = document.getElementById('product-category');
    select.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function showCategoryForm() {
    currentCategoryId = null;
    document.getElementById('category-form-title').textContent = 'Add Category';
    document.getElementById('category-form').reset();
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
        document.getElementById('category-description').value = category.description;
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
    if (!confirm('Are you sure you want to delete this category?')) return;

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

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
