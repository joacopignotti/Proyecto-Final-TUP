import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import type { Rol } from '../types/api'

/** Exige sesión y, si se indican roles, que el usuario tenga alguno de ellos. */
export function ProtectedRoute({ roles }: { roles?: Rol[] }) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />

  return <Outlet />
}
