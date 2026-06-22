import { Component } from '@angular/core';
import { InfoComponent } from '../info-component/info-component';
import { Content2Component } from '../content-2-component/content-2-component';
import { ContentComponent } from '../content-component/content-component';
import { MatriculaComponent } from '../matricula-component/matricula-component';
import { HeroComponent } from '../hero-component/hero-component';
import { ContactoComponent } from '../contacto-component/contacto-component';
import { PromoModalComponent } from '../promo-modal/promo-modal';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    InfoComponent,
    HeroComponent,
    MatriculaComponent,
    ContentComponent,
    Content2Component,
    ContactoComponent,
    PromoModalComponent
],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
