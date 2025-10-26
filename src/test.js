const request = require('supertest');
// Importar la aplicación Express directamente para Supertest
const app = require('./app'); 
// Importar la instancia del servidor para cerrarla
const server = require('./server'); 

describe('Version 1 de la API', () => {
    let userId; 
    let productId;

    // Cierra el servidor después de todas las pruebas
    afterAll((done) => {
        server.close(done);
    });

    it('GET /hello debe responder con Hello World', async () => {
        const res = await request(app).get('/hello');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Hello World'); 
    });

    it('POST /users debe crear un usuario', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                name: 'Juan',
                age: 25,
                email: 'juan@correo.com'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(typeof res.body.id).toBe('number'); 
        expect(res.body).toHaveProperty('name', 'Juan');
        userId = res.body.id;
    });

    it('GET /users/:id debe devolver el usuario creado', async () => {
        const res = await request(app).get(`/users/${userId}`); 
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('name', 'Juan');
    });

    it('PUT /users/:id debe actualizar el usuario', async () => {
        const res = await request(app)
            .put(`/users/${userId}`)
            .send({
                name: 'Juan Actualizado',
                age: 26,
                email: 'juan.actualizado@correo.com'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Juan Actualizado');
    });

    it('POST /products debe crear un producto', async () => {
        const res = await request(app)
            .post('/products')
            .send({
                name: 'Producto Test',
                description: 'Descripción de prueba',
                price: 1000,
                category: 'electronics',
                tags: ['test'],
                inStock: true,
                specifications: { color: 'rojo' },
                ratings: []
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(typeof res.body.id).toBe('number'); 
        expect(res.body).toHaveProperty('name', 'Producto Test');
        productId = res.body.id;
    });

    it('PUT /products/:id debe actualizar el producto', async () => {
        const res = await request(app)
            .put(`/products/${productId}`)
            .send({
                name: 'Producto Actualizado',
                description: 'Nueva descripción',
                price: 1200,
                category: 'electronics',
                tags: ['actualizado'],
                inStock: false,
                specifications: { color: 'azul' },
                ratings: []
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Producto Actualizado');
    });

    it('DELETE /products/:id debe eliminar el producto', async () => {
        const res = await request(app).delete(`/products/${productId}`);
        expect(res.statusCode).toBe(204);

       
// Verifica que la eliminación fue exitosa
        const checkRes = await request(app).get(`/products/${productId}`);
        expect(checkRes.statusCode).toBe(404);
    });
});
