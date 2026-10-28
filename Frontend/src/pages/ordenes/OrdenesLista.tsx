
import { Link, useNavigate } from 'react-router-dom'
import { ListaPaginada } from '../../components/ui/ListaPaginada'
import { ordenService } from '../../services/ordenService'
import type { Orden } from '../../types/orden'
import type { Columna } from '../../types/tabla'

const columnas: Columna<Orden>[] = [
  { clave: 'id', titulo: 'ID', ordenable: true },
  { clave: 'codigo', titulo: 'Código', ordenable: true },
  { clave: 'equipoId', titulo: 'ID Equipo', ordenable: true },
  { clave: 'tecnicoId', titulo: 'ID Técnico', ordenable: true },
  { clave: 'estado', titulo: 'Estado', ordenable: true },
  { clave: 'fechaIngreso', titulo: 'Fecha de ingreso', ordenable: true },
  { clave: 'fechaEntrega', titulo: 'Fecha de entrega' },
]

export default function OrdenesLista() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Órdenes de trabajo</h1>

      <ListaPaginada
        service={ordenService}
        columnas={columnas}
        etiqueta="órdenes"
        placeholderBusqueda="Buscar por código o estado..."
        nombreReporte="ordenes"
        onFilaClick={(orden) => navigate(`/ordenes/${orden.id}`)}
        acciones={<Link to="/ordenes/nuevo">Nueva orden</Link>}
      />
    </section>
  )
}
