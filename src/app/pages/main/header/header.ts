import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'header-comp',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Función para hacer scroll
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth', // Esto hace la animación suave
        block: 'start', // Alinea la sección al inicio de la pantalla
      });
    }
  }

  // Variable para controlar el estado del menú móvil
  isMobileMenuOpen = false;

  // Función para abrir/cerrar el menú
  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
//
