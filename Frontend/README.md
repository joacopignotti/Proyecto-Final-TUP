# Frontend

React 19 + TypeScript + Vite. Consume la API en `/api/v1` (en desarrollo, el proxy de `vite.config.ts` la redirige a `http://localhost:3000`).

```
src/
  components/layout/   Header, Menú, Footer y Layout
  context/             sesión simulada (AuthProvider + useAuth)
  pages/               una carpeta por módulo
  router/              rutas, protección por rol y catálogo de módulos
  services/            apiClient y un service por entidad
  types/               interfaces que reflejan las respuestas de la API
```

## Uso

```bash
cp sample.env .env     # opcional: el valor por defecto alcanza en local
npm install
npm run dev            # http://localhost:5173
npm run lint
npm run build
```

Se necesita el backend corriendo. Usuarios de prueba y convenciones en el [README de la raíz](../README.md).
