import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-formulario-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-registro.html',
  styleUrl: './formulario-registro.css',
})
export class FormularioRegistro {
  registroForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      relacion: ['Padre/Madre', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [true, Validators.requiredTrue],
    });
  }

  // Helper para verificar errores en el HTML de forma limpia
  isFieldInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Alternar visibilidad de contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const datos = {
        email: this.registroForm.value.email,
        contraseña: this.registroForm.value.password,
        nombres: this.registroForm.value.nombres,
        apellidos: this.registroForm.value.apellidos,
        telefono: this.registroForm.value.telefono,
        relacion: this.registroForm.value.relacion
      };

      this.usuarioService.registrarPublico(datos).subscribe({
        next: (respuesta) => {
          alert('✅ Registro exitoso. Ya puedes iniciar sesión con tu cuenta.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al registrar:', error);
          alert('❌ Error al registrar. Verifica que el correo no esté en uso.');
        }
      });
    } else {
      alert('⚠️ Por favor completa todos los campos correctamente.');
      this.registroForm.markAllAsTouched();
    }
  }
}
