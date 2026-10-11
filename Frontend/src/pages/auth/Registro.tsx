import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import * as authService from '../../services/authService'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const cambiar = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [campo]: e.target.value })

  const enviar = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMensaje('')
    try {
      setMensaje(await authService.register(form))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar')
    }
  }

  return (
    <section className="auth">
      <h1>Crear cuenta</h1>
      <form onSubmit={enviar} className="form">
        <label>
          Nombre
          <input value={form.nombre} onChange={cambiar('nombre')} required />
        </label>
        <label>
          Apellido
          <input value={form.apellido} onChange={cambiar('apellido')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={cambiar('email')} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={form.password} onChange={cambiar('password')} required />
        </label>
        {error && <p className="aviso aviso--error">{error}</p>}
        {mensaje && <p className="aviso aviso--ok">{mensaje}</p>}
        <button type="submit" className="btn">Registrarme</button>
      </form>
      <p className="auth__links">
        <Link to="/login">Volver al ingreso</Link>
      </p>
    </section>
  )
}
