
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { repuestoService } from '../../services/repuestoService'
import type { NuevoRepuesto } from '../../types/repuesto'

const formularioInicial: NuevoRepuesto = {
  codigo: '',
  nombre: '',
  costo: 0,
  stock: 0,
  activo: true,
}

export default function RepuestoForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState<NuevoRepuesto>(formularioInicial)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (
    campo: keyof NuevoRepuesto,
    valor: string | number | boolean
  ) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (cargando) return

    setError('')

    if (!form.codigo.trim() || !form.nombre.trim()) {
      setError('El código y el nombre son obligatorios.')
      return
    }

    if (!Number.isFinite(form.costo) || form.costo < 0) {
      setError('El costo debe ser un número válido mayor o igual a cero.')
      return
    }

    if (!Number.isInteger(form.stock) || form.stock < 0) {
      setError('El stock debe ser un número entero mayor o igual a cero.')
      return
    }

    setCargando(true)

    try {
      await repuestoService.crear({
        ...form,
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
      })

      navigate('/presupuestos/repuestos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el repuesto.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section>
      <h1>Registrar repuesto</h1>

      <form onSubmit={enviar} className="form">
        <label>
          Código
          <input
            value={form.codigo}
            onChange={(e) => cambiar('codigo', e.target.value)}
            required
          />
        </label>

        <label>
          Nombre
          <input
            value={form.nombre}
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
            value={form.costo}
            onChange={(e) => cambiar('costo', e.target.valueAsNumber)}
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => cambiar('stock', e.target.valueAsNumber)}
            required
          />
        </label>

        <label>
          Estado del repuesto
          <select
            value={form.activo ? 'true' : 'false'}
            onChange={(e) => cambiar('activo', e.target.value === 'true')}
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

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar repuesto'}
        </button>

        <Link to="/presupuestos/repuestos">Cancelar</Link>
      </form>
    </section>
  )
}
