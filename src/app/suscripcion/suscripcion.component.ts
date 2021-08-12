import { ApiServiceService } from './../_services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { first } from 'rxjs/operators';
declare var Conekta: any;

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  cardForm: FormGroup;
  loading: Boolean;

  constructor(private alert: AlertService, private api: ApiServiceService) {
    this.createForm();
    Conekta.setPublicKey('key_H5din4sRxu5nx9ThAGPTs5g');
    Conekta.getPublicKey();
    Conekta.setLanguage("es");
  }

  ngOnInit() {
  }

  pagar() {
    this.loading = true;
    let tokenParams = {
      "card": {
        "number": this.cardForm.get('numero').value,
        "name": this.cardForm.get('nombre').value,
        "exp_year": this.cardForm.get('anio').value,
        "exp_month": this.cardForm.get('mes').value,
        "cvc": this.cardForm.get('cvc').value
      }
    };

    Conekta.Token.create(tokenParams, (token) => {
      console.log(token);

      this.loading = false;
      let params = {
        token: token.id,
        precio: 109
      }
      this.api.postService('Pago/Nuevo', false, params).pipe(first()).subscribe(data => {
        console.log(data);
      }, error => { console.log(error) });
    }, (error) => {
      console.log(error);
      let er = "";
      if (error.http_code == '402') {
        er = error.details[0].message;
      }
      if (error.message_to_purchaser == undefined) {
        er = 'Ha ocurrido un error y no podemos procesar tu tarjeta.'
      }
      else {
        er = error.message_to_purchaser;
      }
      this.alert.warning(er);
      this.loading = false;
    });
  }

  errorResponseHandler(error) {
    this.alert.success(error.message_to_purchaser);
  }

  // var errorResponseHandler = function(error) {
  //   // Do something on error
  //   console.log(error);
  //   alert.danger(error.message_to_purchaser);
  // };


  private createForm() {
    this.cardForm = new FormGroup({
      nombre: new FormControl('Oscar atanacio', [Validators.required]),
      numero: new FormControl('4242424242424242', [Validators.required]),
      mes: new FormControl('12', [Validators.required]),
      anio: new FormControl('19', [Validators.required]),
      cvc: new FormControl('123', [Validators.required]),
    });
  }


}
