import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevopacienteComponent } from './nuevopaciente.component';

describe('NuevopacienteComponent', () => {
  let component: NuevopacienteComponent;
  let fixture: ComponentFixture<NuevopacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevopacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevopacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
