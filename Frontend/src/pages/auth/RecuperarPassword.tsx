import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import * as authService from '../../services/authService'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const enviar = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      setMensaje(await authService.recuperarPassword(email))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el pedido')
    }
  }

  return (
    <section className="auth">
      <h1>Recuperar contraseña</h1>
      <form onSubmit={enviar} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {error && <p className="aviso aviso--error">{error}</p>}
        {mensaje && <p className="aviso aviso--ok">{mensaje}</p>}
        <button type="submit" className="btn">Enviar instrucciones</button>
      </form>
      <p className="auth__links">
        <Link to="/login">Volver al ingreso</Link>
      </p>
    </section>
  )
}
