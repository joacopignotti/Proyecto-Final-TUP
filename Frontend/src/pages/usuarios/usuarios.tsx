import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'

export type Rol = 'administrador' | 'tecnico'

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: Rol
  activo: boolean
}

const ROLES: Rol[] = ['administrador', 'tecnico']

const ETIQUETAS_ROL: Record<Rol, string> = {
  administrador: 'Administrador',
  tecnico: 'Técnico',
}

const API_BASE = '/api/v1'

const getAuthHeaders = (): HeadersInit => {
  const tokenGuardado =
    localStorage.getItem('token') ??
    localStorage.getItem('accessToken') ??
    localStorage.getItem('taller.token')

  return {
    'Content-Type': 'application/json',
    ...(tokenGuardado ? { Authorization: `Bearer ${tokenGuardado}` } : {}),
  }
}

const extraerListaUsuarios = (body: unknown): Usuario[] => {
  if (Array.isArray(body)) return body as Usuario[]
  if (body && typeof body === 'object' && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: Usuario[] }).data
  }
  return []
}

export default function UsuariosHome() {
  const { usuario } = useAuth()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [rolesSeleccionados, setRolesSeleccionados] = useState<Record<number, Rol>>({})
  const [cargando, setCargando] = useState(true)
  const [guardandoId, setGuardandoId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mensajeOk, setMensajeOk] = useState<string | null>(null)

  const esAdmin = usuario?.rol === 'administrador'

  useEffect(() => {
    const controller = new AbortController()

    const cargarUsuarios = async () => {
      setCargando(true)
      setError(null)

      try {
        const resp = await fetch(`${API_BASE}/usuarios`, {
          headers: getAuthHeaders(),
          signal: controller.signal,
        })
        const body = await resp.json().catch(() => null)

        if (!resp.ok) {
          throw new Error(
            body && typeof body.message === 'string'
              ? body.message
              : 'No se pudieron cargar los usuarios.'
          )
        }

        const lista = extraerListaUsuarios(body)
        setUsuarios(lista)

        const mapaRoles: Record<number, Rol> = {}
        for (const item of lista) {
          mapaRoles[item.id] = item.rol
        }
        setRolesSeleccionados(mapaRoles)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError((err as Error).message || 'Error al cargar usuarios.')
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    void cargarUsuarios()
    return () => controller.abort()
  }, [])

  if (!usuario) return null

  const handleGuardarRol = async (u: Usuario) => {
    if (!esAdmin) return

    const nuevoRol = rolesSeleccionados[u.id] ?? u.rol
    setGuardandoId(u.id)
    setError(null)
    setMensajeOk(null)

    try {
      const resp = await fetch(`${API_BASE}/usuarios/${u.id}/rol`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rol: nuevoRol }),
      })
      const body = await resp.json().catch(() => null)

      if (!resp.ok) {
        throw new Error(
          body && typeof body.message === 'string'
            ? body.message
            : 'No se pudo actualizar el rol.'
        )
      }

      setUsuarios((prev) =>
        prev.map((item) => (item.id === u.id ? { ...item, rol: nuevoRol } : item))
      )
      setMensajeOk(
        `Rol de ${u.nombre} ${u.apellido} actualizado a ${ETIQUETAS_ROL[nuevoRol]}.`
      )
    } catch (err) {
      setError((err as Error).message || 'Error al guardar el rol.')
    } finally {
      setGuardandoId(null)
    }
  }

  return (
    <>
      <h1>Hola, {usuario.nombre}</h1>

      {cargando && <p className="aviso">Cargando usuarios…</p>}
      {error && <p className="aviso aviso--error">{error}</p>}
      {mensajeOk && <p className="aviso aviso--ok">{mensajeOk}</p>}

      {!cargando && (
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>Nombre y apellido</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Rol actual</th>
                <th>Asignar rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tabla__vacia">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => {
                  const rolElegido = rolesSeleccionados[u.id] ?? u.rol
                  const sinCambios = rolElegido === u.rol
                  const ocupada = guardandoId === u.id || !esAdmin

                  return (
                    <tr key={u.id}>
                      <td>
                        {u.nombre} {u.apellido}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                      <td>{ETIQUETAS_ROL[u.rol] ?? u.rol}</td>
                      <td>
                        <select
                          aria-label={`Rol de ${u.nombre} ${u.apellido}`}
                          value={rolElegido}
                          disabled={ocupada}
                          onChange={(e) => {
                            const valor = e.target.value as Rol
                            setMensajeOk(null)
                            setError(null)
                            setRolesSeleccionados((prev) => ({
                              ...prev,
                              [u.id]: valor,
                            }))
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ETIQUETAS_ROL[r]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn"
                          disabled={ocupada || sinCambios}
                          onClick={() => void handleGuardarRol(u)}
                        >
                          {guardandoId === u.id ? 'Guardando…' : 'Guardar'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}