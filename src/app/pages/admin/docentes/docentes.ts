import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Docente} from './docente.model';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css',
})
export class Docentes implements OnInit {
  docentes: Docente[] = [];

  filtro: string = ''

  mostrarModal: boolean = false;

  esEdicion = false;

  docenteForm: Docente = {
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    telefono:'',
    activo: true,
  };

  constructor(private docenteService: DocenteService) {}

  get docenteFiltrados() {
    if (!this.filtro) {
      return this.docentes;
    }

    return this.docentes.filter(a =>
      a.nombre
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
    this.cargarDocentes();
  }

  cargarDocentes() {
    this.docenteService.listar().subscribe(data => {
      this.docentes = data;
    });
  }

  guardar() {
    if (this.docenteForm.id) {
      this.docenteService
        .actualizar(this.docenteForm.id, this.docenteForm)
        .subscribe(() => this.cargarDocentes());
    } else {
      this.docenteService
        .crear(this.docenteForm)
        .subscribe(() => this.cargarDocentes());
    }

    this.cerrarModal();
  }

  editar(docente: Docente) {
    this.esEdicion = true;

    this.docenteForm = {
      id: docente.id,
      nombre: docente.nombre,
      apellidos: docente.apellidos,
      email: docente.email,
      dni: docente.dni,
      telefono: docente.telefono,
      activo: docente.activo,
    };

    this.mostrarModal = true;
  }

  eliminar(id: number) {
    this.docenteService.eliminar(id).subscribe(() => {
    this.cargarDocentes();
    });
  }

  limpiar() {
    this.docenteForm = {
      nombre: '',
      apellidos: '',
      email: '',
      dni: '',
      telefono:'',
      activo: true,
    };
  }
}
