
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { presupuestoService } from '../../services/presupuestoService'
import { repuestoService } from '../../services/repuestoService'
import { ordenService } from '../../services/ordenService'
import type { Orden } from '../../types/orden'
import type { Repuesto } from '../../types/repuesto'
import type { Presupuesto } from '../../types/presupuesto'

interface ItemFormulario {
  repuestoId: number
  cantidad: number
}

export default function PresupuestoForm() {
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])

  const [ordenId, setOrdenId] = useState(0)
  const [manoDeObra, setManoDeObra] = useState(0)
  const [items, setItems] = useState<ItemFormulario[]>([])

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    Promise.all([
      ordenService.listar({ page: 1, limit: 100 }),
      repuestoService.listar({ page: 1, limit: 100 }),
      presupuestoService.listar({ page: 1, limit: 100 }),
    ])
      .then(([resultadoOrdenes, resultadoRepuestos, resultadoPresupuestos]) => {
        if (!activo) return
        setOrdenes(resultadoOrdenes.items)
        setRepuestos(resultadoRepuestos.items)
        setPresupuestos(resultadoPresupuestos.items)
      })
      .catch(() => {
        if (activo) setError('No se pudieron cargar los datos del formulario.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  const ordenesDisponibles = ordenes.filter(
    (orden) =>
      orden.estado !== 'cancelada' &&
      !presupuestos.some((presupuesto) => presupuesto.ordenId === orden.id)
  )

  const agregarRepuesto = () => {
    setItems((actuales) => [
      ...actuales,
      { repuestoId: 0, cantidad: 1 },
    ])
  }

  const actualizarItem = (
    indice: number,
    campo: keyof ItemFormulario,
    valor: number
  ) => {
    setItems((actuales) =>
      actuales.map((item, i) =>
        i === indice ? { ...item, [campo]: valor } : item
      )
    )
  }

  const quitarRepuesto = (indice: number) => {
    setItems((actuales) => actuales.filter((_, i) => i !== indice))
  }

  const totalRepuestos = items.reduce((total, item) => {
    const repuesto = repuestos.find((r) => r.id === item.repuestoId)
    return total + (repuesto?.costo ?? 0) * item.cantidad
  }, 0)

  const total = manoDeObra + totalRepuestos

  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (guardando) return

    setError('')

    if (!ordenesDisponibles.some((orden) => orden.id === ordenId)) {
      setError('Seleccioná una orden válida sin presupuesto.')
      return
    }

    if (!Number.isFinite(manoDeObra) || manoDeObra < 0) {
      setError('La mano de obra debe ser mayor o igual a cero.')
      return
    }

    if (items.some((item) =>
      !Number.isInteger(item.cantidad) ||
      item.cantidad < 1 ||
      !repuestos.some((r) => r.id === item.repuestoId && r.activo)
    )) {
      setError('Revisá los repuestos y las cantidades ingresadas.')
      return
    }

    if (new Set(items.map((item) => item.repuestoId)).size !== items.length) {
      setError('No podés agregar el mismo repuesto dos veces.')
      return
    }

    if (items.some((item) => {
      const repuesto = repuestos.find((r) => r.id === item.repuestoId)
      return !repuesto || item.cantidad > repuesto.stock
    })) {
      setError('La cantidad de un repuesto supera el stock disponible.')
      return
    }

    setGuardando(true)

    try {
      await presupuestoService.crear({
        ordenId,
        manoDeObra,
        items: items.map((item, indice) => {
          const repuesto = repuestos.find((r) => r.id === item.repuestoId)!

          return {
            id: indice + 1,
            repuestoId: item.repuestoId,
            cantidad: item.cantidad,
            costoUnitario: repuesto.costo,
          }
        }),
        total,
        estado: 'pendiente',
        createdAt: new Date().toISOString(),
      })

      navigate('/presupuestos')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear el presupuesto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p>Cargando formulario de presupuesto...</p>

  return (
    <section>
      <h1>Nuevo presupuesto</h1>

      <form onSubmit={guardar} className="form">
        <label>
          Orden de trabajo
          <select
            value={ordenId}
            onChange={(e) => setOrdenId(Number(e.target.value))}
            required
          >
            <option value={0}>Seleccionar una orden</option>
            {ordenesDisponibles.map((orden) => (
              <option key={orden.id} value={orden.id}>
                Orden #{orden.id} - {orden.codigo}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mano de obra ($)
          <input
            type="number"
            min="0"
            step="0.01"
            value={manoDeObra}
            onChange={(e) => setManoDeObra(e.target.valueAsNumber)}
            required
          />
        </label>

        <h2>Repuestos incluidos</h2>

        {items.map((item, indice) => (
          <div key={indice}>
            <label>
              Repuesto
              <select
                value={item.repuestoId}
                onChange={(e) =>
                  actualizarItem(indice, 'repuestoId', Number(e.target.value))
                }
              >
                <option value={0}>Seleccionar repuesto</option>
                {repuestos.filter((r) => r.activo).map((repuesto) => (
                  <option key={repuesto.id} value={repuesto.id}>
                    {repuesto.nombre} - ${repuesto.costo}
                    {' '} (Stock: {repuesto.stock})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Cantidad
              <input
                type="number"
                min="1"
                step="1"
                value={item.cantidad}
                onChange={(e) =>
                  actualizarItem(indice, 'cantidad', e.target.valueAsNumber)
                }
              />
            </label>

            <button type="button" onClick={() => quitarRepuesto(indice)}>
              Quitar repuesto
            </button>
          </div>
        ))}

        <button type="button" onClick={agregarRepuesto}>
          Agregar repuesto
        </button>

        <h2>Total: ${Number.isFinite(total) ? total.toLocaleString('es-AR') : '—'}</h2>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear presupuesto'}
        </button>

        <Link to="/presupuestos">Cancelar</Link>
      </form>
    </section>
  )
}
