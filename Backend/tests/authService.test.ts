
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('AuthService - registro e inicio de sesión', () => {
  let authService: typeof import('../src/services/authService')

  beforeEach(async () => {
    // Cada test comienza sin los usuarios registrados
    // por los tests anteriores.
    vi.resetModules()

    authService = await import('../src/services/authService')
  })

  const usuarioValido = () => ({
    nombre: 'Mateo',
    apellido: 'Prueba',
    email: 'mateo.prueba@taller.com',
    password: 'ClaveSegura123',
  })

  // TEST 1: REGISTRAR USUARIO
  it('registra un usuario con rol recepcionista', () => {
    const usuario = authService.register(usuarioValido())

    expect(usuario.id).toBeGreaterThan(3)
    expect(usuario.email).toBe('mateo.prueba@taller.com')
    expect(usuario.rol).toBe('recepcionista')
    expect(usuario.activo).toBe(true)
  })

  // TEST 2: LOGIN DE USUARIO REGISTRADO
  it('permite iniciar sesión con un usuario nuevo', () => {
    const datos = usuarioValido()

    const usuario = authService.register(datos)

    const resultado = authService.login(
      datos.email,
      datos.password
    )

    expect(resultado.usuario.id).toBe(usuario.id)
    expect(resultado.usuario.email).toBe(datos.email)
    expect(resultado.token).toBe(`mock-token-${usuario.id}`)
  })

  // TEST 3: EMAIL DUPLICADO
  it('rechaza registrar dos veces el mismo email', () => {
    const datos = usuarioValido()

    authService.register(datos)

    expect(() =>
      authService.register({
        ...datos,
        email: 'MATEO.PRUEBA@TALLER.COM',
      })
    ).toThrow('Ya existe un usuario con ese email')
  })

  // TEST 4: CONTRASEÑA INCORRECTA
  it('rechaza iniciar sesión con contraseña incorrecta', () => {
    const datos = usuarioValido()

    authService.register(datos)

    expect(() =>
      authService.login(datos.email, 'ClaveIncorrecta')
    ).toThrow('Email o contraseña incorrectos')
  })

  // TEST 5: CONTRASEÑA CORTA
  it('rechaza registrar contraseñas menores a 8 caracteres', () => {
    expect(() =>
      authService.register({
        ...usuarioValido(),
        password: '1234',
      })
    ).toThrow('La contraseña debe tener al menos 8 caracteres')
  })

  // TEST 6: USUARIOS ORIGINALES
  it('mantiene el login de los usuarios del mock', () => {
    const resultado = authService.login(
      'admin@taller.com',
      'taller123'
    )

    expect(resultado.usuario.id).toBe(1)
    expect(resultado.usuario.rol).toBe('administrador')
  })

  // TEST 7: EMAIL NORMALIZADO
  it('normaliza el email al registrar un usuario', () => {
    const usuario = authService.register({
      ...usuarioValido(),
      email: '  MATEO.PRUEBA@TALLER.COM  ',
    })

    expect(usuario.email).toBe('mateo.prueba@taller.com')
  })
})
