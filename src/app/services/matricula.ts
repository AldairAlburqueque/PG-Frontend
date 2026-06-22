import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatriculaService {
  // La URL de tu Spring Boot
  private apiUrl = 'http://localhost:8080/api/solicitudes/registrar-mi-solicitud';

  constructor(private http: HttpClient) {}

  // Método para enviar los datos
  registrarMatricula(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}
