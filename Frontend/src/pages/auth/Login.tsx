import { useState, type SyntheticEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function Login() {
  const { usuario, iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  const enviar = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await iniciarSesion(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="auth">
      <h1>Ingresar al sistema</h1>
      <form onSubmit={enviar} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="aviso aviso--error">{error}</p>}
        <button type="submit" className="btn" disabled={cargando}>
          {cargando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="auth__links">
        <Link to="/recuperar-password">Olvidé mi contraseña</Link>
        <Link to="/registro">Crear cuenta</Link>
      </p>

      <aside className="demo">
        <strong>Usuarios de prueba</strong> (contraseña <code>taller123</code>)
        <ul>
          <li><code>admin@taller.com</code> — Administrador</li>
          <li><code>recepcion@taller.com</code> — Recepción</li>
          <li><code>tecnico@taller.com</code> — Técnico</li>
        </ul>
      </aside>
    </section>
  )
}
