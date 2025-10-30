// Simple blockchain simulation for agricultural supply chain
class AgriBlockchain {
    constructor() {
        this.products = new Map();
        this.initializeSampleData();
    }

    initializeSampleData() {
        const sampleProducts = {
            'AGT001': {
                id: 'AGT001',
                name: 'Organic Tomatoes',
                farm: 'Green Valley Farms',
                harvestDate: '2024-01-15',
                currentLocation: 'Distribution Center',
                status: 'Fresh',
                timeline: [
                    {
                        stage: 'Harvesting',
                        location: 'Green Valley Farms',
                        date: '2024-01-15',
                        temperature: '22°C',
                        status: 'completed'
                    },
                    {
                        stage: 'Storage',
                        location: 'Cold Storage Unit #5',
                        date: '2024-01-16',
                        temperature: '4°C',
                        status: 'completed'
                    },
                    {
                        stage: 'Transport',
                        location: 'In Transit to Retail',
                        date: '2024-01-18',
                        temperature: '6°C',
                        status: 'current'
                    },
                    {
                        stage: 'Retail',
                        location: 'Supermarket Shelf',
                        date: '2024-01-19',
                        temperature: '8°C',
                        status: 'upcoming'
                    }
                ]
            },
            'AGT002': {
                id: 'AGT002',
                name: 'Fresh Carrots',
                farm: 'Sunshine Farms',
                harvestDate: '2024-01-10',
                currentLocation: 'Retail Store',
                status: 'Good',
                timeline: [
                    {
                        stage: 'Harvesting',
                        location: 'Sunshine Farms',
                        date: '2024-01-10',
                        temperature: '18°C',
                        status: 'completed'
                    },
                    {
                        stage: 'Storage',
                        location: 'Warehouse A',
                        date: '2024-01-11',
                        temperature: '5°C',
                        status: 'completed'
                    },
                    {
                        stage: 'Transport',
                        location: 'Delivery Truck',
                        date: '2024-01-12',
                        temperature: '7°C',
                        status: 'completed'
                    },
                    {
                        stage: 'Retail',
                        location: 'Local Market',
                        date: '2024-01-13',
                        temperature: '10°C',
                        status: 'current'
                    }
                ]
            }
        };

        // Add sample products to blockchain
        Object.values(sampleProducts).forEach(product => {
            this.products.set(product.id, product);
        });
    }

    addProduct(productData) {
        const productId = 'AGT' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const newProduct = {
            id: productId,
            name: productData.name,
            farm: productData.farm,
            harvestDate: productData.harvestDate,
            currentLocation: 'Farm - Ready for Processing',
            status: 'Fresh',
            timeline: [
                {
                    stage: 'Harvesting',
                    location: productData.farm,
                    date: productData.harvestDate,
                    temperature: '22°C',
                    status: 'completed'
                },
                {
                    stage: 'Processing',
                    location: 'Awaiting Processing',
                    date: 'Pending',
                    temperature: 'N/A',
                    status: 'upcoming'
                },
                {
                    stage: 'Storage',
                    location: 'Pending',
                    date: 'Pending',
                    temperature: 'N/A',
                    status: 'upcoming'
                },
                {
                    stage: 'Retail',
                    location: 'Pending',
                    date: 'Pending',
                    temperature: 'N/A',
                    status: 'upcoming'
                }
            ]
        };

        this.products.set(productId, newProduct);
        return productId;
    }

    getProduct(productId) {
        return this.products.get(productId.toUpperCase());
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }
}

// Initialize blockchain
const blockchain = new AgriBlockchain();

// DOM Functions
function trackProduct() {
    const productId = document.getElementById('productId').value.trim();
    
    if (!productId) {
        showNotification('Please enter a product ID', 'error');
        return;
    }

    const product = blockchain.getProduct(productId);
    
    if (product) {
        displayProductInfo(product);
        displayTimeline(product.timeline);
        showNotification(`Product ${productId} found!`, 'success');
    } else {
        showNotification('Product not found. Try AGT001 or AGT002', 'error');
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

function addProduct() {
    const name = document.getElementById('newProductName').value.trim();
    const farm = document.getElementById('newFarm').value.trim();
    const harvestDate = document.getElementById('newHarvestDate').value;

    if (!name || !farm || !harvestDate) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const productData = {
        name: name,
        farm: farm,
        harvestDate: harvestDate
    };

    const productId = blockchain.addProduct(productData);
    
    showNotification(`Product added to blockchain! ID: ${productId}`, 'success');
    
    // Clear form
    document.getElementById('newProductName').value = '';
    document.getElementById('newFarm').value = '';
    document.getElementById('newHarvestDate').value = '';
    
    // Auto-fill the search with new product ID
    document.getElementById('productId').value = productId;
}

function showNotification(message, type) {
    // Create notification element
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
    
    // Remove after 3 seconds
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('VeriFarm Blockchain System Initialized');
    console.log('Sample Product IDs: AGT001, AGT002');
    
    // Auto-track sample product
    setTimeout(() => {
        document.getElementById('productId').value = 'AGT001';
        trackProduct();
    }, 1000);
});
