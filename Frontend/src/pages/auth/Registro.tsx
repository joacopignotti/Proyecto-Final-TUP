import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import * as authService from '../../services/authService'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirmarPassword: '' })
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const cambiar = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [campo]: e.target.value })

  
const enviar = async (e: SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()

  if (cargando) return

  setError('')
  setMensaje('')

  const nombre = form.nombre.trim()
  const apellido = form.apellido.trim()
  const email = form.email.trim()

  if (!nombre || !apellido || !email || !form.password) {
    setError('Todos los campos son obligatorios')
    return
  }

  if (form.password.length < 8) {
    setError('La contraseña debe tener al menos 8 caracteres')
    return
  }

  if (form.password !== form.confirmarPassword) {
    setError('Las contraseñas no coinciden')
    return
  }

  setCargando(true)

  try {
    const mensajeRespuesta = await authService.register({
      nombre,
      apellido,
      email,
      password: form.password
    })

    setMensaje(mensajeRespuesta)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'No se pudo registrar')
  } finally {
    setCargando(false)
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
          <input type="password" 
          value={form.password} 
          onChange={cambiar('password')}
          required />
        </label>
        <label>
          Confirmar contraseña
          <input type="password" 
          value={form.confirmarPassword}
          onChange={cambiar('confirmarPassword')} 
          minLength={8} 
          required />
        </label>

        {error && <p className="aviso aviso--error">{error}</p>}
        {mensaje && <p className="aviso aviso--ok">{mensaje}</p>}
        
        <button
          type="submit"
          className="btn"
          disabled={cargando}
        >
          {cargando ? 'Registrando...' : 'Registrarme'}
        </button>

      </form>
      <p className="auth__links">
        <Link to="/login">Volver al ingreso</Link>
      </p>
    </section>
  )
}
