import { Route, Routes } from 'react-router-dom'
import PresupuestoDetalle from './PresupuestoDetalle'
import PresupuestoForm from './PresupuestoForm'
import PresupuestosLista from './PresupuestosLista'
import RepuestoDetalle from './RepuestoDetalle'
import RepuestoForm from './RepuestoForm'
import RepuestosLista from './RepuestosLista'

/** Rutas del módulo, montadas en /presupuestos/*: presupuestos y catálogo de repuestos. */
export default function PresupuestosRoutes() {
  return (
    <Routes>
      <Route index element={<PresupuestosLista />} />
      <Route path="nuevo" element={<PresupuestoForm />} />
      <Route path="repuestos" element={<RepuestosLista />} />
      <Route path="repuestos/nuevo" element={<RepuestoForm />} />
      <Route path="repuestos/:id" element={<RepuestoDetalle />} />
      <Route path=":id" element={<PresupuestoDetalle />} />
    </Routes>
  )
}
