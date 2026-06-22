export interface Docente {
  id?: number;
  nombre: string;
  apellidos: string;
}

export interface Aula {
  id?: number;
  nombre: string;
  docente?: Docente;
  activo?: boolean;
}
