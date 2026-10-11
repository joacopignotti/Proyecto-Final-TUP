import { useCallback, useMemo, useState, type ReactNode } from 'react'
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

/** Sesión simulada: guarda el usuario devuelto por el mock de /auth/login. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerSesion)

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const resultado = await authService.login(email, password)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.usuario))
    setUsuario(resultado.usuario)
  }, [])

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
  }, [])

  const value = useMemo(
    () => ({ usuario, iniciarSesion, cerrarSesion }),
    [usuario, iniciarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
