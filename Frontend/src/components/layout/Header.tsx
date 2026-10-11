import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { ROL_LABEL } from '../../router/modulos'

export function Header() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <header className="header">
      <Link to="/" className="header__marca">
        Taller<span>Gestión</span>
      </Link>

      {usuario && (
        <div className="header__usuario">
          <Link to="/perfil" className="header__perfil">
            <strong>
              {usuario.nombre} {usuario.apellido}
            </strong>
            <small>{ROL_LABEL[usuario.rol]}</small>
          </Link>
          <button type="button" className="btn btn--secundario" onClick={salir}>
            Salir
          </button>
        </div>
      )}
    </header>
  )
}
