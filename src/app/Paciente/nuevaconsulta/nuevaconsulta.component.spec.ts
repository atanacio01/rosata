import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaconsultaComponent } from './nuevaconsulta.component';

describe('NuevaconsultaComponent', () => {
  let component: NuevaconsultaComponent;
  let fixture: ComponentFixture<NuevaconsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaconsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
