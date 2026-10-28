
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { equipoService } from '../../services/equipoService'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types/cliente'
import type { NuevoEquipo } from '../../types/equipo'

const formularioInicial: NuevoEquipo = {
  clienteId: 0,
  tipo: '',
  marca: '',
  modelo: '',
  identificador: '',
  condicion: '',
  observaciones: '',
}

export default function EquipoForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState<NuevoEquipo>(formularioInicial)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    clienteService.listar({ limit: 100 })
      .then((res) => setClientes(res.items))
      .catch(() => setError('No se pudieron cargar los clientes.'))
  }, [])

  const cambiar = (
    campo: keyof NuevoEquipo,
    valor: string | number,
  ) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      await equipoService.crear(form)
      navigate('/equipos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el equipo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section>
      <h1>Registrar equipo</h1>

      <form onSubmit={enviar} className="form">
        <label>
          Cliente
          <select
            value={form.clienteId}
            onChange={(e) => cambiar('clienteId', Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido} - DNI: {cliente.dni}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo de equipo
          <input
            value={form.tipo}
            onChange={(e) => cambiar('tipo', e.target.value)}
            placeholder="Ej. Celular, Notebook..."
            required
          />
        </label>

        <label>
          Marca
          <input
            value={form.marca}
            onChange={(e) => cambiar('marca', e.target.value)}
            required
          />
        </label>

        <label>
          Modelo
          <input
            value={form.modelo}
            onChange={(e) => cambiar('modelo', e.target.value)}
            required
          />
        </label>

        <label>
          Identificador
          <input
            value={form.identificador}
            onChange={(e) => cambiar('identificador', e.target.value)}
          />
        </label>

        <label>
          Condición al ingresar
          <input
            value={form.condicion}
            onChange={(e) => cambiar('condicion', e.target.value)}
          />
        </label>

        <label>
          Observaciones
          <textarea
            value={form.observaciones}
            onChange={(e) => cambiar('observaciones', e.target.value)}
          />
        </label>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar equipo'}
        </button>

        <Link to="/equipos">Cancelar</Link>
      </form>
    </section>
  )
}
