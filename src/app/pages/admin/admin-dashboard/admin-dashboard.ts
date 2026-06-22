import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {
  // KPIs con tendencias simuladas
  kpis = [
    {
      titulo: 'Total Alumnos',
      valor: '1,240',
      icono: 'fas fa-users',
      color: 'bg-blue',
      tendencia: '+12%',
      subida: true,
    },
    {
      titulo: 'Nuevas Matrículas',
      valor: '45',
      icono: 'fas fa-user-plus',
      color: 'bg-green',
      tendencia: '+5%',
      subida: true,
    },
    {
      titulo: 'Ingresos (Mes)',
      valor: 'S/ 12,500',
      icono: 'fas fa-dollar-sign',
      color: 'bg-purple',
      tendencia: '-2%',
      subida: false,
    },
    {
      titulo: 'Solicitudes Pendientes',
      valor: '8',
      icono: 'fas fa-clock',
      color: 'bg-orange',
      tendencia: 'Igual',
      subida: true,
    },
  ];

  ultimasMatriculas = [
    {
      id: 'MAT-001',
      alumno: 'Juan Perez',
      nivel: 'Kinder',
      grado: 'A',
      fecha: '15 Dic, 2025',
      estado: 'Completado',
    },
    {
      id: 'MAT-002',
      alumno: 'Maria Gomez',
      nivel: 'Inicial 4 años',
      grado: 'A',
      fecha: '15 Dic, 2025',
      estado: 'Pendiente',
    },
    {
      id: 'MAT-003',
      alumno: 'Luis Silva',
      nivel: 'Inicial 5 años',
      grado: 'A',
      fecha: '14 Dic, 2025',
      estado: 'Cancelado',
    },
    {
      id: 'MAT-004',
      alumno: 'Ana Rojas',
      nivel: 'Inicial 4 años',
      grado: 'B',
      fecha: '14 Dic, 2025',
      estado: 'Completado',
    },
  ];

  // Helper para colores de estado
  getStatusClass(estado: string): string {
    switch (estado) {
      case 'Completado':
        return 'status-success';
      case 'Pendiente':
        return 'status-warning';
      case 'Cancelado':
        return 'status-danger';
      default:
        return '';
    }
  }
}
