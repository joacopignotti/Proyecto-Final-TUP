
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clienteService } from '../../services/clienteService'
import type { NuevoCliente } from '../../types/cliente'

const formularioInicial: NuevoCliente = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  activo: true,
}

export default function ClienteForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<NuevoCliente>(formularioInicial)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (campo: keyof NuevoCliente, valor: string | boolean) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      await clienteService.crear(form)
      navigate('/clientes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el cliente.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section>
      <h1>Registrar cliente</h1>

      <form onSubmit={enviar} className="form">
        <label>
          Nombre
          <input
            value={form.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            required
          />
        </label>

        <label>
          Apellido
          <input
            value={form.apellido}
            onChange={(e) => cambiar('apellido', e.target.value)}
            required
          />
        </label>

        <label>
          DNI
          <input
            value={form.dni}
            onChange={(e) => cambiar('dni', e.target.value)}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            value={form.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => cambiar('email', e.target.value)}
            required
          />
        </label>

        <label>
  Estado del cliente
  <select
    value={form.activo ? 'true' : 'false'}
    onChange={(e) => cambiar('activo', e.target.value === 'true')}
  >
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </select>
</label>

        {error && <p className="aviso aviso--error" role="alert">{error}</p>}

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar cliente'}
        </button>

        <Link to="/clientes">Cancelar</Link>
      </form>
    </section>
  )
}
