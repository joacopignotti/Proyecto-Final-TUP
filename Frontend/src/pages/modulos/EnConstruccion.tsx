import { useLocation } from 'react-router-dom'
import { MODULOS } from '../../router/modulos'

/** Pantalla provisoria: cada integrante reemplaza la suya por la real. */
export default function EnConstruccion() {
  const { pathname } = useLocation()
  const modulo = MODULOS.find((m) => pathname.startsWith(m.path))

  return (
    <>
      <h1>{modulo?.titulo ?? 'Módulo'}</h1>
      <p>{modulo?.descripcion}</p>
      <p className="aviso">Pantalla en construcción.</p>
    </>
  )
}
