const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const OpenApiValidator = require('express-openapi-validator');
const app = express();
const port = 3000;

const swaggerDocument = yaml.load('./openapi.yaml');


//simulacion una base de datos simple para usuarios
const users = [
    { id: 1, name: 'Cristian Romero', age: 30, email: 'cristian.romero@example.com' },
    { id: 2, name: 'Maria Lopez', age: 25, email: 'maria.lopez@example.com' },
    { id: 3, name: 'Ana Garcia', age: 28, email: 'ana.garcia@example.com' },
    { id: 4, name: 'Juan Perez', age: 30, email: 'juan.perez@example.com' },
    { id: 5, name: 'Pedro Gomez', age: 25, email: 'pedro.gomez@example.com' },
    { id: 6, name: 'Antonio Torres', age: 28, email: 'antonio.torres@example.com' }
];

//simulacion una base de datos simple para productos
const products = [
    // ELECTRONICS - iPhone 15 Pro
    {
        id: 1,
        name: "iPhone 15 Pro",
        description: "El último smartphone de Apple con chip A17 Pro",
        price: 5000000,
        category: "electronics",
        tags: ["smartphone", "apple", "premium"],
        inStock: true,
        specifications: {
            "storage": "256GB",
            "color": "Natural Titanium",
            "screen": "6.1 inch Super Retina XDR"
        },
        ratings: [
            { score: 5, comment: "Excelente teléfono, muy rápido" },
            { score: 4, comment: "Buen diseño pero caro" }
        ]
    },
    
    // BOOKS - Programación en JavaScript
    {
        id: 2,
        name: "Programación en JavaScript",
        description: "Guía completa para aprender JavaScript moderno",
        price: 89900.00,
        category: "books",
        tags: ["programming", "javascript", "tutorial"],
        inStock: true,
        specifications: {
            "pages": "450",
            "language": "Spanish",
            "format": "Paperback"
        },
        ratings: [
            { score: 5, comment: "Muy buen libro para principiantes" }
        ]
    },
    
    // CLOTHES - Camiseta Algodón Orgánico
    {
        id: 3,
        name: "Camiseta Algodón Orgánico",
        description: "Camiseta cómoda y sostenible de algodón 100% orgánico",
        price: 45900.00,
        category: "clothes",
        tags: ["cotton", "organic", "casual", "sustainable"],
        inStock: true,
        specifications: {
            "material": "100% Algodón Orgánico",
            "sizes": "XS, S, M, L, XL, XXL",
            "colors": "Blanco, Negro, Azul, Verde",
            "care": "Lavable en máquina"
        },
        ratings: [
            { score: 5, comment: "Muy cómoda y suave" },
            { score: 4, comment: "Buena calidad por el precio" }
        ]
    },
    
    // FOOD - Bandeja Paisa
    {
        id: 4,
        name: "Bandeja Paisa Tradicional",
        description: "Plato típico antioqueño con todos los ingredientes tradicionales: arroz, fríjoles, carne molida, chicharrón, chorizo, huevo, aguacate, plátano y arepa",
        price: 18900.00,
        category: "food",
        tags: ["traditional", "antioqueño", "colombian", "authentic", "hearty"],
        inStock: true,
        specifications: {
            "serving_size": "1 persona",
            "preparation_time": "25 minutos",
            "calories": "1200 kcal aprox",
            "origin": "Antioquia, Colombia",
            "ingredients": "Arroz, fríjoles, carne molida, chicharrón, chorizo, huevo, aguacate, plátano maduro, arepa"
        },
        ratings: [
            { score: 5, comment: "Sabor auténtico paisa, muy deliciosa" },
            { score: 5, comment: "Perfecta porción, muy completa" },
            { score: 4, comment: "Buen precio para un plato tan completo" }
        ]
    }
];

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

app.get('/hello', (req, res) => {
    res.json({message:'Hello World'});
});

app.post('/users', (req, res) => {
    const { name, age, email } = req.body;
    const newUser = {
        id: Date.now(),
        name,
        age,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});


app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user);
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, age, email } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Update the user
    users[userIndex] = {
        ...users[userIndex],
        name,
        age,
        email
    };
    
    res.status(200).json(users[userIndex]);
});

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
    
    // Crear el nuevo producto con ID único
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
    
    // Agregar el producto al array
    products.push(newProduct);
    
    // Retornar el producto creado con código 201
    res.status(201).json(newProduct);
});

// ...existing code...


// PUT /products/:id - Actualizar un producto por id
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, description, price, category, tags, inStock, specifications, ratings } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
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

// DELETE /products/:id - Eliminar un producto por id
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

// ...existing code...

// Manejo de errores de validación
app.use((err, req, res, next) => {
    if (err && err.status) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }
    next(err);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


