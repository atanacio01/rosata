import { AlertService } from 'ngx-alerts';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiServiceService } from './../../_services/api-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  currentId: Number;
  pacienteActual: any;
  idPacienteActual: any;
  loading: Boolean;
  infoGeneralForm: FormGroup;
  aHeredoFamForm: FormGroup;
  aPersonalesNPForm: FormGroup;
  aGinecologicosForm: FormGroup;
  desarrolloForm: FormGroup;
  exploracionForm:FormGroup;
  appForm: FormGroup;
  NombrePaciente:string = '';

  constructor(private api: ApiServiceService, private route: ActivatedRoute, private alert: AlertService) {
    this.CrearFormularios();
    this.route.params.subscribe(params => {
      this.idPacienteActual = params.id;
      this.obtenerHisitoriaClinica(params.id);
    });
    
  }

  ngOnInit() {
    
  }

  obtenerHisitoriaClinica(id: Number) {
    // this.loading = true;
    this.api.getService('Historia/Obtener/' + id, false).pipe(first()).subscribe(
      data => {
        console.log("data",data);
        this.infoGeneralForm.setValue(data);
        this.obtenerAntecedentesNoPatologicos(data.id);
        this.obtenerHeredoFamiliares(data.id);
        this.obtenerGinecologicos(data.id);
        this.obtenerDesarrollo(data.id);
        this.obtenerPersonalesPatologicos(data.id);
        this.obtenerExploracion(data.id);
        this.loading = false;
      }, error => {
        this.loading = false;
        console.log(error);
      });
  }

  guardarHistoriaClinica() {
    this.loading = true;
    this.infoGeneralForm.controls['Id_Paciente'].setValue(this.idPacienteActual);
    this.api.postService('Historia/Nueva', false, this.infoGeneralForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;
        this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.alert.danger('No se ha podido actualizar, intente nuevamente.');
        this.loading = false;
      });
  }

  guardarAntecedentesNoPatologicos() {
    this.loading = true;
    this.aPersonalesNPForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/NuevoNoPatologico', false, this.aPersonalesNPForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerAntecedentesNoPatologicos(id: Number) {
    this.api.getService('Historia/ObtenerAntecedentesNoPatologicos/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.aPersonalesNPForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }

  guardarHeredoFamiliares() {
    this.loading = true;
    this.aHeredoFamForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/NuevoHeredoFamiliar', false, this.aHeredoFamForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerHeredoFamiliares(id: Number) {
    this.api.getService('Historia/ObtenerHeredoFamiliares/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.aHeredoFamForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }

  guardarGinecologicos() {
    this.loading = true;
    this.aGinecologicosForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/CrearAntGinecologicos', false, this.aGinecologicosForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerGinecologicos(id: Number) {
    this.api.getService('Historia/ObtenerAntGinecologicos/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.aGinecologicosForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }

  guardarDesarrollo() {
    this.loading = true;
    this.desarrolloForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/CrearDesarrollo', false, this.desarrolloForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerDesarrollo(id: Number) {
    this.api.getService('Historia/ObtenerDesarrollo/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.desarrolloForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }


  guardarPersonalesPatologicos() {
    this.loading = true;
    this.appForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/CrearPersonalesPatologicos', false, this.appForm.value).pipe(first()).subscribe(
      data => {
         this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerPersonalesPatologicos(id: Number) {
    this.api.getService('Historia/ObtenerPersonalesPatologicos/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.appForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }

  guardarExploracion() {
    this.loading = true;
    this.exploracionForm.controls['Id_Historia'].setValue(this.infoGeneralForm.controls['id'].value);
    this.api.postService('Historia/CrearExploracion', false, this.exploracionForm.value).pipe(first()).subscribe(
      data => {
         this.loading = false;this.alert.success('Se ha actualizado correctamente.');
      }, error => {
        this.loading = false;this.alert.danger('No se ha podido actualizar, intente nuevamente.');
      });
  }

  obtenerExploracion(id: Number) {
    this.api.getService('Historia/ObtenerExploracion/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.exploracionForm.setValue(data);
      }, error => {
        console.log(error);
      });
  }


  CrearFormularios() {
    this.infoGeneralForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Paciente: new FormControl('', [Validators.required]),
      Antecedentes_Importantes: new FormControl('', []),
      Alergias: new FormControl('', []),
      Refiere: new FormControl('', []),
      Observaciones: new FormControl('', []),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

    this.aHeredoFamForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Padre: new FormControl('', [Validators.required]),
      Madre: new FormControl('', [Validators.required]),
      Hermanos: new FormControl('', [Validators.required]),
      Otros_Familiares: new FormControl('', [Validators.required]),
      Historia_Economica: new FormControl('', [Validators.required]),
      Tipo_Familia: new FormControl('', [Validators.required]),
      Funcionalidad: new FormControl('', [Validators.required]),
      Dinamica: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

    this.aPersonalesNPForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Madre_Gesta: new FormControl('', [Validators.required]),
      Para: new FormControl('', [Validators.required]),
      Cesareas: new FormControl('', [Validators.required]),
      Abortos: new FormControl('', [Validators.required]),
      Edad_Embarazo: new FormControl('', [Validators.required]),
      Gestacion: new FormControl('', [Validators.required]),
      Complicaciones: new FormControl('', [Validators.required]),
      Alimentacion: new FormControl('', [Validators.required]),
      Trabajo_Parto: new FormControl('', [Validators.required]),
      Duracion_Trabajo_Parto: new FormControl('', [Validators.required]),
      Semanas_Gestacion: new FormControl('', [Validators.required]),
      Lugar_Atencion: new FormControl('', [Validators.required]),
      Obtencion_Producto: new FormControl('', [Validators.required]),
      Lugar_Atencion_Producto: new FormControl('', [Validators.required]),
      Complicaciones_Parto: new FormControl('', [Validators.required]),
      Caracteristicas_LiqPlacenta: new FormControl('', [Validators.required]),
      ANI: new FormControl('', [Validators.required]),
      Desarrollo_Psicomotor: new FormControl(false, [Validators.required]),
      ANI_Alimentacion: new FormControl('', [Validators.required]),
      ANI_Denticion: new FormControl(false, [Validators.required]),
      ANI_Inmunizaciones: new FormControl(false, [Validators.required]),
      Habitat_Higiene: new FormControl('', [Validators.required]),
      Respiro_Lloro: new FormControl(false, [Validators.required]),
      APGAR: new FormControl('', [Validators.required]),
      Silverman: new FormControl('', [Validators.required]),
      Maniobras_Reanimacion: new FormControl('', [Validators.required]),
      Amerito_Incubadora: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

    this.aGinecologicosForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Niño: new FormControl('', [Validators.required]),
      Niña: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

    this.desarrolloForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Psicomotor: new FormControl('', [Validators.required]),
      Motor_Fino: new FormControl('', [Validators.required]),
      Motor_Grueso: new FormControl('', [Validators.required]),
      Lenguaje: new FormControl('', [Validators.required]),
      Social_Adaptativo: new FormControl('', [Validators.required]),
      Desarrollo_Denticion: new FormControl('', [Validators.required]),
      Habitat: new FormControl('', [Validators.required]),
      Higiene: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

    this.exploracionForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Inspeccion_General: new FormControl('', []),
      PielFaneras: new FormControl('', []),
      Cabeza: new FormControl('', []),
      Ojos: new FormControl('', []),
      Oidos: new FormControl('', []),
      Nariz: new FormControl('', []),
      Boca: new FormControl('', []),
      Cuello: new FormControl('', []),
      Torax: new FormControl('', []),
      Corazon: new FormControl('', []),
      Abdomen: new FormControl('', []),
      Extremidades: new FormControl('', []),
      Genitales: new FormControl('', []),
      Rectal: new FormControl('', []),
      Vesicular: new FormControl('', []),
      Neurologico: new FormControl('', []),
      Pares_Craneales: new FormControl('', []),
      Reflejos: new FormControl('', []),
      Sis_MotorSensorial: new FormControl('', []),
      Muscular: new FormControl('', []),
      Columna: new FormControl('', []),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    })

    this.appForm = new FormGroup({
      id: new FormControl('1', [Validators.required]),
      Id_Historia: new FormControl('', [Validators.required]),
      Tipo_Padecimiento: new FormControl('', [Validators.required]),
      createdAt: new FormControl('', []),
      updatedAt: new FormControl('', [])
    });

  }



  guardarInformacionGeneral() {

  }

}
