// API configuration - Change this URL after deploying backend
const API_BASE_URL = 'http://localhost:3001/api';

// Updated AgriBlockchain class to use backend API
class AgriBlockchain {
    constructor() {
        this.products = new Map();
    }

    async initializeData() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const products = await response.json();
            
            products.forEach(product => {
                this.products.set(product.id, product);
            });
            
            console.log('Data loaded from backend:', products.length, 'products');
        } catch (error) {
            console.error('Failed to load data from backend:', error);
            // Fallback to empty state
        }
    }

    async getProduct(productId) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                const newProduct = await response.json();
                this.products.set(newProduct.id, newProduct);
                return newProduct.id;
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }
}

// Initialize blockchain
const blockchain = new AgriBlockchain();

// DOM Functions
async function trackProduct() {
    const productId = document.getElementById('productId').value.trim();
    
    if (!productId) {
        showNotification('Please enter a product ID', 'error');
        return;
    }

    try {
        const product = await blockchain.getProduct(productId);
        
        if (product) {
            displayProductInfo(product);
            displayTimeline(product.timeline);
            showNotification(`Product ${productId} found!`, 'success');
        } else {
            showNotification('Product not found. Try AGT001 or AGT002', 'error');
        }
    } catch (error) {
        showNotification('Error connecting to server. Please try again.', 'error');
    }
}

function displayProductInfo(product) {
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productStatus').textContent = product.status;
    document.getElementById('productStatus').className = `status ${product.status.toLowerCase()}`;
    document.getElementById('detailId').textContent = product.id;
    document.getElementById('detailFarm').textContent = product.farm;
    document.getElementById('detailHarvest').textContent = product.harvestDate;
    document.getElementById('detailLocation').textContent = product.currentLocation;
}

function displayTimeline(timeline) {
    const timelineContainer = document.querySelector('.timeline');
    timelineContainer.innerHTML = '';

    timeline.forEach((stage, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${stage.status}`;
        
        const icon = getStageIcon(stage.stage);
        
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4>${icon} ${stage.stage}</h4>
                <p><strong>Location:</strong> ${stage.location}</p>
                <p><strong>Date:</strong> ${stage.date}</p>
                ${stage.temperature !== 'N/A' ? `<p><strong>Temperature:</strong> ${stage.temperature}</p>` : ''}
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

function getStageIcon(stage) {
    const icons = {
        'Harvesting': '🌿',
        'Storage': '❄️',
        'Transport': '🚚',
        'Retail': '🏪',
        'Processing': '🏭'
    };
    return icons[stage] || '📦';
}

async function addProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const farm = document.getElementById('newFarm').value.trim();
    const harvestDate = document.getElementById('newHarvestDate').value;

    if (!name || !farm || !harvestDate) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        const productId = await blockchain.addProduct({
            name: name,
            farm: farm,
            harvestDate: harvestDate
        });
        
        showNotification(`Product added to blockchain! ID: ${productId}`, 'success');
        
        // Clear form
        document.getElementById('newProductName').value = '';
        document.getElementById('newFarm').value = '';
        document.getElementById('newHarvestDate').value = '';
        
        // Auto-fill the search with new product ID
        document.getElementById('productId').value = productId;
        
    } catch (error) {
        showNotification('Failed to add product. Please try again.', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #4caf50;' : 'background: #f44336;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Event Listeners
document.getElementById('productId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        trackProduct();
    }
});

// Initialize with sample data
document.addEventListener('DOMContentLoaded', async function() {
    console.log('VeriFarm Blockchain System Initialized');
    
    // Load data from backend
    await blockchain.initializeData();
    
    // Auto-track sample product
    setTimeout(() => {
        document.getElementById('productId').value = 'AGT001';
        trackProduct();
    }, 1000);
});
