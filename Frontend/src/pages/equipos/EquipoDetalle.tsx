
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { equipoService } from '../../services/equipoService'
import type { Equipo, NuevoEquipo } from '../../types/equipo'

export default function EquipoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [equipo, setEquipo] = useState<Equipo | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    equipoService.obtener(id)
      .then(setEquipo)
      .catch(() => setError('No se pudo cargar el equipo.'))
      .finally(() => setCargando(false))
  }, [id])

  const cambiar = (campo: keyof NuevoEquipo, valor: string | number) => {
    setEquipo((actual) => actual ? {
      ...actual,
      [campo]: valor,
    } : null)
  }

  const guardar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!equipo) return

    setGuardando(true)
    setError('')

    const { id, createdAt, ...datos } = equipo

    try {
      const actualizado = await equipoService.actualizar(id, datos)
      setEquipo(actualizado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el equipo.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    if (!equipo) return

    const confirmar = window.confirm('¿Estás seguro de eliminar este equipo?')
    if (!confirmar) return

    try {
      await equipoService.eliminar(equipo.id)
      navigate('/equipos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el equipo.')
    }
  }

  if (cargando) return <p>Cargando equipo...</p>

  if (!equipo) {
    return (
      <section>
        <p role="alert">{error || 'Equipo no encontrado.'}</p>
        <Link to="/equipos">Volver al listado</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Detalle del equipo #{equipo.id}</h1>

      <form onSubmit={guardar} className="form">
        <label>
          ID del cliente
          <input
            type="number"
            min="1"
            value={equipo.clienteId}
            onChange={(e) => cambiar('clienteId', Number(e.target.value))}
            required
          />
        </label>

        <label>
          Tipo
          <input
            value={equipo.tipo}
            onChange={(e) => cambiar('tipo', e.target.value)}
            required
          />
        </label>

        <label>
          Marca
          <input
            value={equipo.marca}
            onChange={(e) => cambiar('marca', e.target.value)}
            required
          />
        </label>

        <label>
          Modelo
          <input
            value={equipo.modelo}
            onChange={(e) => cambiar('modelo', e.target.value)}
            required
          />
        </label>

        <label>
          Identificador
          <input
            value={equipo.identificador}
            onChange={(e) => cambiar('identificador', e.target.value)}
          />
        </label>

        <label>
          Condición
          <input
            value={equipo.condicion}
            onChange={(e) => cambiar('condicion', e.target.value)}
          />
        </label>

        <label>
          Observaciones
          <textarea
            value={equipo.observaciones}
            onChange={(e) => cambiar('observaciones', e.target.value)}
          />
        </label>

        {error && <p className="aviso aviso--error" role="alert">{error}</p>}

        <button type="submit" className="btn" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button type="button" onClick={eliminar} disabled={guardando}>
          Eliminar equipo
        </button>

        <Link to="/equipos">Volver al listado</Link>
      </form>
    </section>
  )
}
