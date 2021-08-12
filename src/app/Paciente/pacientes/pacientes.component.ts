import { AuthenticationService } from '../../_services/authentication.service';
import { first, filter } from 'rxjs/operators';
import { ApiServiceService } from '../../_services/api-service.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  loading: Boolean;
  listaPacientes: any;
  busqueda:any;
  totalPacientes:any = 0;
  totalMujeres:any = 5;
  totalHombres:any = 6;

  constructor(private router: Router, private api: ApiServiceService, private auth: AuthenticationService) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Femenino', 'Masculino'];
  public barChartType = 'pie';
  public barChartLegend = true;
  public barChartData = [
    { data: [0, 0], label: 'Series A' },
  ];

  ngOnInit() {
    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.api.getService('Pacientes/' + this.auth.IdUsuario(), false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.totalHombres = _.filter(data, function (o) { return o.Sexo == 'Masculino' }).length;
        this.totalMujeres = _.filter(data, function (o) { return o.Sexo == 'Femenino' }).length;
        this.barChartData = [
          { data: [this.totalMujeres, this.totalHombres], label: 'Series A' },
        ];
        this.listaPacientes = data;
        this.totalPacientes = data.length;
      }, error => {
        this.loading = false;
      });
  }


  nuevo() {
    this.router.navigateByUrl('pacientes/nuevo');
  }

  perfil(id: any) {
    this.router.navigateByUrl('pacientes/perfil/' + id);// +'/(sub:historia/' + id +')');
  }

  buscar(): void {
    let term = this.busqueda.toLowerCase();
    if (term == '') {
      this.obtenerPacientes();
    }
    else {
      this.listaPacientes = this.listaPacientes.filter(function (tag) {
        return tag.Apellido_Paterno.toLowerCase().indexOf(term) >= 0 || tag.Apellido_Materno.toLowerCase().indexOf(term) >= 0  || tag.Nombre.toLowerCase().indexOf(term) >= 0;
      });
    }
  }

  // ageCalculator(edad){
  //   if(edad){
  //     const convertAge = new Date(edad);
  //     const timeDiff = Math.abs(Date.now() - convertAge.getTime());
  //     let edadAnios = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  //     if(edadAnios <= 0){
  //       return Math.floor((timeDiff / (1000 * 3600 * 24))/12);;
  //     }
  //     return edadAnios;
  //   }
  // }

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
