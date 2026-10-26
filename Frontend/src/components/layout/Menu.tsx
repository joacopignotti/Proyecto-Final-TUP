import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { MODULOS } from '../../router/modulos'

export function Menu() {
  const { usuario } = useAuth()
  if (!usuario) return null

  const items = MODULOS.filter((m) => m.roles.includes(usuario.rol))

  return (
    <nav className="menu" aria-label="Menú principal">
      <NavLink to="/" end className="menu__item">
        Inicio
      </NavLink>
      {items.map((m) => (
        <NavLink key={m.path} to={m.path} className="menu__item">
          {m.titulo}
        </NavLink>
      ))}
    </nav>
  )
}
