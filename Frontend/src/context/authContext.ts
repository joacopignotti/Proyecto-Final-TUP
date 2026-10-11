import { createContext } from 'react'
import type { Usuario } from '../types/api'

export interface AuthContextValue {
  usuario: Usuario | null
  iniciarSesion: (email: string, password: string) => Promise<void>
  cerrarSesion: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
