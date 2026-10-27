import { Route, Routes } from 'react-router-dom'
import EquipoDetalle from './EquipoDetalle'
import EquipoForm from './EquipoForm'
import EquiposLista from './EquiposLista'

/** Rutas del módulo, montadas en /equipos/*. Este módulo se edita solo desde esta carpeta. */
export default function EquiposRoutes() {
  return (
    <Routes>
      <Route index element={<EquiposLista />} />
      <Route path="nuevo" element={<EquipoForm />} />
      <Route path=":id" element={<EquipoDetalle />} />
    </Routes>
  )
}
