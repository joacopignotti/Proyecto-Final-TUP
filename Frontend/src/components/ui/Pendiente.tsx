interface Props {
  titulo: string
  detalle: string
}

/** Pantalla provisoria de un módulo: cada integrante la reemplaza por la real. */
export function Pendiente({ titulo, detalle }: Props) {
  return (
    <>
      <h1>{titulo}</h1>
      <p className="aviso">{detalle}</p>
    </>
  )
}
