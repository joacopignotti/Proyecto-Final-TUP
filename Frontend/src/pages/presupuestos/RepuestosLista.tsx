
import { Link, useNavigate } from 'react-router-dom'
import { ListaPaginada } from '../../components/ui/ListaPaginada'
import { repuestoService } from '../../services/repuestoService'
import type { Repuesto } from '../../types/repuesto'
import type { Columna } from '../../types/tabla'

const columnas: Columna<Repuesto>[] = [
  { clave: 'id', titulo: 'ID', ordenable: true },
  { clave: 'codigo', titulo: 'Código', ordenable: true },
  { clave: 'nombre', titulo: 'Nombre', ordenable: true },
  { clave: 'costo', titulo: 'Costo', ordenable: true },
  { clave: 'stock', titulo: 'Stock', ordenable: true },
  { clave: 'activo', titulo: 'Activo' },
]

export default function RepuestosLista() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Repuestos</h1>

      <ListaPaginada
        service={repuestoService}
        columnas={columnas}
        etiqueta="repuestos"
        placeholderBusqueda="Buscar por código o nombre..."
        nombreReporte="repuestos"
        onFilaClick={(repuesto) =>
          navigate(`/presupuestos/repuestos/${repuesto.id}`)
        }
        acciones={
          <Link to="/presupuestos/repuestos/nuevo">
            Nuevo repuesto
          </Link>
        }
      />
    </section>
  )
}
