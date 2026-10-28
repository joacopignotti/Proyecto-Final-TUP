import { Route, Routes } from 'react-router-dom'
import ClienteDetalle from './ClienteDetalle'
import ClienteForm from './ClienteForm'
import ClientesLista from './ClientesLista'

/** Rutas del módulo, montadas en /clientes/*. Este módulo se edita solo desde esta carpeta. */
export default function ClientesRoutes() {
  return (
    <Routes>
      <Route index element={<ClientesLista />} />
      <Route path="nuevo" element={<ClienteForm />} />
      <Route path=":id" element={<ClienteDetalle />} />
    </Routes>
  )
}
