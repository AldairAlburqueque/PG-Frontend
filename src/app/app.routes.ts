import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

import { Inicio } from './pages/main/inicio/inicio';
import { FormularioMatricula } from './pages/main/formulario-matricula/formulario-matricula';
import { Login } from './pages/main/login/login';
import { FormularioRegistro } from './pages/main/formulario-registro/formulario-registro';

import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { Ninos } from './pages/admin/ninos/ninos';
import { Docentes } from './pages/admin/docentes/docentes';
import { Aulas } from './pages/admin/aulas/aulas';
import { Solicitudes } from './pages/admin/solicitudes/solicitudes';
import { Matriculas } from './pages/admin/matriculas/matriculas';
import { Usuarios } from './pages/admin/usuarios/usuarios';
import { Apoderados } from './pages/admin/apoderados/apoderados';
import { adminGuard, apoderadoGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },

      { path: 'inicio', component: Inicio },
      { path: 'matricula', component: FormularioMatricula, canActivate: [apoderadoGuard] },
      { path: 'login', component: Login },
      { path: 'register', component: FormularioRegistro },
    ],
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'ninos', component: Ninos },
      { path: 'docentes', component: Docentes },
      { path: 'aulas', component: Aulas },
      { path: 'apoderados', component: Apoderados },
      { path: 'solicitudes', component: Solicitudes },
      { path: 'matriculas', component: Matriculas },
      { path: 'usuarios', component: Usuarios },
    ],
  },

  { path: '**', redirectTo: '' },
];
