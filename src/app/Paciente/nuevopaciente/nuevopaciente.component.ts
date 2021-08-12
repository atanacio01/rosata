import { AuthenticationService } from '../../_services/authentication.service';
import { first } from 'rxjs/operators';
import { ApiServiceService } from '../../_services/api-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from "luxon";

@Component({
  selector: 'app-nuevopaciente',
  templateUrl: './nuevopaciente.component.html',
  styleUrls: ['./nuevopaciente.component.css'],
  providers: [NgbDatepickerConfig]
})
export class NuevopacienteComponent implements OnInit {

  model: NgbDateStruct;
  pacienteForm: FormGroup;
  loading: Boolean;

  constructor(private router: Router, private api: ApiServiceService,
    private auth: AuthenticationService, private alert: AlertService,
    config: NgbDatepickerConfig, calendar: NgbCalendar) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    let dt = DateTime.local();
    config.maxDate = { year: dt.year, month: dt.month, day: dt.day };
    // days that don't belong to current month are not visible
    // config.outsideDays = 'hidden';

    // weekends are disabled
    // config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
    this.crearFormulario();
  }

  ngOnInit() {

  }

  perfil() {
    this.router.navigateByUrl('pacientes/perfil');
  }


  guardarPaciente() {
    console.log(this.pacienteForm.value);
    this.pacienteForm.controls['Id_Usuario'].setValue(this.auth.UsuarioActual().user.id);
    this.pacienteForm.controls['Sexo'].setValue(this.pacienteForm.controls['Sexo'].value.Sexo);
    let convert = this.pacienteForm.controls['Fecha_Nacimiento'].value;
    let fecha = DateTime.local(convert.year,convert.month,convert.day).setZone('America/Mexico_City');
    this.pacienteForm.controls['Fecha_Nacimiento'].setValue(fecha);
    this.api.postService('Pacientes/Nuevo', false, this.pacienteForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;
        this.alert.success('Se ha actualizado correctamente.');
        this.router.navigateByUrl('pacientes/perfil/' + data.Id_Paciente);
      }, error => {
        this.loading = false;
        this.alert.danger('Ha ocurrido un error, por favor inténtelo nuevamente.');
      });
  }

  private crearFormulario() {
    this.pacienteForm = new FormGroup({
      Id_Usuario: new FormControl(null, []),
      Nombre: new FormControl(null, [Validators.required]),
      Apellido_Paterno: new FormControl(null, [Validators.required]),
      Apellido_Materno: new FormControl(null, [Validators.required]),
      Sexo: new FormControl(null, [Validators.required]),
      Fecha_Nacimiento: new FormControl(null, [Validators.required]),
      Residencia: new FormControl(null, Validators.required),
      Religion: new FormControl(null, []),
      Informante: new FormControl(null, [])
    });
  }

  sexo = [
    { id: 1, Sexo: 'Masculino' },
    { id: 2, Sexo: 'Femenino' },

  ]
}
