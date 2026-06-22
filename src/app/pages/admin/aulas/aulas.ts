import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aula, Docente } from './aula.model';
import { AulaService } from '../../../services/aula.service';
import { DocenteService } from '../../../services/docente.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aulas.html',
  styleUrl: './aulas.css',
})
export class Aulas implements OnInit {
  aulas: Aula[] = [];
  docentes: Docente[] = [];
  filtro: string = '';
  mostrarModal: boolean = false;
  esEdicion = false;

  aulaForm: Aula = {
    nombre: '',
    activo: true,
  };

  constructor(
    private aulaService: AulaService,
    private docenteService: DocenteService
  ) {}

  get aulasFiltradas() {
    if (!this.filtro) {
      return this.aulas;
    }

    return this.aulas.filter(a =>
      a.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Método para comparar docentes en el select
  compararDocentes(d1: Docente | null, d2: Docente | null): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2;
  }

  ngOnInit() {
    this.cargarAulas();
    this.cargarDocentes();
  }

  cargarAulas() {
    this.aulaService.listar().subscribe(data => {
      this.aulas = data;
    });
  }

  cargarDocentes() {
    this.docenteService.listar().subscribe(data => {
      this.docentes = data;
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.esEdicion = false;
    this.limpiar();
  }

  guardar() {
    if (this.aulaForm.id) {
      this.aulaService
        .actualizar(this.aulaForm.id, this.aulaForm)
        .subscribe(() => {
          this.cargarAulas();
          this.cerrarModal();
        });
    } else {
      this.aulaService
        .crear(this.aulaForm)
        .subscribe(() => {
          this.cargarAulas();
          this.cerrarModal();
        });
    }
  }

  editar(aula: Aula) {
    this.esEdicion = true;
    this.aulaForm = {
      id: aula.id,
      nombre: aula.nombre,
      docente: aula.docente,
      activo: aula.activo,
    };
    this.mostrarModal = true;
  }

  eliminar(id: number | undefined) {
    if (id && confirm('¿Estás seguro de que deseas eliminar esta aula?')) {
      this.aulaService.eliminar(id).subscribe(() => {
        this.cargarAulas();
      });
    }
  }

  limpiar() {
    this.aulaForm = {
      nombre: '',
      activo: true,
    };
  }
}
