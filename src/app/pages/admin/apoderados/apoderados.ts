import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apoderado } from './apoderados.model';
import { ApoderadoService } from '../../../services/apoderado.service';

@Component({
  selector: 'app-apoderados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apoderados.html',
  styleUrl: './apoderados.css',
})
export class Apoderados implements OnInit {
  apoderados: Apoderado[] = [];

  filtro: string = ''

  mostrarModal: boolean = false;

  esEdicion = false;

  apoderadoForm: Apoderado = {
    nombres: '',
    apellidos: '',
    relacion: '',
    telefono:'',
    activo: true,
  };

  constructor(private apoderadoService: ApoderadoService) {}

  get apoderadoFiltrados() {
    if (!this.filtro) {
      return this.apoderados;
    }

    return this.apoderados.filter(a =>
      a.nombres
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
    this.cargarApoderados();
  }

  cargarApoderados() {
    this.apoderadoService.listar().subscribe(data => {
      this.apoderados = data;
    });
  }

  guardar() {
    if (this.apoderadoForm.id) {
      this.apoderadoService
        .actualizar(this.apoderadoForm.id, this.apoderadoForm)
        .subscribe(() => this.cargarApoderados());
    } else {
      this.apoderadoService
        .crear(this.apoderadoForm)
        .subscribe(() => this.cargarApoderados());
    }

    this.cerrarModal();
  }

  editar(apoderado: Apoderado) {
    this.esEdicion = true;

    this.apoderadoForm = {
      id: apoderado.id,
      nombres: apoderado.nombres,
      apellidos: apoderado.apellidos,
      relacion: apoderado.relacion,
      telefono: apoderado.telefono,
      activo: apoderado.activo,
    };

    this.mostrarModal = true;
  }

  eliminar(id: number) {
    this.apoderadoService.eliminar(id).subscribe(() => {
    this.cargarApoderados();
    });
  }

  limpiar() {
    this.apoderadoForm = {
      nombres: '',
      apellidos: '',
      relacion: '',
      telefono:'',
      activo: true,
    };
  }
}