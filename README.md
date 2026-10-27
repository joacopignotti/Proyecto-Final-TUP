# Sistema de Gestión Integral para Talleres

Proyecto Final — Tecnicatura Universitaria en Programación (UTN FRBB) · **Grupo 2**

Plataforma web para administrar talleres de reparación multirubro: desde que ingresa un equipo hasta que se entrega al cliente. El cliente puede consultar el estado de su reparación con un código de seguimiento, sin registrarse.

> **Estado:** prototipo navegable (no funcional). La API responde con **datos mock** en memoria, sin base de datos. La estructura está pensada para reemplazar los mocks por Sequelize + MySQL/PostgreSQL sin tocar el front.

## Equipo

| Integrante | Rama |
|---|---|
| Aguero, Lucía | `LuciaAguero` |
| Barrera, Mateo | `MateoBarrera` |
| Pignotti, Joaquín | `JoaquinPignotti` |
| Sinigaglia, Franco | `FrancoSinigaglia` |

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + React Router (tests con Vitest) |
| Backend | Node.js + Express 5 + TypeScript |
| Datos (futuro) | Sequelize + MySQL / PostgreSQL |
| Deploy | Render (el backend sirve también el build del front) |
| Calidad | ESLint en front y back, tests en el front |

## Estructura del repositorio

```
Proyecto-Final-TUP/
├── Backend/    API REST (ver Backend/README.md)
├── Frontend/   SPA React (ver Frontend/README.md)
├── docs/       modelo de datos y tickets
└── package.json  scripts de build/start para el deploy
```

## Cómo levantarlo en local

Requisitos: Node.js 20.19+ (o 22.12+) y npm.

```bash
# 1) Backend  → http://localhost:3000
cd Backend
cp sample.env .env
npm install
npm run dev

# 2) Frontend → http://localhost:5173   (en otra terminal)
cd Frontend
cp sample.env .env      # opcional: el valor por defecto alcanza
npm install
npm run dev
```

En desarrollo, Vite redirige `/api` al backend (`vite.config.ts`), así que no hace falta configurar CORS en local.

Otros comandos (en `Backend/` y en `Frontend/`): `npm run lint` y `npm run build`. En `Frontend/` también `npm test`.

### Variables de entorno

Los `.env` **no se suben al repo**; cada carpeta tiene su `sample.env` para copiar.

| Archivo | Variable | Descripción |
|---|---|---|
| `Backend/sample.env` | `PORT` | Puerto de la API (3000) |
| | `NODE_ENV` | `development` / `production` |
| | `CORS_ORIGIN` | Origen del front permitido. Vacío = cualquiera (solo desarrollo) |
| `Frontend/sample.env` | `VITE_API_URL` | Base de la API (`/api/v1`) |

## Usuarios de prueba

Contraseña mock para todos: **`taller123`**

| Email | Rol |
|---|---|
| `admin@taller.com` | Administrador |
| `recepcion@taller.com` | Recepcionista |
| `tecnico@taller.com` | Técnico |

El menú y las rutas se filtran por rol (`Frontend/src/router/modulos.ts`).

## Deploy

- **App (front + API):** _completar con la URL de Render_
- Render ejecuta `npm run build` y `npm start` de la raíz: se compila el front, se compila el back y Express sirve el build de Vite.

## Convenciones de la API

Prefijo: `/api/v1`. **Toda** respuesta tiene la misma forma:

```json
// Éxito (200 / 201)
{ "success": true, "message": "OK", "data": { } }

// Listado paginado
{ "success": true, "message": "OK", "data": [ ],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }

// Error (4xx / 5xx)
{ "success": false, "message": "Recurso no encontrado", "data": null }
```

Códigos usados: `200`, `201`, `400` (datos inválidos), `401` (credenciales), `403` (sin permiso), `404`, `409` (duplicado), `500`.

### Endpoints por entidad

Cada entidad expone el mismo CRUD:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/<entidad>?page=1&limit=10&sortBy=id&order=desc&q=texto` | Listado ordenado, paginado y filtrado |
| GET | `/api/v1/<entidad>/:id` | Todos los datos de un registro |
| POST | `/api/v1/<entidad>` | Alta (simulada) |
| PUT / PATCH | `/api/v1/<entidad>/:id` | Modificación (simulada) |
| DELETE | `/api/v1/<entidad>/:id` | Baja (simulada) |

Parámetros del listado: `page` (desde 1), `limit` (máx. 100), `sortBy` (campo), `order` (`asc`/`desc`) y `q` (texto buscado en los campos relevantes de la entidad).

## Cómo trabajar sobre una entidad

La base compartida ya está armada: cada entidad (clientes, equipos, órdenes, repuestos y presupuestos) tiene sus archivos creados, su ruta registrada y un registro de ejemplo. Cada integrante trabaja **solo en los archivos de su entidad**.

Capas del backend: `route → controller → service → repository (mock)`.

- Los **controllers** leen la request y responden. No tocan los datos.
- Los **services** tienen la lógica de negocio y usan el repositorio.
- Los **repositories** acceden a los datos: hoy un array en memoria (`utils/memoryRepository.ts`), mañana Sequelize con la misma interfaz. Los cambios (alta, modificación, baja) viven mientras el servidor esté levantado.

### Backend (ejemplo con `Cliente`)

| Archivo | Qué hacer |
|---|---|
| `models/Cliente.ts` | Interfaz del modelo (ya definida según [docs/modelo-de-datos.md](docs/modelo-de-datos.md)); ajustar si el modelo cambia. |
| `mocks/clientes.ts` | Sumar registros de prueba. |
| `repositories/clienteRepository.ts` | Definir en qué campos busca `?q=`. |
| `services/clienteService.ts` | CRUD estándar; agregar acá las reglas propias (DNI duplicado, relaciones con otras entidades). |
| `controllers/clienteController.ts` | Campos obligatorios, filtros habilitados y valores por defecto al crear. |
| `routes/v1/clienteRoutes.ts` | Rutas propias, si la entidad las necesita. |

Un service con una regla propia se escribe extendiendo el estándar (ejemplo real en `services/ordenService.ts`):

```ts
const base = createCrudService(clienteRepository, "Cliente");

