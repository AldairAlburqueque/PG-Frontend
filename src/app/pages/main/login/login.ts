import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingrese email y contraseña';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Usuario autenticado:', user);
        
        // Redirigir según el rol
        if (user.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (user.rol === 'APODERADO') {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Rol de usuario no reconocido';
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en login:', err);
        
        // Diferenciar entre usuario desactivado y credenciales inválidas
        if (err.message === 'USUARIO_DESACTIVADO' || err.code === 'USUARIO_DESACTIVADO') {
          this.errorMessage = '❌ Esta cuenta ha sido desactivada o eliminada. Contacte al administrador.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = '❌ Credenciales incorrectas. Verifica tu email y contraseña.';
        } else {
          this.errorMessage = '❌ Error en el servidor. Por favor intenta más tarde.';
        }
        
        this.isLoading = false;
        
        // Limpiar credenciales
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authPass');
      }
    });
  }
}

