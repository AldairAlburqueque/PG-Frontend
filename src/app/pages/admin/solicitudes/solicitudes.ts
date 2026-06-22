import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitud } from './solicitudes.model';
import { SolicitudService } from '../../../services/solicitud.service';
import { AlumnoService } from '../../../services/alumno.service';
import { ApoderadoService } from '../../../services/apoderado.service';
import { AulaService } from '../../../services/aula.service';
import { Aula } from '../aulas/aula.model';
import { Alumno } from '../ninos/alumno.model';
import { Apoderado } from '../apoderados/apoderados.model';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {
  solicitudes: Solicitud[] = [];
  alumnos: Alumno[] = [];
  apoderados: Apoderado[] = [];
  aulas: Aula[] = [];

  filtro: string = '';
  mostrarModal: boolean = false;
  esEdicion = false;

  modoAlumno: 'existente' | 'nuevo' = 'existente';
  modoApoderado: 'existente' | 'nuevo' = 'existente';

  nuevoAlumno: any = {
    nombreCompleto: '',
    sexo: 'M',
    edad: 5,
    condicion: 'Nuevo',
    observacion: '',
    activo: true
  };

  nuevoApoderado: any = {
    nombres: '',
    apellidos: '',
    relacion: '',
    telefono: '',
    activo: true
  };

  solicitudForm: any = {
    anio: new Date().getFullYear(),
    periodo: 1,
    fechaSolicitud: new Date().toISOString().split('T')[0],
    alumno: { id: null },
    aula: { id: null },
    apoderado: { id: null },
    activo: true,
  };

  constructor(
    private solicitudService: SolicitudService,
    private alumnoService: AlumnoService,
    private apoderadoService: ApoderadoService,
    private aulaService: AulaService
  ) {}

  get solicitudesFiltradas() {
    if (!this.filtro) {
      return this.solicitudes;
    }

    return this.solicitudes.filter(s =>
      s.nombreAlumno.toLowerCase().includes(this.filtro.toLowerCase()) ||
      s.nombreApoderado.toLowerCase().includes(this.filtro.toLowerCase()) ||
      s.nombreAula.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  ngOnInit() {
    this.cargarSolicitudes();
    this.cargarAlumnos();
    this.cargarApoderados();
    this.cargarAulas();
  }

  cargarSolicitudes() {
    this.solicitudService.listar().subscribe(data => {
      this.solicitudes = data;
    });
  }

  cargarAlumnos() {
    this.alumnoService.listar().subscribe(data => {
      this.alumnos = data;
    });
  }

  cargarApoderados() {
    this.apoderadoService.listar().subscribe(data => {
      this.apoderados = data;
    });
  }

  cargarAulas() {
    this.aulaService.listar().subscribe(data => {
      this.aulas = data;
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.esEdicion = false;
  }

  onModoAlumnoChange() {
    this.solicitudForm.alumno.id = null;
    this.nuevoAlumno = {
      nombreCompleto: '',
      sexo: 'M',
      edad: 5,
      condicion: 'Nuevo',
      observacion: '',
      activo: true
    };
  }

  onModoApoderadoChange() {
    this.solicitudForm.apoderado.id = null;
    this.nuevoApoderado = {
      nombres: '',
      apellidos: '',
      relacion: '',
      telefono: '',
      activo: true
    };
  }

  guardar() {
    // Preparar alumno
    let alumno: any;
    if (this.modoAlumno === 'nuevo') {
      alumno = { ...this.nuevoAlumno };
    } else {
      alumno = { id: this.solicitudForm.alumno.id };
    }

    // Preparar apoderado
    let apoderado: any;
    if (this.modoApoderado === 'nuevo') {
      apoderado = { ...this.nuevoApoderado };
    } else {
      apoderado = { id: this.solicitudForm.apoderado.id };
    }

    const datos = {
      año: this.solicitudForm.anio,
      periodo: this.solicitudForm.periodo,
      fechaSolicitud: this.solicitudForm.fechaSolicitud,
      alumno: alumno,
      aula: { id: this.solicitudForm.aula.id },
      apoderado: apoderado,
      activo: this.solicitudForm.activo,
    };

    if (this.solicitudForm.id) {
      this.solicitudService
        .actualizar(this.solicitudForm.id, datos)
        .subscribe(() => this.cargarSolicitudes());
    } else {
      this.solicitudService
        .crear(datos)
        .subscribe(() => this.cargarSolicitudes());
    }

    this.cerrarModal();
    this.limpiar();
  }

  editar(solicitud: Solicitud) {
    this.esEdicion = true;

    this.solicitudForm = {
      id: solicitud.id,
      anio: solicitud.anio,
      periodo: solicitud.periodo,
      fechaSolicitud: solicitud.fechaSolicitud,
      alumno: { id: solicitud.alumnoId },
      aula: { id: solicitud.aulaId },
      apoderado: { id: solicitud.apoderadoId },
      activo: solicitud.activo,
    };

    this.mostrarModal = true;
  }

  eliminar(id: number) {
    if (confirm('¿Está seguro de eliminar esta solicitud?')) {
      this.solicitudService.eliminar(id).subscribe(() => {
        this.cargarSolicitudes();
      });
    }
  }

  limpiar() {
    this.modoAlumno = 'existente';
    this.modoApoderado = 'existente';
    
    this.nuevoAlumno = {
      nombreCompleto: '',
      sexo: 'M',
      edad: 5,
      condicion: 'Nuevo',
      observacion: '',
      activo: true
    };
    
    this.nuevoApoderado = {
      nombres: '',
      apellidos: '',
      relacion: '',
      telefono: '',
      activo: true
    };

    this.solicitudForm = {
      anio: new Date().getFullYear(),
      periodo: 1,
      fechaSolicitud: new Date().toISOString().split('T')[0],
      alumno: { id: null },
      aula: { id: null },
      apoderado: { id: null },
      activo: true,
    };
  }
}
