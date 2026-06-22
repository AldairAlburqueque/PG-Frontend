import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface UsuarioInfo {
  email: string;
  rol: string;
  activo: boolean;
  apoderadoId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private currentUserSubject = new BehaviorSubject<UsuarioInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private userInvalidated = new BehaviorSubject<boolean>(false);
  public userInvalidated$ = this.userInvalidated.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si hay sesión al iniciar
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
      this.loadUserInfo().subscribe();
    }
  }

  login(email: string, password: string): Observable<UsuarioInfo> {
    // Guardar credenciales
    sessionStorage.setItem('authUser', email);
    sessionStorage.setItem('authPass', password);

    // Cargar información del usuario
    return this.loadUserInfo();
  }

  loadUserInfo(): Observable<UsuarioInfo> {
    return this.http.get<UsuarioInfo>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        if (!user.activo) {
          // Usuario desactivado - lanzar error específico
          this.handleUserInvalidated();
          const error: any = new Error('USUARIO_DESACTIVADO');
          error.code = 'USUARIO_DESACTIVADO';
          throw error;
        }
        this.currentUserSubject.next(user);
        sessionStorage.setItem('userRole', user.rol);
        this.userInvalidated.next(false);
      }),
      catchError((err) => {
        // Si el usuario fue eliminado o desactivado
        if (err.status === 401 || err.status === 403 || err.code === 'USUARIO_DESACTIVADO' || err.message === 'USUARIO_DESACTIVADO') {
          this.handleUserInvalidated();
        }
        // Re-lanzar el error para que el componente lo maneje
        return throwError(() => err);
      })
    );
  }

  private handleUserInvalidated(): void {
    this.logout();
    this.userInvalidated.next(true);
  }

  logout(): void {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('authPass');
    sessionStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authUser');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isApoderado(): boolean {
    return this.getUserRole() === 'APODERADO';
  }

  hasUserBeenInvalidated(): boolean {
    return this.userInvalidated.value;
  }
}
