
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ordenService } from '../../services/ordenService'
import type { Orden, NuevaOrden } from '../../types/orden'

export default function OrdenDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [orden, setOrden] = useState<Orden | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    ordenService.obtener(id)
      .then(setOrden)
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setCargando(false))
  }, [id])

  const cambiar = (campo: keyof NuevaOrden, valor: string | number | null) => {
    setOrden((actual) => actual ? { ...actual, [campo]: valor } : null)
  }

  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!orden) return

    setGuardando(true)
    setError('')

    const { id, codigo, bitacora, ...datos } = orden

    try {
      await ordenService.actualizar(id, datos)
      navigate('/ordenes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la orden.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!orden) return

    const confirmar = window.confirm('¿Estás seguro de eliminar esta orden?')
    if (!confirmar) return

    try {
      await ordenService.eliminar(orden.id)
      navigate('/ordenes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la orden.')
    }
  }

  if (cargando) return <p>Cargando orden...</p>

  if (!orden) {
    return (
      <section>
        <p role="alert">{error || 'Orden no encontrada.'}</p>
        <Link to="/ordenes">Volver al listado</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Detalle de la orden {orden.codigo}</h1>

      <form onSubmit={guardar} className="form">
        <label>
          Equipo ID
          <input
            type="number"
            min="1"
            value={orden.equipoId}
            onChange={(e) => cambiar('equipoId', Number(e.target.value))}
            required
          />
        </label>

        <label>
          Técnico ID
          <input
            type="number"
            min="1"
            value={orden.tecnicoId ?? ''}
            onChange={(e) =>
              cambiar('tecnicoId', e.target.value ? Number(e.target.value) : null)
            }
          />
        </label>

        <label>
          Estado
          <select
            value={orden.estado}
            onChange={(e) => cambiar('estado', e.target.value)}
          >
            <option value="recibido">Recibido</option>
            <option value="en_diagnostico">En diagnóstico</option>
            <option value="esperando_aprobacion">Esperando aprobación</option>
            <option value="en_taller">En taller</option>
            <option value="finalizado">Finalizado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>

        <label>
          Fallas informadas
          <textarea
            value={orden.fallas}
            onChange={(e) => cambiar('fallas', e.target.value)}
          />
        </label>

        <label>
          Diagnóstico
          <textarea
            value={orden.diagnostico}
            onChange={(e) => cambiar('diagnostico', e.target.value)}
          />
        </label>

        <label>
          Trabajo realizado
          <textarea
            value={orden.trabajoRealizado}
            onChange={(e) => cambiar('trabajoRealizado', e.target.value)}
          />
        </label>

        <label>
          Fecha de ingreso
          <input
            type="date"
            value={orden.fechaIngreso?.slice(0, 10) ?? ''}
            onChange={(e) => cambiar('fechaIngreso', e.target.value)}
            required
          />
        </label>

        <label>
          Fecha de entrega
          <input
            type="date"
            value={orden.fechaEntrega?.slice(0, 10) ?? ''}
            onChange={(e) => cambiar('fechaEntrega', e.target.value || null)}
          />
        </label>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button type="button" onClick={eliminar} disabled={guardando}>
          Eliminar orden
        </button>

        <Link to="/ordenes">Volver al listado</Link>
      </form>

      <h2>Historial de la orden</h2>

      {orden.bitacora.length === 0 ? (
        <p>Esta orden todavía no tiene movimientos registrados.</p>
      ) : (
        <ul>
          {orden.bitacora.map((entrada) => (
            <li key={entrada.id}>
              <strong>{new Date(entrada.fecha).toLocaleString('es-AR')}</strong>
              <p>{entrada.descripcion}</p>
              <small>Usuario ID: {entrada.usuarioId}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
