import { useState, type SyntheticEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/** Consulta pública del cliente por código de seguimiento (no requiere login). */
export default function Seguimiento() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [texto, setTexto] = useState(codigo ?? '')

  const buscar = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (texto.trim()) navigate(`/seguimiento/${encodeURIComponent(texto.trim())}`)
  }

  return (
    <section className="auth">
      <h1>Seguimiento de tu equipo</h1>
      <form onSubmit={buscar} className="form">
        <label>
          Código de orden
          <input value={texto} onChange={(e) => setTexto(e.target.value)} required />
        </label>
        <button type="submit" className="btn">Consultar</button>
      </form>
      {codigo && (
        <p className="aviso">
          Consulta del código <strong>{codigo}</strong>: pantalla en construcción (línea de tiempo y
          aprobación de presupuesto).
        </p>
      )}
    </section>
  )
}
