import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import Login from '../pages/auth/Login'
import RecuperarPassword from '../pages/auth/RecuperarPassword'
import Registro from '../pages/auth/Registro'
import Home from '../pages/home/Home'
import EnConstruccion from '../pages/modulos/EnConstruccion'
import Perfil from '../pages/perfil/Perfil'
import Seguimiento from '../pages/seguimiento/Seguimiento'
import { MODULOS } from './modulos'
import { PAGINAS_MODULO } from './paginasModulos'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/seguimiento" element={<Seguimiento />} />
      <Route path="/seguimiento/:codigo" element={<Seguimiento />} />

      {/* Con sesión */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Un bloque por módulo, protegido por rol. La pantalla de cada uno se
              registra en router/paginasModulos.ts; si falta, se ve EnConstruccion. */}
          {MODULOS.map((m) => {
            const Pagina = PAGINAS_MODULO[m.path] ?? EnConstruccion
            return (
              <Route key={m.path} element={<ProtectedRoute roles={m.roles} />}>
                <Route path={`${m.path}/*`} element={<Pagina />} />
              </Route>
            )
          })}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
