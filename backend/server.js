const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple file-based database
const DB_FILE = path.join(__dirname, 'products.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ products: [] }));
}

// Helper functions to read/write data
const readData = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { products: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Sample initial data
const initialProducts = [
    {
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
    {
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
];

// Initialize with sample data if empty
const data = readData();
if (data.products.length === 0) {
    data.products = initialProducts;
    writeData(data);
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    const data = readData();
    res.json(data.products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const data = readData();
    const product = data.products.find(p => p.id === req.params.id.toUpperCase());
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add new product
app.post('/api/products', (req, res) => {
    const { name, farm, harvestDate } = req.body;
    
    if (!name || !farm || !harvestDate) {
        return res.status(400).json({ error: 'Name, farm, and harvest date are required' });
    }

    const data = readData();
    const productId = 'AGT' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const newProduct = {
        id: productId,
        name,
        farm,
        harvestDate,
        currentLocation: 'Farm - Ready for Processing',
        status: 'Fresh',
        timeline: [
            {
                stage: 'Harvesting',
                location: farm,
                date: harvestDate,
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

    data.products.push(newProduct);
    writeData(data);
    
    res.status(201).json(newProduct);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'VeriFarm API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VeriFarm Backend Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🌱 Products API: http://localhost:${PORT}/api/products`);
});
