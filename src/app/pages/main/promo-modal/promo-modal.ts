import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promo-modal',
  imports: [CommonModule, RouterModule],
  templateUrl: './promo-modal.html',
  styleUrl: './promo-modal.css',
})
export class PromoModalComponent implements OnInit {
  isVisible: boolean = false;

  ngOnInit(): void {
    // Verificar si ya se cerró antes
    // const anuncioVisto = sessionStorage.getItem('anuncioVisto');

    //  if (!anuncioVisto) {
    // Esperar 2 segundos y mostrar
    setTimeout(() => {
      this.isVisible = true;
    }, 1000);
    // }
  }

  cerrar() {
    this.isVisible = false;
    sessionStorage.setItem('anuncioVisto', 'true');
  }
}
