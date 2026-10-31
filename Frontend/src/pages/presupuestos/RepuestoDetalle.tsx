
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { repuestoService } from '../../services/repuestoService'
import type { Repuesto, NuevoRepuesto } from '../../types/repuesto'

export default function RepuestoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [repuesto, setRepuesto] = useState<Repuesto | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    let activo = true

    repuestoService.obtener(id)
      .then((datos) => {
        if (activo) {
          setRepuesto(datos)
        }
      })
      .catch(() => {
        if (activo) {
          setError('No se pudo cargar el repuesto.')
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })

    return () => {
      activo = false
    }
  }, [id])

  const cambiar = (
    campo: keyof NuevoRepuesto,
    valor: string | number | boolean
  ) => {
    setRepuesto((actual) =>
      actual ? { ...actual, [campo]: valor } : null
    )
  }

  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!repuesto || guardando) return

    setError('')

    if (!repuesto.codigo.trim() || !repuesto.nombre.trim()) {
      setError('El código y el nombre son obligatorios.')
      return
    }

    if (!Number.isFinite(repuesto.costo) || repuesto.costo < 0) {
      setError('El costo debe ser un número mayor o igual a cero.')
      return
    }

    if (!Number.isInteger(repuesto.stock) || repuesto.stock < 0) {
      setError('El stock debe ser un entero mayor o igual a cero.')
      return
    }

    setGuardando(true)

    try {
      await repuestoService.actualizar(repuesto.id, {
        codigo: repuesto.codigo.trim(),
        nombre: repuesto.nombre.trim(),
        costo: repuesto.costo,
        stock: repuesto.stock,
        activo: repuesto.activo,
      })

      navigate('/presupuestos/repuestos')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el repuesto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!repuesto || guardando) return

    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este repuesto?'
    )

    if (!confirmar) return

    setGuardando(true)
    setError('')

    try {
      await repuestoService.eliminar(repuesto.id)
      navigate('/presupuestos/repuestos')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el repuesto.'
      )
    } finally {
      setGuardando(false)
    }
  }

  if (!id) {
    return (
      <section>
        <p role="alert">No se indicó un repuesto válido.</p>
        <Link to="/presupuestos/repuestos">
          Volver al listado
        </Link>
      </section>
    )
  }

  if (cargando) {
    return <p>Cargando repuesto...</p>
  }

  if (!repuesto) {
    return (
      <section>
        <p role="alert">
          {error || 'Repuesto no encontrado.'}
        </p>
        <Link to="/presupuestos/repuestos">
          Volver al listado
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Detalle del repuesto #{repuesto.id}</h1>

      <form onSubmit={guardar} className="form">
        <label>
          Código
          <input
            value={repuesto.codigo}
            onChange={(e) => cambiar('codigo', e.target.value)}
            required
          />
        </label>

        <label>
          Nombre
          <input
            value={repuesto.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            required
          />
        </label>

        <label>
          Costo unitario
          <input
            type="number"
            min="0"
            step="0.01"
            value={repuesto.costo}
            onChange={(e) =>
              cambiar('costo', e.target.valueAsNumber)
            }
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            step="1"
            value={repuesto.stock}
            onChange={(e) =>
              cambiar('stock', e.target.valueAsNumber)
            }
            required
          />
        </label>

        <label>
          Estado del repuesto
          <select
            value={repuesto.activo ? 'true' : 'false'}
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
          Eliminar repuesto
        </button>

        <Link to="/presupuestos/repuestos">
          Volver al listado
        </Link>
      </form>
    </section>
  )
}
