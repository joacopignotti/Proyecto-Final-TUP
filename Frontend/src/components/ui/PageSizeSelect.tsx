interface Props {
  valor: number
  onCambiar: (limite: number) => void
  opciones?: number[]
}

export function PageSizeSelect({ valor, onCambiar, opciones = [5, 10, 20, 50] }: Props) {
  return (
    <label className="buscador">
      Registros por página
      <select value={valor} onChange={(e) => onCambiar(Number(e.target.value))}>
        {opciones.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}
