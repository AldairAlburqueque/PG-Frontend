import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'matri-comp',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './matricula-component.html',
  styleUrl: './matricula-component.css',
})
export class MatriculaComponent {}
