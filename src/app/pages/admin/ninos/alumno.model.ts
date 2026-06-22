export interface Alumno {
  id?: number;
  nombreCompleto: string;
  sexo: string;
  edad: number;
  condicion: string;
  activo: boolean;
  observacion?: string;
  nombreAula?: string;
  idAula?: number;
  nombreApoderado?: string;
}
