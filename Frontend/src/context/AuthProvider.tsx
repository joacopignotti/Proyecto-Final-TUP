import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { TOKEN_KEY } from '../services/apiClient'
import * as authService from '../services/authService'
import type { Usuario } from '../types/api'
import { AuthContext } from './authContext'

const STORAGE_KEY = 'taller.sesion'

const leerSesion = (): Usuario | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Usuario) : null
  } catch {
    return null
  }
}

/** Sesión simulada: guarda el usuario y el token devueltos por el mock de /auth/login. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerSesion)

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const resultado = await authService.login(email, password)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.usuario))
    localStorage.setItem(TOKEN_KEY, resultado.token)
    setUsuario(resultado.usuario)
  }, [])

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUsuario(null)
  }, [])

  const value = useMemo(
    () => ({ usuario, iniciarSesion, cerrarSesion }),
    [usuario, iniciarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
