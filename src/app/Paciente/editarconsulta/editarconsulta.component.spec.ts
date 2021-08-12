import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarconsultaComponent } from './editarconsulta.component';

describe('EditarconsultaComponent', () => {
  let component: EditarconsultaComponent;
  let fixture: ComponentFixture<EditarconsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarconsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
