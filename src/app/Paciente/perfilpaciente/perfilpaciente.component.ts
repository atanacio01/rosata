import { AuthenticationService } from './../../_services/authentication.service';
import { AlertService } from 'ngx-alerts';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd, } from '@angular/router';
import { first, filter } from 'rxjs/operators';
import { ApiServiceService } from './../../_services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateTime } from "luxon";
import { NgbDatepickerConfig, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfilpaciente',
  templateUrl: './perfilpaciente.component.html',
  styleUrls: ['./perfilpaciente.component.css'],
  providers: [DatePipe, NgbDatepickerConfig]
})
export class PerfilpacienteComponent implements OnInit {

  currentId: Number;
  pacienteActual: any;
  mostarInfo: Boolean = false;
  pacienteForm: FormGroup;
  loading: Boolean;
  NombrePaciente: string = '';
  FechaNacimiento: string = '';
  EdadPaciente: string = '';
  opciones = [
    {
      metodo: 'info',
      texto: 'Info',
      icono: 'fas fa-info-circle',
      activa: 'tab-active'
    },
    {
      metodo: 'historia',
      texto: 'Historia',
      icono: 'fas fa-notes-medical',
      activa: 'tab-active'
    },
    {
      metodo: 'consultas',
      texto: 'Consultas',
      icono: 'fas fa-stethoscope',
      activa: 'tab-active'
    },
    {
      metodo: 'vacunas',
      texto: 'Vacunación',
      icono: 'fas fa-syringe',
      activa: 'tab-active'
    },
    // {
    //   metodo: 'archivos',
    //   texto: 'Archivos',
    //   icono: 'fas fa-folder',
    //   activa: 'tab-active'
    // }
  ]
  selected: any = this.opciones[0];

