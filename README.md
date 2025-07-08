# Backend Piscinas API

API RESTful para la gestión de piscinas y usuarios usando Node.js, TypeScript, MongoDB/Mongoose y AWS S3.

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores según tu entorno. A continuación, una descripción de cada variable:

| Variable                 | Descripción                                                      |
|--------------------------|------------------------------------------------------------------|
| `PORT`                   | Puerto donde correrá la API (por defecto: 4000)                  |
| `MONGODB_URI`            | Cadena de conexión a MongoDB                                      |
| `JWT_SECRET`             | Secreto para generación y validación de JWT                      |
| `AWS_ACCESS_KEY_ID`      | Access Key ID de tu usuario IAM en AWS                           |
| `AWS_SECRET_ACCESS_KEY`  | Secret Access Key de tu usuario IAM en AWS                       |
| `AWS_REGION`             | Región AWS donde está el bucket S3 (ej: us-east-1)               |
| `AWS_S3_BUCKET`          | Nombre del bucket S3 donde se almacenarán archivos               |
| `SMTP_HOST`              | Host SMTP para recuperación de contraseña                        |
| `SMTP_PORT`              | Puerto SMTP                                                      |
| `SMTP_USER`              | Usuario/correo SMTP                                              |
| `SMTP_PASS`              | Contraseña SMTP                                                  |
| `FRONTEND_URL`           | URL del frontend para enlaces de recuperación de contraseña      |



## Scripts

- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática.
- `npm run build`: Compila el proyecto TypeScript a JavaScript (carpeta `dist/`).
- `npm start`: Ejecuta el servidor usando el código compilado.
- `npm test`: Ejecuta todos los tests automáticos.

## Estructura de Carpetas

```
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
    app.ts
    server.ts
  dist/
```

## Stack Tecnológico
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- AWS S3 (almacenamiento de archivos)
- JWT (autenticación)
- Jest + Supertest (tests automáticos)
- Swagger (documentación interactiva)

## Configuración en AWS

1. **Usuario IAM**: Crea un usuario IAM con acceso programático y asigna permisos mínimos para S3 (ejemplo: `AmazonS3FullAccess` o una política personalizada solo para el bucket).
2. **Bucket S3**: Crea un bucket S3 en la región indicada en `AWS_REGION` y coloca el nombre en `AWS_S3_BUCKET`.
3. **Credenciales**: Copia el `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY` al archivo `.env`.
4. **Región**: Usa una región cercana a tus usuarios (ej: `us-east-1`).

> Si usas otros servicios AWS, agrega los permisos correspondientes.

## Pruebas

Para ejecutar los tests automáticos:

```bash
npm test
```

Esto ejecutará Jest y Supertest sobre la API. Asegúrate de tener una base de datos de pruebas configurada en tu `.env` para evitar sobrescribir datos reales.

## Autor
Erik Zerpa