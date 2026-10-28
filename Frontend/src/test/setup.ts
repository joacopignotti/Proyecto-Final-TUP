import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta lo renderizado después de cada test para que no se acumule entre pruebas.
afterEach(cleanup)
