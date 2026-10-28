
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clienteService } from '../../services/clienteService'
import type { Cliente, NuevoCliente } from '../../types/cliente'

export default function ClienteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    clienteService.obtener(id)
      .then(setCliente)
      .catch(() => setError('No se pudo cargar el cliente.'))
      .finally(() => setCargando(false))
  }, [id])

  const cambiar = (campo: keyof NuevoCliente, valor: string | boolean) => {
    setCliente((actual) =>
      actual ? { ...actual, [campo]: valor } : null
    )
  }

  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!cliente) return

    setGuardando(true)
    setError('')

    const { id, createdAt, ...datos } = cliente

    try {
      await clienteService.actualizar(id, datos)
      navigate('/clientes')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el cliente.'
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!cliente) return

    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este cliente?'
    )

    if (!confirmar) return

    try {
      await clienteService.eliminar(cliente.id)
      navigate('/clientes')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el cliente.'
      )
    }
  }

  if (cargando) {
    return <p>Cargando cliente...</p>
  }

  if (!cliente) {
    return (
      <section>
        <p role="alert">
          {error || 'Cliente no encontrado.'}
        </p>
        <Link to="/clientes">Volver al listado</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Detalle del cliente #{cliente.id}</h1>

      <form onSubmit={guardar} className="form">
        <label>
          Nombre
          <input
            value={cliente.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            required
          />
        </label>

        <label>
          Apellido
          <input
            value={cliente.apellido}
            onChange={(e) => cambiar('apellido', e.target.value)}
            required
          />
        </label>

        <label>
          DNI
          <input
            value={cliente.dni}
            onChange={(e) => cambiar('dni', e.target.value)}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            value={cliente.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={cliente.email}
            onChange={(e) => cambiar('email', e.target.value)}
            required
          />
        </label>

        <label>
          Estado del cliente
          <select
            value={cliente.activo ? 'true' : 'false'}
            onChange={(e) =>
              cambiar('activo', e.target.value === 'true')
            }
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </label>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button
          type="button"
          onClick={eliminar}
          disabled={guardando}
        >
          Eliminar cliente
        </button>

        <Link to="/clientes">Volver al listado</Link>
      </form>
    </section>
  )
}

