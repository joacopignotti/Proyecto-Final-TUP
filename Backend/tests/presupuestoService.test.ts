
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Presupuesto } from '../src/models/Presupuesto'

type DatosPresupuesto = Omit<Presupuesto, 'id'>

describe('PresupuestoService - reglas de negocio', () => {
  let presupuestoService:
    typeof import('../src/services/presupuestoService').presupuestoService

  beforeEach(async () => {
    // Cada test comienza con repositorios nuevos.
    vi.resetModules()

    const modulo = await import(
      '../src/services/presupuestoService'
    )
    presupuestoService = modulo.presupuestoService
  })

  const presupuestoValido = (
    cambios: Partial<DatosPresupuesto> = {}
  ): DatosPresupuesto => ({
    ordenId: 1,
    manoDeObra: 15000,
    items: [],
    total: 15000,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
    ...cambios,
  })

  // Crea una orden válida sin presupuesto para usar en pruebas.
  const crearOrdenDePrueba = async () => {
    const { ordenRepository } = await import(
      '../src/repositories/ordenRepository'
    )

    const original = ordenRepository.findById(1)

    if (!original) {
      throw new Error('No existe la orden inicial del mock')
    }

    return ordenRepository.create({
      codigo: 'OT-TEST-0002',
      equipoId: original.equipoId,
      tecnicoId: original.tecnicoId,
      estado: 'recibido',
      diagnostico: '',
      fallas: 'Batería defectuosa',
      trabajoRealizado: '',
      fechaIngreso: new Date().toISOString(),
      fechaEntrega: null,
      bitacora: [],
    })
  }

  it('rechaza una orden inexistente (404)', () => {
    expect(() =>
      presupuestoService.crear(
        presupuestoValido({ ordenId: 9999 })
      )
    ).toThrow('La orden no existe')
  })

  it('rechaza un presupuesto duplicado (409)', () => {
    expect(() =>
      presupuestoService.crear(
        presupuestoValido({ ordenId: 1 })
      )
    ).toThrow('La orden ya tiene un presupuesto')
  })

  it('rechaza una mano de obra negativa (400)', async () => {
    const orden = await crearOrdenDePrueba()

    expect(() =>
      presupuestoService.crear(
        presupuestoValido({
          ordenId: orden.id,
          manoDeObra: -1000,
        })
      )
    ).toThrow('La mano de obra debe ser un número no negativo')
  })

  it('rechaza un repuesto inexistente (404)', async () => {
    const orden = await crearOrdenDePrueba()

    expect(() =>
      presupuestoService.crear(
        presupuestoValido({
          ordenId: orden.id,
          items: [
            {
              id: 1,
              repuestoId: 9999,
              cantidad: 1,
              costoUnitario: 1000,
            },
          ],
        })
      )
    ).toThrow('El repuesto 9999 no existe')
  })

  it('rechaza una cantidad superior al stock (400)', async () => {
    const orden = await crearOrdenDePrueba()

    expect(() =>
      presupuestoService.crear(
        presupuestoValido({
          ordenId: orden.id,
          items: [
            {
              id: 1,
              repuestoId: 1,
              cantidad: 100000,
              costoUnitario: 48000,
            },
          ],
        })
      )
    ).toThrow('Stock insuficiente')
  })

  it('calcula el total usando el costo real del repuesto', async () => {
    const orden = await crearOrdenDePrueba()

    const presupuesto = presupuestoService.crear(
      presupuestoValido({
        ordenId: orden.id,
        manoDeObra: 15000,
        items: [
          {
            id: 1,
            repuestoId: 1,
            cantidad: 2,
            costoUnitario: 1,
          },
        ],
        total: 100,
        estado: 'aprobado',
      })
    )

    expect(presupuesto.items[0].costoUnitario).toBe(48000)
    expect(presupuesto.total).toBe(111000)
    expect(presupuesto.estado).toBe('pendiente')
  })

  it('actualiza mano de obra, estado y recalcula el total', () => {
    const actualizado = presupuestoService.actualizar(1, {
      manoDeObra: 20000,
      estado: 'aprobado',
    })

    expect(actualizado.manoDeObra).toBe(20000)
    expect(actualizado.estado).toBe('aprobado')
    expect(actualizado.total).toBe(68000)
  })

  it('rechaza modificar directamente el total', () => {
    expect(() =>
      presupuestoService.actualizar(1, { total: 1 })
    ).toThrow('Solo se pueden modificar manoDeObra y estado')

    // El presupuesto debe conservar su total original.
    expect(presupuestoService.obtener(1).total).toBe(63000)
  })
})
