import { ApiServiceService } from './../../_services/api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DateTime } from "luxon";

@Component({
  selector: 'app-vacunacion',
  templateUrl: './vacunacion.component.html',
  styleUrls: ['./vacunacion.component.css']
})
export class VacunacionComponent implements OnInit {
  vacunaForm: FormGroup;
  listaVacunacion : any;
  listaVacunas:any;
  idPacienteActual:any;

  constructor(private api: ApiServiceService, private router: Router, private route: ActivatedRoute) { 
    this.crearFormulario();
    this.route.params.subscribe(params => {
      this.idPacienteActual =params.id; 
      this.obtenerVacunas();
      this.obtenerVacunacion(params.id);
    });
  }

  ngOnInit() {
  }
  sexo = [
    { id: 1, Sexo: 'Masculino' },
    { id: 2, Sexo: 'Femenino' },

  ]
  obtenerVacunacion(id: Number) {
    this.api.getService('Vacunas/' + id, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.listaVacunacion =data;
      }, error => {
        console.log(error);
      });
  }

  obtenerVacunas(){
    this.api.getService('TodasVacunas', false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.listaVacunas =data;
      }, error => {
        console.log(error);
      });
  }

  EliminarVacuna(id: Number) {
    this.api.deleteService('EliminarVacuna/' + id, false).pipe(first()).subscribe(
      data => {
        this.obtenerVacunacion(this.idPacienteActual);
      }, error => {
        this.obtenerVacunacion(this.idPacienteActual);
      });
  }

  guardarVacuna() {
    this.vacunaForm.controls['Id_Paciente'].setValue(this.idPacienteActual);
    this.vacunaForm.controls['Id_Vacuna'].setValue(this.vacunaForm.controls['Vacuna'].value.id);
    this.vacunaForm.controls['Nombre'].setValue(this.vacunaForm.controls['Vacuna'].value.Nombre);
    let convert = this.vacunaForm.controls['Fecha_Ultima'].value;
    let fecha = DateTime.local(convert.year,convert.month,convert.day).setZone('America/Mexico_City');
    this.vacunaForm.controls['Fecha_Ultima'].setValue(fecha);
    this.api.postService('Vacunas/Nueva', false, this.vacunaForm.value).pipe(first()).subscribe(
      data => {        
        this.obtenerVacunacion(this.idPacienteActual);
        this.vacunaForm.reset();
      }, error => {

      });
  }

  private crearFormulario() {
    this.vacunaForm = new FormGroup({
      Id_Paciente: new FormControl(null, []),
      Id_Vacuna: new FormControl(null, []),
      Nombre: new FormControl(null, []),
      Vacuna: new FormControl(null, [Validators.required]),
      Fecha_Ultima: new FormControl(null, [Validators.required]),
    });
  }

}
