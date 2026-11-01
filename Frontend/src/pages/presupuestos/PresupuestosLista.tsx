
import { Link, useNavigate } from 'react-router-dom'
import { ListaPaginada } from '../../components/ui/ListaPaginada'
import { presupuestoService } from '../../services/presupuestoService'
import type { Presupuesto } from '../../types/presupuesto'
import type { Columna } from '../../types/tabla'

const columnas: Columna<Presupuesto>[] = [
  { clave: 'id', titulo: 'ID', ordenable: true },
  { clave: 'ordenId', titulo: 'Orden', ordenable: true },
  { clave: 'manoDeObra', titulo: 'Mano de obra', ordenable: true },
  { clave: 'total', titulo: 'Total', ordenable: true },
  { clave: 'estado', titulo: 'Estado', ordenable: true },
  { clave: 'createdAt', titulo: 'Fecha de creación', ordenable: true },
]

export default function PresupuestosLista() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Presupuestos</h1>

      <ListaPaginada
        service={presupuestoService}
        columnas={columnas}
        etiqueta="presupuestos"
        placeholderBusqueda="Buscar presupuestos..."
        nombreReporte="presupuestos"
        onFilaClick={(presupuesto) =>
          navigate(`/presupuestos/${presupuesto.id}`)
        }
        acciones={
          <>
            <Link to="/presupuestos/nuevo">
              Nuevo presupuesto
            </Link>

            <Link to="/presupuestos/repuestos">
              Ver repuestos
            </Link>
          </>
        }
      />
    </section>
  )
}
