
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Repuesto } from '../src/models/Repuesto'

type DatosRepuesto = Omit<Repuesto, 'id'>

describe('RepuestoService - CRUD y validaciones', () => {
  let repuestoService:
    typeof import('../src/services/repuestoService').repuestoService

  beforeEach(async () => {
    vi.resetModules()

    const modulo = await import(
      '../src/services/repuestoService'
    )

    repuestoService = modulo.repuestoService
  })

  const nuevoRepuesto = (
    cambios: Partial<DatosRepuesto> = {}
  ): DatosRepuesto => ({
    codigo: 'BAT-G32',
    nombre: 'Batería Moto G32',
    costo: 25000,
    stock: 10,
    activo: true,
    ...cambios,
  })

  // TEST 1: LISTAR
  it('lista los repuestos existentes', () => {
    const resultado = repuestoService.listar({
      page: 1,
      limit: 10,
      order: 'asc',
    })

    expect(resultado.data).toHaveLength(1)
    expect(resultado.data[0].codigo).toBe('PAN-G32')
    expect(resultado.meta.total).toBe(1)
  })

  // TEST 2: OBTENER
  it('obtiene un repuesto por su ID', () => {
    const repuesto = repuestoService.obtener(1)

    expect(repuesto.nombre).toBe('Pantalla Moto G32')
    expect(repuesto.costo).toBe(48000)
  })

  // TEST 3: CREAR
  it('crea un repuesto correctamente', () => {
    const creado = repuestoService.crear(nuevoRepuesto())

    expect(creado.id).toBe(2)
    expect(creado.codigo).toBe('BAT-G32')
    expect(creado.stock).toBe(10)
    expect(repuestoService.obtener(2).nombre)
      .toBe('Batería Moto G32')
  })

  // TEST 4: ACTUALIZAR
  it('actualiza el costo y el stock', () => {
    const actualizado = repuestoService.actualizar(1, {
      costo: 50000,
      stock: 8,
    })

    expect(actualizado.costo).toBe(50000)
    expect(actualizado.stock).toBe(8)
  })

  // TEST 5: ELIMINAR
  it('elimina un repuesto existente', () => {
    repuestoService.eliminar(1)

    expect(() => repuestoService.obtener(1))
      .toThrow('Repuesto no encontrado')
  })

  // TEST 6: NO ENCONTRADO
  it('rechaza consultar un repuesto inexistente', () => {
    expect(() => repuestoService.obtener(9999))
      .toThrow('Repuesto no encontrado')
  })

  // TEST 7: CÓDIGO DUPLICADO
  it('rechaza códigos duplicados', () => {
    expect(() =>
      repuestoService.crear(
        nuevoRepuesto({ codigo: 'pan-g32' })
      )
    ).toThrow('Ya existe un repuesto con ese código')
  })

  // TEST 8: COSTO NEGATIVO
  it('rechaza costos negativos', () => {
    expect(() =>
      repuestoService.crear(
        nuevoRepuesto({ costo: -500 })
      )
    ).toThrow('El costo debe ser un número no negativo')
  })

  // TEST 9: STOCK NEGATIVO
  it('rechaza stock negativo', () => {
    expect(() =>
      repuestoService.crear(
        nuevoRepuesto({ stock: -1 })
      )
    ).toThrow('El stock debe ser un entero no negativo')
  })

  // TEST 10: STOCK DECIMAL
  it('rechaza stock con decimales', () => {
    expect(() =>
      repuestoService.crear(
        nuevoRepuesto({ stock: 2.5 })
      )
    ).toThrow('El stock debe ser un entero no negativo')
  })

  // TEST 11: NOMBRE VACÍO
  it('rechaza nombres vacíos', () => {
    expect(() =>
      repuestoService.crear(
        nuevoRepuesto({ nombre: '   ' })
      )
    ).toThrow('El nombre es obligatorio')
  })

  // TEST 12: VALIDAR ACTUALIZACIÓN
  it('rechaza actualizar con costo negativo', () => {
    expect(() =>
      repuestoService.actualizar(1, { costo: -1000 })
    ).toThrow('El costo debe ser un número no negativo')

    expect(repuestoService.obtener(1).costo).toBe(48000)
  })

  // TEST 13: NORMALIZAR CÓDIGO
  it('normaliza el código y nombre del repuesto', () => {
    const creado = repuestoService.crear(
      nuevoRepuesto({
        codigo: '  bat-g32  ',
        nombre: '  Batería Moto G32  ',
      })
    )

    expect(creado.codigo).toBe('BAT-G32')
    expect(creado.nombre).toBe('Batería Moto G32')
  })
})
