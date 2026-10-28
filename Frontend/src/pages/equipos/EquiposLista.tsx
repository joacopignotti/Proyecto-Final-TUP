
import { Link, useNavigate } from 'react-router-dom'
import { ListaPaginada } from '../../components/ui/ListaPaginada'
import { equipoService } from '../../services/equipoService'
import type { Equipo } from '../../types/equipo'
import type { Columna } from '../../types/tabla'

const columnas: Columna<Equipo>[] = [
  {
    clave: 'id',
    titulo: 'ID',
    ordenable: true,
  },
  {
    clave: 'tipo',
    titulo: 'Tipo',
    ordenable: true,
  },
  {
    clave: 'marca',
    titulo: 'Marca',
    ordenable: true,
  },
  {
    clave: 'modelo',
    titulo: 'Modelo',
    ordenable: true,
  },
  {
    clave: 'identificador',
    titulo: 'Identificador',
  },
  {
    clave: 'condicion',
    titulo: 'Condición',
  },
  {
    clave: 'clienteId',
    titulo: 'ID Cliente',
    ordenable: true,
  },
]

export default function EquiposLista() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Equipos</h1>

      <ListaPaginada
        service={equipoService}
        columnas={columnas}
        etiqueta="equipos"
        placeholderBusqueda="Buscar por tipo, marca, modelo o identificador..."
        nombreReporte="equipos"
        onFilaClick={(equipo) => navigate(`/equipos/${equipo.id}`)}
        acciones={
          <Link to="/equipos/nuevo">
            Nuevo equipo
          </Link>
        }
      />
    </section>
  )
}
