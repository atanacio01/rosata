import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
import { ApiServiceService } from '../_services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {


  registroForm: FormGroup;
  public loading = false;
  alertmsg: boolean = false;
  message: String;
  CorreoElectronico: string ="";
  constructor(private api: ApiServiceService, private router: Router, private alert: AlertService, private auth: AuthenticationService) {
    this.crearFormulario();
  }
  ngOnInit() {
    this.ObtenerUsuario();
  }
  
  ObtenerUsuario() {
    this.api.getService('obtenerusuario/' + this.auth.IdUsuario(), false).pipe(first()).subscribe(
      data => {
          console.log(data);
          this.CorreoElectronico = data.Correo;
          this.registroForm.setValue(data);
      }, error => {
        this.alert.danger('Ha ocurrido un error inesperado, intente nuevamente.');
      });
  }

  actualizar() {
    this.loading = true;  
    this.registroForm.controls['Sexo'].setValue(this.registroForm.controls['Sexo'].value.Sexo);
    this.api.putService('actualizar', false, this.registroForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;
        this.router.navigateByUrl('');
      }, error => {
        this.loading = false;
        this.alertmsg =true;
        this.message = error.error;
      });
  }

  registrar() {
    this.loading = true;
    this.registroForm.controls['Sexo'].setValue(this.registroForm.controls['Sexo'].value.Sexo);
    this.api.postService('registro', false, this.registroForm.value).pipe(first()).subscribe(
      data => {
        this.loading = false;
        this.router.navigateByUrl('');
      }, error => {
        this.loading = false;
        this.alertmsg = true;
        this.message = error.error;
      });
  }

  private crearFormulario() {
    this.registroForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      Nombre: new FormControl(null, [Validators.required]),
      Apellido_Paterno: new FormControl(null, [Validators.required]),
      Apellido_Materno: new FormControl(null, [Validators.required]),
      Sexo: new FormControl(null, [Validators.required]),
      Telefono: new FormControl(null, [Validators.required]),
      Correo: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  sexo = [
    { id: 1, Sexo: 'Masculino' },
    { id: 2, Sexo: 'Femenino' },

  ]

}
