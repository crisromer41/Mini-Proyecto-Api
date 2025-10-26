// Importacion de dependencias estén instaladas:
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const fs = require('fs');
const YAML = require('yaml');


// --- Inicialización de la aplicación ---
const app = express();

//  Middleware de seguridad
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


// Seguridad HTTP headers
app.use(helmet());

// Habilitar CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Limitar el número de peticiones por IP (prevención de ataques DoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por IP
});
app.use(limiter);

//  Configuración OpenAPI

const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

// Documentación Swagger disponible en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Parsers para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de validación OpenAPI
app.use(
    OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true, // valida las solicitudes
        validateResponses: false // no valida las respuestas
    })
);


//  Datos en memoria (mock)

const users = [];
const products = [];


// Endpoint de prueba
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

// --- Usuarios ---
app.post('/users', (req, res) => {
    const { name, age, email } = req.body;
    const newUser = { id: Date.now(), name, age, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { name, age, email } = req.body;
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    users[index] = { ...users[index], name, age, email };
    res.status(200).json(users[index]);
});

// --- Productos ---
app.post('/products', (req, res) => {
    const { name, description, price, category, tags, inStock, specifications, ratings } = req.body;
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
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, category, tags, inStock, specifications, ratings } = req.body;
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products[index] = { ...products[index], name, description, price, category, tags, inStock, specifications, ratings };
    res.status(200).json(products[index]);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products.splice(index, 1);
    res.status(204).send();
});


//  Manejo de errores

app.use((err, req, res, next) => {
    if (err && err.status) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Exporta la aplicación para ser usada por index.js
module.exports = app;
