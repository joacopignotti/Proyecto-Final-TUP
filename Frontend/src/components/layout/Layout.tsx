import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'

export function Layout() {
  return (
    <div className="app">
      <Header />
      <div className="app__cuerpo">
        <Menu />
        <main className="app__contenido">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
