export interface Solicitud {
  id?: number;
  anio: number;
  periodo: number;
  fechaSolicitud: string;
  nombreAlumno: string;
  alumnoId: number;
  nombreAula: string;
  aulaId: number;
  nombreApoderado: string;
  apoderadoId: number;
  activo: boolean;
}

export interface SolicitudDetalle {
  id?: number;
  año: number;
  periodo: number;
  fechaSolicitud: string;
  alumno: {
    id: number;
    nombreCompleto: string;
  };
  aula: {
    id: number;
    nombre: string;
  };
  apoderado: {
    id: number;
    nombres: string;
    apellidos: string;
  };
  activo: boolean;
}
