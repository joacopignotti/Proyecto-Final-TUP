import { useEffect, useState } from 'react'

interface Props {
  /** Texto de búsqueda vigente (el que ya se aplicó al listado). */
  valor: string
  onBuscar: (texto: string) => void
  etiqueta?: string
  placeholder?: string
}

/** Buscador con espera de 400 ms después de la última tecla, para no pedir en cada letra. */
export function SearchBox({ valor, onBuscar, etiqueta = 'Buscar', placeholder }: Props) {
  const [texto, setTexto] = useState(valor)

  useEffect(() => {
    if (texto.trim() === valor) return
    const espera = setTimeout(() => onBuscar(texto), 400)
    return () => clearTimeout(espera)
  }, [texto, valor, onBuscar])

  return (
    <label className="buscador">
      {etiqueta}
      <span className="buscador__campo">
        <input
          type="search"
          value={texto}
          placeholder={placeholder}
          onChange={(e) => setTexto(e.target.value)}
        />
        {texto && (
          <button
            type="button"
            className="buscador__limpiar"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setTexto('')
              onBuscar('')
            }}
          >
            ×
          </button>
        )}
      </span>
    </label>
  )
}
