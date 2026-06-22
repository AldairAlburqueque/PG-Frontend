import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../pages/admin/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
