import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alumno } from './alumno.model';
import { AlumnoService } from '../../../services/alumno.service';

@Component({
  selector: 'app-ninos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ninos.html',
  styleUrl: './ninos.css',
})
export class Ninos implements OnInit {
  alumnos: Alumno[] = [];

  filtro: string = ''

  mostrarModal: boolean = false;

  esEdicion = false;

  alumnoForm: Alumno = {
    nombreCompleto: '',
    sexo: '',
    edad: 0,
    condicion: '',
    activo: true,
    observacion: '',
  };

  constructor(private alumnoService: AlumnoService) {}

  get alumnosFiltrados() {
    if (!this.filtro) {
      return this.alumnos;
    }

    return this.alumnos.filter(a =>
      a.nombreCompleto
        .toLowerCase()
        .includes(this.filtro.toLowerCase())
    );
  }

  abrirModal() {
      this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  ngOnInit() {
    this.cargarAlumnos();
  }

  cargarAlumnos() {
    this.alumnoService.listar().subscribe(data => {
      this.alumnos = data;
    });
  }

  guardar() {
    if (this.alumnoForm.id) {
      this.alumnoService
        .actualizar(this.alumnoForm.id, this.alumnoForm)
        .subscribe(() => this.cargarAlumnos());
    } else {
      this.alumnoService
        .crear(this.alumnoForm)
        .subscribe(() => this.cargarAlumnos());
    }

    this.cerrarModal();
  }

  editar(alumno: Alumno) {
    this.esEdicion = true;

    this.alumnoForm = {
      id: alumno.id,
      nombreCompleto: alumno.nombreCompleto,
      edad: alumno.edad,
      sexo: alumno.sexo,
      condicion: alumno.condicion,
      activo: alumno.activo,
    };

    this.mostrarModal = true;
  }

  eliminar(id: number) {
    this.alumnoService.eliminar(id).subscribe(() => {
      this.cargarAlumnos();
    });
  }

  limpiar() {
    this.alumnoForm = {
      nombreCompleto: '',
      sexo: '',
      edad: 0,
      condicion: '',
      activo: true,
      observacion: '',
    };
  }
}
