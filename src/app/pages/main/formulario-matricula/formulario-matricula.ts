import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatriculaService } from '../../../services/matricula';
import { ApoderadoService } from '../../../services/apoderado.service';
import { AuthService } from '../../../services/auth.service';
import { AulaService } from '../../../services/aula.service';

@Component({
  selector: 'app-formulario-matricula',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-matricula.html',
  styleUrl: './formulario-matricula.css',
})
export class FormularioMatricula implements OnInit {
  matriculaForm: FormGroup;
  fechaActual: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private apoderadoService: ApoderadoService,
    private authService: AuthService,
    private router: Router,

    private aulaService: AulaService,
  ) {
    this.matriculaForm = this.fb.group({
      // --- DATOS APODERADO (YA NO SE ENVÍAN AL BACKEND) ---
      nombresApoderado: [{ value: '', disabled: true }],
      apellidosApoderado: [{ value: '', disabled: true }],
      telefonoApoderado: [{ value: '', disabled: true }],
      dniApoderado: [{ value: '', disabled: true }],

      // --- DATOS ESTUDIANTE ---
      nombresEstudiante: ['', [Validators.required, Validators.minLength(5)]],
      sexoEstudiante: ['', Validators.required],
      edadEstudiante: ['', [Validators.required, Validators.min(3), Validators.max(18)]],
      aulaId: ['', Validators.required],
      condicionEstudiante: ['Nuevo', Validators.required],
      fechaRegistro: [this.fechaActual, Validators.required],

      // --- OTROS ---
      observacionesEstudiante: [''],
      confirmacion: [true, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para acceder al formulario de matrícula');
      this.router.navigate(['/login']);
      return;
    }

    // Cargar datos del apoderado autenticado
    this.apoderadoService.obtenerMiPerfil().subscribe({
      next: (apoderado: any) => {
        this.matriculaForm.patchValue({
          nombresApoderado: apoderado.nombres,
          apellidosApoderado: apoderado.apellidos,
          telefonoApoderado: apoderado.telefono,
          dniApoderado: 'N/A',
        });
      },
      error: (err: any) => {
        console.error('Error al cargar perfil de apoderado:', err);
        if (err.status === 401 || err.status === 403) {
          alert('⚠️ Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('⚠️ No se pudo cargar tu información de apoderado. Verifica tu sesión.');
        }
      },
    });
  }

  // Helper para saber si un campo es inválido (para pintar el borde rojo)
  esInvalido(campo: string): boolean {
    const control = this.matriculaForm.get(campo);
    return control ? control.invalid && control.touched : false;
  }

  enviarSolicitud() {
    if (this.matriculaForm.valid) {
      // ENVÍO AL BACKEND
      this.matriculaService.registrarMatricula(this.matriculaForm.value).subscribe({
        next: (respuesta: any) => {
          console.log('Éxito:', respuesta);
          alert('¡Matrícula registrada correctamente en el sistema!');
          this.limpiarFormulario(); // Limpia el formulario tras el éxito
        },
        error: (error: any) => {
          console.error('Error:', error);
          alert('Ocurrió un error al intentar guardar. Revisa que el Backend esté encendido.');
        },
      });
    } else {
      alert('⚠️ Por favor corrige los errores marcados en rojo.');
      this.matriculaForm.markAllAsTouched();
    }
  }

  limpiarFormulario() {
    // Guardar los valores del apoderado antes de resetear
    const nombresApoderado = this.matriculaForm.get('nombresApoderado')?.value;
    const apellidosApoderado = this.matriculaForm.get('apellidosApoderado')?.value;
    const telefonoApoderado = this.matriculaForm.get('telefonoApoderado')?.value;
    const dniApoderado = this.matriculaForm.get('dniApoderado')?.value;

    // Resetear solo los campos del estudiante
    this.matriculaForm.patchValue({
      nombresEstudiante: '',
      sexoEstudiante: '',
      edadEstudiante: '',
      aulaId: '',
      condicionEstudiante: 'Nuevo',
      fechaRegistro: this.fechaActual,
      observacionesEstudiante: '',
      confirmacion: true,
      // Mantener los datos del apoderado
      nombresApoderado: nombresApoderado,
      apellidosApoderado: apellidosApoderado,
      telefonoApoderado: telefonoApoderado,
      dniApoderado: dniApoderado,
    });

    // Limpiar el estado de touched de los campos del estudiante
    this.matriculaForm.get('nombresEstudiante')?.markAsUntouched();
    this.matriculaForm.get('sexoEstudiante')?.markAsUntouched();
    this.matriculaForm.get('edadEstudiante')?.markAsUntouched();
    this.matriculaForm.get('aulaId')?.markAsUntouched();
    this.matriculaForm.get('observacionesEstudiante')?.markAsUntouched();
  }
}
