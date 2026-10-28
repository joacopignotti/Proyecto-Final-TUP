export interface Equipo {
  id: number;
  clienteId: number;
  tipo: string; // celular, bicicleta, moto, electrodoméstico…
  marca: string;
  modelo: string;
  identificador: string; // serie, IMEI, patente…
  condicion: string; // estado físico al ingreso
  observaciones: string;
  createdAt: string;
}
