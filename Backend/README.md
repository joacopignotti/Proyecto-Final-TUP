# Backend

API REST con Node.js, Express 5 y TypeScript. Por ahora responde con datos mock; la estructura está pensada para pasar a Sequelize + base de datos sin tocar el front.

```
src/
  config/        variables de entorno (env.ts)
  routes/v1/     un router por entidad, registrados en index.ts
  controllers/   leen la request y responden
  services/      lógica de negocio (sobre los repositorios)
  repositories/  acceso a datos (hoy en memoria, mañana Sequelize)
  models/        interfaces TypeScript de cada entidad
  mocks/         datos de ejemplo
  middlewares/   notFound y errorHandler
  utils/         apiResponse, httpError, paginate y la base del CRUD
                 (memoryRepository, crudService, crudController, crudRouter)
```

## Uso

```bash
cp sample.env .env
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Endpoints actuales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Estado de la API |
| POST | `/api/v1/auth/login` | Login simulado (`{ email, password }`) |
| POST | `/api/v1/auth/register` | Alta simulada, no guarda nada |
| POST | `/api/v1/auth/recuperar-password` | Simulado, no envía mails |
| GET, POST, PUT/PATCH, DELETE | `/api/v1/clientes`, `/equipos`, `/ordenes`, `/repuestos`, `/presupuestos` | CRUD de cada entidad (listado con `page`, `limit`, `sortBy`, `order`, `q` y filtros). Los datos viven en memoria hasta reiniciar el servidor |

Las pautas para sumar entidades y el formato de respuesta están en el [README de la raíz](../README.md).
