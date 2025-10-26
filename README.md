# APIFIRST

API First es una aplicación de microservicios construida con Express.js que permite gestionar usuarios y productos, es una Api Monolitica pequeña. Utiliza OpenAPI para definir y validar la estructura de la API.

justificacion : MVC separa resposabilidades modelos: representan datos usuarios y productos, controladores, logicos del negocio, rutas definene endpoints.
## 📦 Requisitos

- Node.js >= 14
- npm

## ⚙️ Instalación

```bash
npm install
```

## 🚀 Ejecutar el servidor

```bash
npm start
```

El servidor estará disponible en:
- API: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/docs`

## 🧪 Ejecutar pruebas

```bash
npm test
```

Las pruebas están escritas con Jest y Supertest.

## 📁 Estructura del proyecto

```
APIFIRST/
├── src/
│   ├── app.js          # Lógica principal de la API
│   ├── server.js       # Inicio del servidor
├── test.js             # Pruebas automatizadas
├── openapi.yaml        # Especificación OpenAPI
├── package.json
└── README.md
```

## 📌 Endpoints principales

### Usuarios

- `POST /users` → Crear usuario
- `GET /users/{id}` → Obtener usuario por ID
- `PUT /users/{id}` → Actualizar usuario por ID

### Productos

- `POST /products` → Crear producto
- `GET /products/{id}` → Obtener producto por ID
- `PUT /products/{id}` → Actualizar producto por ID
- `DELETE /products/{id}` → Eliminar producto por ID

### Otros

- `GET /hello` → Endpoint de prueba

## 📄 Documentación OpenAPI

La documentación completa de la API está disponible en:

```
http://localhost:3000/docs
```

Generada automáticamente a partir del archivo `openapi.yaml`.

## 📦 Ejemplos de uso

### 🔹 GET /hello

**curl:**
```bash
curl http://localhost:3000/hello
```

**Postman:**
- Método: GET
- URL: http://localhost:3000/hello

---

### 🔹 POST /users

**curl:**
```bash
curl -X POST http://localhost:3000/users   -H "Content-Type: application/json"   -d '{"name": "Juan", "age": 25, "email": "juan@correo.com"}'
```

**Postman:**
- Método: POST
- URL: http://localhost:3000/users
- Body (raw, JSON):
```json
{
  "name": "Juan",
  "age": 25,
  "email": "juan@correo.com"
}
```

---

### 🔹 GET /users/{id}

**curl:**
```bash
curl http://localhost:3000/users/123
```

**Postman:**
- Método: GET
- URL: http://localhost:3000/users/123

---

### 🔹 PUT /users/{id}

**curl:**
```bash
curl -X PUT http://localhost:3000/users/123   -H "Content-Type: application/json"   -d '{"name": "Juan Actualizado", "age": 26, "email": "juan.actualizado@correo.com"}'
```

**Postman:**
- Método: PUT
- URL: http://localhost:3000/users/123
- Body (raw, JSON):
```json
{
  "name": "Juan Actualizado",
  "age": 26,
  "email": "juan.actualizado@correo.com"
}
```

---

### 🔹 POST /products

**curl:**
```bash
curl -X POST http://localhost:3000/products   -H "Content-Type: application/json"   -d '{
    "name": "Producto Test",
    "description": "Descripción de prueba",
    "price": 1000,
    "category": "electronics",
    "tags": ["test"],
    "inStock": true,
    "specifications": {"color": "rojo"},
    "ratings": []
  }'
```

**Postman:**
- Método: POST
- URL: http://localhost:3000/products
- Body (raw, JSON):
```json
{
  "name": "Producto Test",
  "description": "Descripción de prueba",
  "price": 1000,
  "category": "electronics",
  "tags": ["test"],
  "inStock": true,
  "specifications": {"color": "rojo"},
  "ratings": []
}
```

---

### 🔹 GET /products/{id}

**curl:**
```bash
curl http://localhost:3000/products/456
```

**Postman:**
- Método: GET
- URL: http://localhost:3000/products/456

---

### 🔹 PUT /products/{id}

**curl:**
```bash
curl -X PUT http://localhost:3000/products/456   -H "Content-Type: application/json"   -d '{
    "name": "Producto Actualizado",
    "description": "Nueva descripción",
    "price": 1200,
    "category": "electronics",
    "tags": ["actualizado"],
    "inStock": false,
    "specifications": {"color": "azul"},
    "ratings": []
  }'
```

**Postman:**
- Método: PUT
- URL: http://localhost:3000/products/456
- Body (raw, JSON):
```json
{
  "name": "Producto Actualizado",
  "description": "Nueva descripción",
  "price": 1200,
  "category": "electronics",
  "tags": ["actualizado"],
  "inStock": false,
  "specifications": {"color": "azul"},
  "ratings": []
}
```

---

### 🔹 DELETE /products/{id}

**curl:**
```bash
curl -X DELETE http://localhost:3000/products/456
```

**Postman:**
- Método: DELETE
- URL: http://localhost:3000/products/456
