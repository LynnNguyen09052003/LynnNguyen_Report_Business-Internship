const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const dataPath = path.join(__dirname, 'products.json');

app.use(cors());
app.use(express.json());
const readProducts = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('❌ Không đọc được file:', err);
        return [];
    }
};
const writeProducts = (products) => {
    try {
        console.log('📁 Đang ghi vào:', dataPath);
        fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf8');
        console.log('✅ Đã ghi thành công');
        fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf8');
    } catch (err) {
        console.error('❌ Không ghi được file:', err);
    }
};
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let products = readProducts();
    const newProducts = products.filter(p => p.id !== id);

    if (newProducts.length === products.length) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    writeProducts(newProducts);
    console.log(`🗑️ Đã xóa sản phẩm có id ${id}`);
    res.status(204).send();
});

app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Thiếu tên hoặc giá sản phẩm' });
    }

    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name,
        price: parseFloat(price)
    };

    products.push(newProduct);
    writeProducts(products);

    console.log('✅ Thêm sản phẩm:', newProduct);
    res.status(201).json(newProduct);
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});