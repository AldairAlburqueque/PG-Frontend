import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  email: string;
  contraseña?: string;
  rol: string;
  activo: boolean;
  nombreApoderado?: string;
  apoderadoId?: number;
}

export interface RegistroRequest {
  email: string;
  contraseña: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  relacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerMetadata(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/metadata`);
  }

  buscar(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${email}`);
  }

  guardar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(email: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${email}`, usuario);
  }

  eliminar(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}`);
  }

  cambiarEstado(email: string, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${email}/estado`, { activo });
  }

  registrarPublico(registro: RegistroRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro-publico`, registro);
  }
}
