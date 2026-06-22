import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Docente } from '../pages/admin/docentes/docente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  private apiUrl = 'http://localhost:8080/api/docentes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  crear(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.apiUrl, docente);
  }

  actualizar(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
