import { first } from 'rxjs/operators';
import { AuthenticationService } from './../../_services/authentication.service';
import { ApiServiceService } from './../../_services/api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  listaConsultas: any;
  idPacienteActual:any;

  constructor(private router: Router, private api: ApiServiceService, private auth: AuthenticationService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.idPacienteActual = params.id);
   }

  ngOnInit() {
    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.api.getService('Consultas/' + this.idPacienteActual, false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.listaConsultas = data;
      }, error => {
      });
  }

  verConsulta(id:Number){
    this.router.navigate(['../../consultas/ver/' + id], { relativeTo: this.route });
  }
}
