import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aula } from '../pages/admin/aulas/aula.model';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private apiUrl = 'http://localhost:8080/api/aulas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id}`);
  }

  crear(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  actualizar(id: number, aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${id}`, aula);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
