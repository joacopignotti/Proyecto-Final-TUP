import type { LoginResult, Usuario } from '../types/api'
import { request } from './apiClient'

export const login = async (email: string, password: string) =>
  (await request<LoginResult>('/auth/login', { method: 'POST', body: { email, password } })).data!

export const register = async (data: {
  nombre: string
  apellido: string
  email: string
  password: string
}) => (await request<Usuario>('/auth/register', { method: 'POST', body: data })).message

export const recuperarPassword = async (email: string) =>
  (await request<null>('/auth/recuperar-password', { method: 'POST', body: { email } })).message
