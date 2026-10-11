import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { MODULOS } from '../../router/modulos'
import { getHealth } from '../../services/healthService'

export default function Home() {
  const { usuario } = useAuth()
  const [api, setApi] = useState<'cargando' | 'ok' | 'error'>('cargando')

  useEffect(() => {
    getHealth()
      .then(() => setApi('ok'))
      .catch(() => setApi('error'))
  }, [])

  if (!usuario) return null
  const accesos = MODULOS.filter((m) => m.roles.includes(usuario.rol))

  return (
    <>
      <h1>Hola, {usuario.nombre}</h1>
      <p className={`estado-api estado-api--${api}`}>
        API: {api === 'ok' ? 'conectada' : api === 'error' ? 'sin conexión' : 'verificando…'}
      </p>

      <h2>Accesos rápidos</h2>
      <div className="accesos">
        {accesos.map((m) => (
          <Link key={m.path} to={m.path} className="acceso">
            <strong>{m.titulo}</strong>
            <span>{m.descripcion}</span>
          </Link>
        ))}
      </div>

      {/* TODO (Sprint 3): dashboard con estadísticas — órdenes por estado y por técnico */}
    </>
  )
}