export const clienteService: CrudService<Cliente> = {
  ...base,
  crear: (data) => {
    const existe = clienteRepository.list({ page: 1, limit: 1, order: "asc", filters: { dni: data.dni } });
    if (existe.meta.total > 0) throw new HttpError(409, "Ya existe un cliente con ese DNI");
    return base.crear(data);
  },
};
```

> Para que `?dni=` o `?estado=` funcionen como filtro, el campo tiene que estar en `filtros` del controller.

### Frontend

| Archivo | Qué hacer |
|---|---|
| `types/cliente.ts` | Espejo del modelo del back (ya creado). |
| `services/clienteService.ts` | CRUD listo (`listar`, `obtener`, `crear`, `actualizar`, `eliminar`); sumar llamadas propias si hacen falta. |
| `pages/clientes/ClientesLista.tsx` | Listado. |
| `pages/clientes/ClienteDetalle.tsx` | Detalle y edición en formulario (`/clientes/:id`). |
| `pages/clientes/ClienteForm.tsx` | Alta (`/clientes/nuevo`). |

`ClientesRoutes.tsx` ya define las tres rutas del módulo y está registrado en `router/paginasModulos.ts`, así que no hay que tocar `AppRouter.tsx`.

El listado completo (buscador, cantidad por página, tabla ordenable, paginado y exportación a Excel) lo resuelve el componente `ListaPaginada`; el módulo solo aporta su service y sus columnas:

```tsx
const estado = (c: Cliente) => (c.activo ? "Activo" : "Inactivo");

const columnas: Columna<Cliente>[] = [
  { clave: "id", titulo: "ID", ordenable: true },
  { clave: "apellido", titulo: "Apellido", ordenable: true },
  { clave: "nombre", titulo: "Nombre", ordenable: true },
  { clave: "dni", titulo: "DNI" },
  { clave: "activo", titulo: "Estado", render: estado, exportar: estado },
];

export default function ClientesLista() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Clientes</h1>
      <ListaPaginada
        service={clienteService}
        columnas={columnas}
        etiqueta="clientes"
        nombreReporte="reporte-clientes"
        onFilaClick={(c) => navigate(`/clientes/${c.id}`)}
        acciones={<Link className="btn" to="/clientes/nuevo">Nuevo cliente</Link>}
      />
    </>
  );
}
```

Piezas disponibles en `Frontend/src`:

- `components/ui/`: `ListaPaginada`, `DataTable`, `SearchBox`, `PageSizeSelect`, `Pagination`, `BotonExportar`.
- `hooks/usePaginatedList.ts`: el estado del listado, por si una pantalla necesita armar uno propio (acepta `filtros`, por ejemplo `{ estado: "recibido" }`).
- `services/crudService.ts`, `services/exportService.ts` (`descargarXlsx`) y `services/apiClient.ts` (agrega el token de la sesión y los parámetros de la query).

El reporte exportable trae hasta 100 registros, los que coinciden con la búsqueda y los filtros que se están viendo.

### Tests

```bash
cd Frontend
npm test
```

Vitest + Testing Library. Hay ejemplos en `services/*.test.ts` y `components/ui/ListaPaginada.test.tsx`; cada integrante suma tests de sus pantallas junto al archivo (`MiPantalla.test.tsx`).

## Flujo de trabajo en Git

- `main`: producción · `dev`: desarrollo · una rama por integrante (ver tabla del equipo).
- Se trabaja en la rama propia y se abre un **Pull Request a `dev`**; `dev` pasa a `main` al entregar.
- Antes de empezar cada tarea: actualizar la rama con `dev`.
- Commits chicos y descriptivos, hechos por cada integrante en su rama. El perfil de GitHub debe tener el **nombre real**.
- Un ticket del tablero por tarea, con el nombre del ticket en la rama o en el commit.

## Entregables del prototipo

- [ ] Repositorio con README (este documento + `Backend/README.md` + `Frontend/README.md`)
- [x] `sample.env` en front y back, `.env` ignorado
- [ ] Deploy de front y back conectados
- [ ] Colección de Postman exportada (`docs/postman/`)
- [ ] Diagrama entidad/relación (imagen o PDF, ver [docs/modelo-de-datos.md](docs/modelo-de-datos.md))
- [ ] Tablero de tickets con acceso para el docente — _enlace: completar_
- [ ] Una entidad completa por integrante (front + back)

## Documentación

- [Modelo de datos y reparto](docs/modelo-de-datos.md)
- [Tickets del tablero](docs/tickets.md)
- [Backend](Backend/README.md) · [Frontend](Frontend/README.md)
