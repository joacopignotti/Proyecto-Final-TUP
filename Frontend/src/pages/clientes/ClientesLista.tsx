import { Link, useNavigate } from 'react-router-dom'
import { ListaPaginada } from '../../components/ui/ListaPaginada'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types/cliente'
import type { Columna } from '../../types/tabla'

const estado = (c: Cliente) => (c.activo ? 'Activo' : 'Inactivo')

const columnas: Columna<Cliente>[] = [
  { clave: 'id', titulo: 'ID', ordenable: true },
  { clave: 'apellido', titulo: 'Apellido', ordenable: true },
  { clave: 'nombre', titulo: 'Nombre', ordenable: true },
  { clave: 'dni', titulo: 'DNI', ordenable: true },
  { clave: 'telefono', titulo: 'Teléfono' },
  { clave: 'email', titulo: 'Email' },
  { clave: 'activo', titulo: 'Estado', render: estado, exportar: estado },
]

export default function ClientesLista() {
  const navigate = useNavigate()

  return (
    <section>
      <h1>Clientes</h1>
      <ListaPaginada
        service={clienteService}
        columnas={columnas}
        etiqueta="clientes"
        placeholderBusqueda="Buscar por nombre, apellido, DNI o email..."
        nombreReporte="reporte-clientes"
        onFilaClick={(cliente) => navigate(`/clientes/${cliente.id}`)}
        acciones={
          <Link className="btn" to="/clientes/nuevo">
            Nuevo cliente
          </Link>
        }
      />
    </section>
  )
}
