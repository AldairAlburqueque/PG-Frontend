import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apoderado } from '../pages/admin/apoderados/apoderados.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApoderadoService {
  private apiUrl = 'http://localhost:8080/api/apoderados';

  constructor(private http: HttpClient) {}

  listar(): Observable<Apoderado[]> {
    return this.http.get<Apoderado[]>(this.apiUrl);
  }
  
  obtenerMiPerfil(): Observable<Apoderado> {
    return this.http.get<Apoderado>(`${this.apiUrl}/mi-perfil`);
  }

  obtenerPorId(id: number): Observable<Apoderado> {
    return this.http.get<Apoderado>(`${this.apiUrl}/${id}`);
  }

  crear(apoderado: Apoderado): Observable<Apoderado> {
    return this.http.post<Apoderado>(this.apiUrl, apoderado);
  }

  actualizar(id: number, apoderado: Apoderado): Observable<Apoderado> {
    return this.http.put<Apoderado>(`${this.apiUrl}/${id}`, apoderado);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