  constructor(private api: ApiServiceService, private route: ActivatedRoute, private auth: AuthenticationService,
    private router: Router, private datePipe: DatePipe, private alert: AlertService, config: NgbDatepickerConfig, calendar: NgbCalendar) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    let dt = DateTime.local();
    config.maxDate = { year: dt.year, month: dt.month, day: dt.day };
    this.crearFormulario();
    this.route.params.subscribe(params => this.currentId = params.id);
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      var event = JSON.stringify(e);
      var json = JSON.parse(event);
      if (json.url == '/pacientes/perfil/' + this.currentId) {
        this.mostarInfo = false;
      }
      else {
        this.mostarInfo = true;
      }
      if (json.url.toLowerCase().includes('consultas')) {
        this.selected = this.opciones[2];
      }
      else if (json.url.toLowerCase().includes('historia')) {
        this.selected = this.opciones[1];
      }
      else if (json.url.toLowerCase().includes('vacunacion')) {
        this.selected = this.opciones[3];
      }
    });
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.obtenerpaciente(params.id);
    });
  }

  obtenerpaciente(id: Number) {
    this.api.getService('ObtenerPacientePorId/' + id, false).pipe(first()).subscribe(
      data => {
        // console.log(data);
        this.pacienteActual = data;
        this.NombrePaciente = data.Nombre_Completo;
        this.EdadPaciente = this.ageCalculator(this.pacienteActual.Fecha_Nacimiento);
        this.pacienteForm.setValue(this.pacienteActual);
        let fecha = DateTime.fromISO(this.pacienteActual.Fecha_Nacimiento).setZone('America/Mexico_City');
        // console.log(fecha);
        this.FechaNacimiento = this.datePipe.transform(fecha,'dd/MM/yyyy');
        this.pacienteForm.controls['Fecha_Nacimiento'].setValue({
          year: Number(fecha.year),
          month: Number(fecha.month),
          day: Number(fecha.day)
        });
      }, error => {
        this.alert.danger('Ha ocurrido un error inesperado, intente nuevamente.');
      });
  }

  ngAfterViewInit() {
    // this.router.navigate(['historia/' + this.currentId], { relativeTo: this.route });
  }

  goto(opcion: String, item) {
    // alert(opcion);
    this.selected = item;
    if (opcion == 'info') {
      this.router.navigateByUrl('pacientes/perfil/' + this.currentId);
    }
    if (opcion == 'historia') {
      this.router.navigate(['historia/' + this.currentId], { relativeTo: this.route });
    }
    if (opcion == 'consultas') {
      this.router.navigate(['consultas/' + this.currentId], { relativeTo: this.route });
    }
    if (opcion == 'vacunas') {
      this.router.navigate(['vacunacion/' + this.currentId], { relativeTo: this.route });
    }
  }

  isActive(item) {
    return this.selected === item;
  };


  nuevaconsulta() {
    this.selected = this.opciones[2];
    this.router.navigate(['consultas/nueva/' + this.currentId], { relativeTo: this.route });
  }

  actualizarPaciente() {
    this.loading = true;
    this.pacienteForm.controls['Id_Usuario'].setValue(this.auth.UsuarioActual().user.id);
    this.pacienteForm.controls['Sexo'].setValue(this.pacienteForm.controls['Sexo'].value.Sexo);
    let convert = this.pacienteForm.controls['Fecha_Nacimiento'].value;
    let fecha = DateTime.local(convert.year,convert.month,convert.day).setZone('America/Mexico_City');
    this.pacienteForm.controls['Fecha_Nacimiento'].setValue(fecha);
    this.api.putService('Pacientes/Actualizar', false, this.pacienteForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;
        this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;
        this.alert.danger('Ha ocurrido un error, por favor inténtelo nuevamente.');
      });
  }

  private crearFormulario() {
    this.pacienteForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Usuario: new FormControl('', [Validators.required]),
      Nombre: new FormControl('', [Validators.required]),
      Apellido_Paterno: new FormControl('', [Validators.required]),
      Apellido_Materno: new FormControl('', [Validators.required]),
      Nombre_Completo: new FormControl('', [Validators.required]),
      Sexo: new FormControl('', [Validators.required]),
      Fecha_Nacimiento: new FormControl('', [Validators.required]),
      Residencia: new FormControl('', Validators.required),
      Religion: new FormControl('', []),
      Informante: new FormControl('', []),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });
  }
  sexo = [
    { id: 1, Sexo: 'Masculino' },
    { id: 2, Sexo: 'Femenino' },

  ]

  ageCalculator(fecha){
    // Si la fecha es correcta, calculamos la edad
    var values=fecha.split("-");
    var dia = values[2];
    var mes = values[1];
    var ano = values[0];

    // cogemos los valores actuales
    var fecha_hoy = new Date();
    var ahora_ano = fecha_hoy.getFullYear();
    var ahora_mes = fecha_hoy.getMonth()+1;
    var ahora_dia = fecha_hoy.getDate();

    // realizamos el calculo
   //  var edad = (ahora_ano + 1900) - ano;
   var edad = (ahora_ano - ano);
    if ( ahora_mes < mes )
    {
        edad--;
    }
    if ((mes == ahora_mes) && (ahora_dia < dia))
    {
        edad--;
    }
    if (edad > 1900)
    {
        edad -= 1900;
    }

    // calculamos los meses
    var meses=0;
    if(ahora_mes>mes)
        meses=ahora_mes-mes;
    if(ahora_mes<mes)
        meses=12-(mes-ahora_mes);
    if(ahora_mes==mes && dia>ahora_dia)
        meses=11;

    // calculamos los dias
    var dias=0;
    if(ahora_dia>dia)
        dias=ahora_dia-dia;
    if(ahora_dia<dia)
    {
        var ultimoDiaMes=new Date(ahora_ano, ahora_mes, 0);
        dias=ultimoDiaMes.getDate()-(dia-ahora_dia);
    }
    return edad+" años, "+meses+" meses y "+dias+" días";
 }


}
