import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apoderados } from './apoderados';

describe('Apoderados', () => {
  let component: Apoderados;
  let fixture: ComponentFixture<Apoderados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apoderados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Apoderados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
