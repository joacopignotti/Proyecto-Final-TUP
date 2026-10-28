import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Listable } from '../../services/crudService'
import type { ListParams } from '../../types/api'
import type { Columna } from '../../types/tabla'
import { ListaPaginada } from './ListaPaginada'

interface Cliente {
  id: number
  nombre: string
}

const TODOS: Cliente[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  nombre: i === 3 ? 'Ana Paz' : `Cliente ${i + 1}`,
}))

/** Service falso que pagina y busca en memoria, como lo hace la API. */
const crearService = () => {
  const listar = vi.fn(async (params: ListParams = {}) => {
    const { page = 1, limit = 10, q } = params
    const filtrados = q ? TODOS.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase())) : TODOS
    const totalPages = Math.max(1, Math.ceil(filtrados.length / limit))
    return {
      items: filtrados.slice((page - 1) * limit, page * limit),
      meta: { page, limit, total: filtrados.length, totalPages },
    }
  })
  const service: Listable<Cliente> = { listar }
  return { service, listar }
}

const columnas: Columna<Cliente>[] = [
  { clave: 'id', titulo: 'ID', ordenable: true },
  { clave: 'nombre', titulo: 'Nombre', ordenable: true },
]

describe('ListaPaginada', () => {
  it('muestra la primera página con el resumen y pagina', async () => {
    const { service } = crearService()
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" />)

    expect(await screen.findByText('1–10 de 25 clientes')).toBeTruthy()
    expect(screen.getAllByRole('row')).toHaveLength(11) // encabezado + 10 filas

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(await screen.findByText('11–20 de 25 clientes')).toBeTruthy()
    expect(screen.getByText('Página 2 de 3')).toBeTruthy()
  })

  it('cambia la cantidad de registros por página y vuelve a la página 1', async () => {
    const { service, listar } = crearService()
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" />)
    await screen.findByText('1–10 de 25 clientes')
    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    await screen.findByText('11–20 de 25 clientes')

    await userEvent.selectOptions(screen.getByLabelText('Registros por página'), '20')

    expect(await screen.findByText('1–20 de 25 clientes')).toBeTruthy()
    expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, limit: 20 }))
  })

  it('busca por texto después de una breve espera', async () => {
    const { service, listar } = crearService()
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" />)
    await screen.findByText('1–10 de 25 clientes')

    await userEvent.type(screen.getByLabelText('Buscar clientes'), 'ana')

    expect(await screen.findByText('1–1 de 1 clientes', {}, { timeout: 2000 })).toBeTruthy()
    expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'ana', page: 1 }))
  })

  it('ordena al hacer clic en el encabezado (asc y luego desc)', async () => {
    const { service, listar } = crearService()
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" />)
    await screen.findByText('1–10 de 25 clientes')

    await userEvent.click(screen.getByRole('button', { name: /Nombre/ }))
    await waitFor(() =>
      expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: 'nombre', order: 'asc' })),
    )
    await userEvent.click(screen.getByRole('button', { name: /Nombre/ }))
    await waitFor(() =>
      expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: 'nombre', order: 'desc' })),
    )
  })

  it('avisa al hacer clic en una fila', async () => {
    const { service } = crearService()
    const alAbrir = vi.fn()
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" onFilaClick={alAbrir} />)

    const fila = (await screen.findByText('Ana Paz')).closest('tr')!
    await userEvent.click(within(fila).getByText('Ana Paz'))

    expect(alAbrir).toHaveBeenCalledWith({ id: 4, nombre: 'Ana Paz' })
  })

  it('muestra el error cuando falla la API', async () => {
    const service: Listable<Cliente> = { listar: vi.fn().mockRejectedValue(new Error('No se pudo conectar')) }
    render(<ListaPaginada service={service} columnas={columnas} etiqueta="clientes" />)

    expect((await screen.findByRole('alert')).textContent).toBe('No se pudo conectar')
  })
})
