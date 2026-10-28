
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ordenService } from '../../services/ordenService'
import { equipoService } from '../../services/equipoService'
import type { Equipo } from '../../types/equipo'
import type { NuevaOrden } from '../../types/orden'

const formularioInicial: NuevaOrden = {
  equipoId: 0,
  tecnicoId: null,
  estado: 'recibido',
  diagnostico: '',
  fallas: '',
  trabajoRealizado: '',
  fechaIngreso: new Date().toISOString().slice(0, 10),
  fechaEntrega: null,
  bitacora: [],
}

export default function OrdenForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState<NuevaOrden>(formularioInicial)
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    equipoService.listar({ limit: 100 })
      .then((res) => setEquipos(res.items))
      .catch(() => setError('No se pudieron cargar los equipos.'))
  }, [])

  const cambiar = (campo: keyof NuevaOrden, valor: string | number | null) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
  }

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      await ordenService.crear(form)
      navigate('/ordenes')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la orden.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section>
      <h1>Registrar orden de trabajo</h1>

      <form onSubmit={enviar} className="form">
        <label>
          Equipo
          <select
            value={form.equipoId}
            onChange={(e) => cambiar('equipoId', Number(e.target.value))}
            required
          >
            <option value={0} disabled>Seleccionar equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.tipo} {equipo.marca} {equipo.modelo} - ID: {equipo.id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estado inicial
          <select
            value={form.estado}
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
            value={form.fallas ?? ''}
            onChange={(e) => cambiar('fallas', e.target.value)}
          />
        </label>

        <label>
          Diagnóstico
          <textarea
            value={form.diagnostico ?? ''}
            onChange={(e) => cambiar('diagnostico', e.target.value)}
          />
        </label>

        <label>
          Técnico ID (opcional)
          <input
            type="number"
            min="1"
            value={form.tecnicoId ?? ''}
            onChange={(e) =>
              cambiar('tecnicoId', e.target.value ? Number(e.target.value) : null)
            }
          />
        </label>

        <label>
          Fecha de ingreso
          <input
            type="date"
            value={form.fechaIngreso ?? ''}
            onChange={(e) => cambiar('fechaIngreso', e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="aviso aviso--error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Registrar orden'}
        </button>

        <Link to="/ordenes">Cancelar</Link>
      </form>
    </section>
  )
}
