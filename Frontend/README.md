# Frontend

React 19 + TypeScript + Vite. Consume la API en `/api/v1` (en desarrollo, el proxy de `vite.config.ts` la redirige a `http://localhost:3000`).

```
src/
  components/layout/   Header, Menú, Footer y Layout
  components/ui/       ListaPaginada, DataTable, buscador, paginado y exportación
  context/             sesión simulada (AuthProvider + useAuth)
  hooks/               usePaginatedList
  pages/               una carpeta por módulo (con sus rutas)
  router/              rutas, protección por rol, catálogo de módulos y paginasModulos
  services/            apiClient, crudService y un service por entidad
  types/               interfaces que reflejan las respuestas de la API
```

## Uso

```bash
cp sample.env .env     # opcional: el valor por defecto alcanza en local
npm install
npm run dev            # http://localhost:5173
npm run lint
npm test
npm run build
```

Se necesita el backend corriendo. Usuarios de prueba y convenciones en el [README de la raíz](../README.md).
