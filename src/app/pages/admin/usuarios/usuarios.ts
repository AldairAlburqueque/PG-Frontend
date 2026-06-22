import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  mostrarModal = false;
  modoEdicion = false;
  usuarioForm: FormGroup;
  emailOriginal = '';

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.minLength(6)]],
      rol: ['ADMIN', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        // Si es 401/403, el usuario fue eliminado/desactivado
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Error al cargar usuarios');
        }
      }
    });
  }

  abrirModalNuevo(): void {
    this.modoEdicion = false;
    this.emailOriginal = '';
    this.usuarioForm.reset({
      email: '',
      contraseña: '',
      rol: 'ADMIN',
      activo: true
    });
    this.usuarioForm.get('email')?.enable();
    this.usuarioForm.get('contraseña')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.usuarioForm.get('contraseña')?.updateValueAndValidity();
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.emailOriginal = usuario.email;
    this.usuarioForm.patchValue({
      email: usuario.email,
      contraseña: '',
      rol: usuario.rol,
      activo: usuario.activo
    });
    this.usuarioForm.get('email')?.disable();
    this.usuarioForm.get('contraseña')?.clearValidators();
    this.usuarioForm.get('contraseña')?.updateValueAndValidity();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioForm.reset();
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      alert('⚠️ Por favor completa todos los campos correctamente');
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const datos: any = {
      email: this.modoEdicion ? this.emailOriginal : this.usuarioForm.get('email')?.value,
      rol: this.usuarioForm.value.rol,
      activo: this.usuarioForm.value.activo
    };

    if (this.usuarioForm.value.contraseña) {
      datos.contraseña = '{noop}' + this.usuarioForm.value.contraseña;
    }

    if (this.modoEdicion) {
      this.usuarioService.actualizar(this.emailOriginal, datos).subscribe({
        next: () => {
          alert('✅ Usuario actualizado correctamente');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('❌ Error al actualizar usuario');
        }
      });
    } else {
      if (!this.usuarioForm.value.contraseña) {
        alert('⚠️ La contraseña es obligatoria para nuevos usuarios');
        return;
      }
      datos.contraseña = '{noop}' + this.usuarioForm.value.contraseña;
      
      this.usuarioService.guardar(datos).subscribe({
        next: () => {
          alert('✅ Usuario creado correctamente');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('❌ Error al crear usuario. Puede que el email ya exista.');
        }
      });
    }
  }

  cambiarEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.activo;
    const mensaje = nuevoEstado ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Seguro que deseas ${mensaje} el usuario ${usuario.email}?`)) {
      return;
    }

    this.usuarioService.cambiarEstado(usuario.email, nuevoEstado).subscribe({
      next: () => {
        const emailActual = sessionStorage.getItem('authUser');
        // Si el usuario que se desactiva es el actual, redirigir al login
        if (emailActual === usuario.email && !nuevoEstado) {
          alert(`✅ Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert(`✅ Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
          this.cargarUsuarios();
        }
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
        alert('❌ Error al cambiar el estado');
      }
    });
  }

  eliminar(email: string): void {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${email}? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.usuarioService.eliminar(email).subscribe({
      next: () => {
        const emailActual = sessionStorage.getItem('authUser');
        // Si el usuario que se elimina es el actual, redirigir al login
        if (emailActual === email) {
          alert('✅ Usuario eliminado correctamente');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('✅ Usuario eliminado correctamente');
          this.cargarUsuarios();
        }
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('❌ Error al eliminar usuario');
      }
    });
  }
}
