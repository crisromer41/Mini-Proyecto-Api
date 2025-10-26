const express = require('express');
// Asegúrese de que estas dependencias estén instaladas:
const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const fs = require('fs');
const YAML = require('yaml');

// --- Setup ---
const app = express();

// Mock de datos en memoria (utilizando arrays como usa su lógica)
const users = [];
const products = [];

// --- Configuración OpenAPI ---
// Carga del archivo de especificación YAML
const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

// Docs fuera de validación
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Parsers necesarios antes del validador
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Validador OpenAPI
app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true,
        validateResponses: false
    })
);

// --- Rutas de Usuarios ---

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.post('/users', (req, res) => {
    const { name, age, email } = req.body;
    const newUser = {
        id: Date.now(), // Usando Date.now() como ID
        name,
        age,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { name, age, email } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex] = {
        ...users[userIndex],
        name,
        age,
        email
    };

    res.status(200).json(users[userIndex]);
});

// --- Rutas de Productos ---

app.post('/products', (req, res) => {
    const {
        name,
        description,
        price,
        category,
        tags,
        inStock,
        specifications,
        ratings
    } = req.body;

    const newProduct = {
        id: Date.now(),
        name,
        description: description || '',
        price,
        category,
        tags: tags || [],
        inStock: inStock !== undefined ? inStock : true,
        specifications: specifications || {},
        ratings: ratings || []
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, category, tags, inStock, specifications, ratings } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = {
        ...products[productIndex],
        name,
        description,
        price,
        category,
        tags,
        inStock,
        specifications,
        ratings
    };

    res.status(200).json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

// --- Manejo de errores de validación ---
app.use((err, req, res, next) => {
    if (err && err.status) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }

    console.error(err);
    return res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Exporta la aplicación para ser usada por src/index.js y src/test.js
module.exports = app;