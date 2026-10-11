import { useAuth } from '../../context/useAuth'
import { ROL_LABEL } from '../../router/modulos'

export default function Perfil() {
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <>
      <h1>Mi perfil</h1>
      <dl className="ficha">
        <dt>Nombre</dt>
        <dd>
          {usuario.nombre} {usuario.apellido}
        </dd>
        <dt>Email</dt>
        <dd>{usuario.email}</dd>
        <dt>Perfil</dt>
        <dd>{ROL_LABEL[usuario.rol]}</dd>
      </dl>
    </>
  )
}
