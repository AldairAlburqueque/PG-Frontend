import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'info-comp',
  imports: [],
  templateUrl: './info-component.html',
  styleUrl: './info-component.css',
})
export class InfoComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer?: ElementRef;
  ngAfterViewInit() {
    // Usamos un pequeño setTimeout para asegurar que Angular haya terminado de pintar todo el HTML
    setTimeout(() => {
      const swiper = new Swiper('.mySwiper', {
        // ✅ IMPORTANTE 3: Debes registrar los módulos aquí
        modules: [Navigation, Pagination, Autoplay],

        loop: true, // Para que sea infinito
        slidesPerView: 1, // Asegura que solo se vea 1 imagen a la vez

        // Configuración de autoplay
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },

        // ✅ IMPORTANTE 4: Conectar con el HTML de las flechas
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },

        // Configuración de los puntitos
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }, 0); // El '0' es suficiente para esperar al siguiente ciclo del navegador
  }
}
