
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { presupuestoService } from '../../services/presupuestoService'
import type {
  Presupuesto,
  EstadoPresupuesto,
} from '../../types/presupuesto'

const rutaListado = '/presupuestos'

export default function PresupuestoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    let activo = true

    presupuestoService.obtener(id)
      .then((datos) => {
        if (activo) setPresupuesto(datos)
      })
      .catch((err) => {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo cargar el presupuesto.'
          )
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id])

  const cambiarManoDeObra = (valor: number) => {
    setPresupuesto((actual) =>
      actual ? { ...actual, manoDeObra: valor } : null
    )
  }

  const cambiarEstado = (estado: EstadoPresupuesto) => {
    setPresupuesto((actual) =>
      actual ? { ...actual, estado } : null
    )
  }

  // Calcular el costo de los repuestos.
  const totalRepuestos = presupuesto
    ? presupuesto.items.reduce(
        (total, item) =>
          total + item.cantidad * item.costoUnitario,
        0
      )
    : 0

  // Mostrar el total actualizado en pantalla.
  const total = presupuesto
    ? presupuesto.manoDeObra + totalRepuestos
    : 0

  // Guardar las modificaciones.
  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!presupuesto || guardando) return

    setError('')

    if (
      !Number.isFinite(presupuesto.manoDeObra) ||
      presupuesto.manoDeObra < 0
    ) {
      setError('La mano de obra debe ser mayor o igual a cero.')
      return
    }

    setGuardando(true)

    try {
      // El backend recalcula el total.
      // Solo enviamos mano de obra y estado.
      await presupuestoService.actualizar(presupuesto.id, {
        manoDeObra: presupuesto.manoDeObra,
        estado: presupuesto.estado,
      })

      navigate(rutaListado)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el presupuesto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  // Eliminar el presupuesto.
  const eliminar = async () => {
    if (!presupuesto || guardando) return

    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este presupuesto?'
    )

    if (!confirmar) return

    setGuardando(true)
    setError('')

    try {
      await presupuestoService.eliminar(presupuesto.id)
      navigate(rutaListado)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el presupuesto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (!id) {
    return (
      <section>
        <p role="alert">No se indicó un presupuesto válido.</p>
        <Link to={rutaListado}>Volver al listado</Link>
      </section>
    )
  }

  if (cargando) {
    return <p>Cargando presupuesto...</p>
  }

  if (!presupuesto) {
    return (
      <section>
        <p role="alert">
          {error || 'Presupuesto no encontrado.'}
        </p>
        <Link to={rutaListado}>Volver al listado</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Detalle del presupuesto #{presupuesto.id}</h1>

      <form onSubmit={guardar} className="form">
        <label>
          Orden de trabajo
          <input
            value={`Orden #${presupuesto.ordenId}`}
            readOnly
          />
        </label>

        <label>
          Fecha de creación
          <input
            value={new Date(
              presupuesto.createdAt
            ).toLocaleDateString('es-AR')}
            readOnly
          />
        </label>

        <label>
          Mano de obra ($)
          <input
            type="number"
            min="0"
            step="0.01"
            value={presupuesto.manoDeObra}
            onChange={(e) =>
              cambiarManoDeObra(e.target.valueAsNumber)
            }
            required
          />
        </label>

        <label>
          Estado del presupuesto
          <select
            value={presupuesto.estado}
            onChange={(e) =>
              cambiarEstado(
                e.target.value as EstadoPresupuesto
              )
            }
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </label>

        <h2>Repuestos incluidos</h2>

        {presupuesto.items.length === 0 ? (
          <p>Este presupuesto no incluye repuestos.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Repuesto ID</th>
                <th>Cantidad</th>
                <th>Costo unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {presupuesto.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.repuestoId}</td>
                  <td>{item.cantidad}</td>
                  <td>
                    ${item.costoUnitario.toLocaleString('es-AR')}
                  </td>
                  <td>
                    ${(item.cantidad * item.costoUnitario)
                      .toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p>
          Total de repuestos:{' '}
          ${totalRepuestos.toLocaleString('es-AR')}
        </p>

        <h2>
          Total del presupuesto:{' '}
          {Number.isFinite(total)
            ? `$${total.toLocaleString('es-AR')}`
            : 'Importe inválido'}
        </h2>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn"
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button
          type="button"
          onClick={eliminar}
          disabled={guardando}
        >
          Eliminar presupuesto
        </button>

        <Link to={rutaListado}>
          Volver al listado
        </Link>
      </form>
    </section>
  )
}
