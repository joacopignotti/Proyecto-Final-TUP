import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { clienteService } from '../../services/clienteService'
import type { Cliente } from '../../types/cliente'
import ClientesLista from './ClientesLista'

const clientesEjemplo: Cliente[] = [
    {
    id: 1,
    nombre: 'Laura',
    apellido: 'Gómez',
    dni: '30111222',
    telefono: '291 4551122',
    email: 'laura.gomez@mail.com',
    activo: true,
    createdAt: '2026-10-01T10:00:00.000Z',
    },
    {
    id: 2,
    nombre: 'Jorge',
    apellido: 'Rodríguez',
    dni: '24987654',
    telefono: '291 4789654',
    email: 'jorge.rodriguez@mail.com',
    activo: false,
    createdAt: '2026-10-04T16:45:00.000Z',
    },
]

describe('ClientesLista', () => {
    it('renderiza el listado de clientes con estado legible y permite buscar', async () => {
        const listarSpy = vi.spyOn(clienteService, 'listar').mockResolvedValue({
        items: clientesEjemplo,
        meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    })

    render(
        <MemoryRouter>
        <ClientesLista />
        </MemoryRouter>,
    )

    expect(await screen.findByText('Laura')).toBeTruthy()
    expect(screen.getByText('Activo')).toBeTruthy()
    expect(screen.getByText('Inactivo')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Nuevo cliente' }).getAttribute('href')).toBe(
        '/clientes/nuevo',
    )

    await userEvent.type(screen.getByLabelText('Buscar clientes'), 'Laura')
    expect(listarSpy).toHaveBeenCalled()

    listarSpy.mockRestore()
    })
})