import { Route, Routes } from 'react-router-dom'
import OrdenDetalle from './OrdenDetalle'
import OrdenForm from './OrdenForm'
import OrdenesLista from './OrdenesLista'

/** Rutas del módulo, montadas en /ordenes/*. Este módulo se edita solo desde esta carpeta. */
export default function OrdenesRoutes() {
  return (
    <Routes>
      <Route index element={<OrdenesLista />} />
      <Route path="nuevo" element={<OrdenForm />} />
      <Route path=":id" element={<OrdenDetalle />} />
    </Routes>
  )
}
