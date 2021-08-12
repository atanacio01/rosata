import { NgxLoadingModule } from 'ngx-loading';
import { AlertService } from 'ngx-alerts';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from './../../_services/authentication.service';
import { ApiServiceService } from './../../_services/api-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevaconsulta',
  templateUrl: './nuevaconsulta.component.html',
  styleUrls: ['./nuevaconsulta.component.css']
})
export class NuevaconsultaComponent implements OnInit {

  consultaForm: FormGroup;
  idPacienteActual: any;
  loading: Boolean;

  constructor(private api: ApiServiceService, private auth: AuthenticationService,
    private router: Router, private route: ActivatedRoute, private alert: AlertService) {
    this.route.params.subscribe(params => this.idPacienteActual = params.id);
    this.crearFormulario();
  }

  ngOnInit() {
    // this.verConsulta();
  }

  nuevaConsulta() {
    this.loading = true;
    this.consultaForm.controls['Id_Paciente'].setValue(this.idPacienteActual);
    this.api.postService('Consultas/Nueva', false, this.consultaForm.value).pipe(first()).subscribe(
      data => {
        console.log(data, this.idPacienteActual);
        this.loading = false;
        this.alert.success('Se ha actualizado correctamente');
        // this.router.navigate(['../pacientes/perfil/'+data.Id_Paciente +'/consultas/' + data.Id_Paciente]);
        // this.router.navigate(['../../consultas/' + data.Id_Paciente]);
      }, error => {
        this.loading = false;
        this.alert.danger('Ha ocurrido un error.');
      });
  }

  verConsulta() {
    this.loading = true;
    // this.consultaForm.controls['Id_Paciente'].setValue(this.idPacienteActual);
    this.api.getService('Consultas/ObtenerConsultaPorId/' + this.idPacienteActual, false).pipe(first()).subscribe(
      data => {
        console.log("data", data[0]);
        this.loading = false;
        this.consultaForm.setValue(data[0]);
        // this.alert.success('Se ha actualizado correctamente');
        // this.router.navigate(['../pacientes/perfil/'+data.Id_Paciente +'/consultas/' + data.Id_Paciente]);
      }, error => {
        this.loading = false;
        console.log(error);
        this.alert.danger('Ha ocurrido un error.');
      });
  }

  crearFormulario() {
    this.consultaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Paciente: new FormControl('', [Validators.required]),
      Nota_Evolucion: new FormControl('', [Validators.required]),
      Altura: new FormControl('', [Validators.required]),
      Peso: new FormControl('', [Validators.required]),
      TA: new FormControl('', [Validators.required]),
      Temperatura: new FormControl('', [Validators.required]),
      FC: new FormControl('', Validators.required),
      FR: new FormControl('', []),
      O2: new FormControl('', []),
      IMC: new FormControl('', []),
      PC: new FormControl('', []),
      Exploracion_Fisica: new FormControl('', []),
      Resultados_Laboratorio: new FormControl('', []),
      Diagnostico: new FormControl('', []),
      Orden_Estudio: new FormControl('', []),
      Tratamiento: new FormControl('', []),
      Interconsulta: new FormControl('', []),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });
  }


}
