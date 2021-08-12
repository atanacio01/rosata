import { SoporteComponent } from './soporte/soporte.component';
import { CuentaComponent } from './cuenta/cuenta.component';
import { AgendaComponent } from './agenda/agenda.component';
import { VacunacionComponent } from './Paciente/vacunacion/vacunacion.component';
import { EditarconsultaComponent } from './Paciente/editarconsulta/editarconsulta.component';
import { NuevaconsultaComponent } from './Paciente/nuevaconsulta/nuevaconsulta.component';
import { ConsultasComponent } from './Paciente/consultas/consultas.component';
import { HistoriaClinicaComponent } from './Paciente/historia-clinica/historia-clinica.component';
import { AuthGuard } from './_guards/auth.guard';
import { PerfilpacienteComponent } from './Paciente/perfilpaciente/perfilpaciente.component';
import { NuevopacienteComponent } from './Paciente/nuevopaciente/nuevopaciente.component';
import { PacientesComponent } from './Paciente/pacientes/pacientes.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'cuenta', component: CuentaComponent, canActivate: [AuthGuard] },
  { path: 'soporte', component: SoporteComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
  { path: 'pacientes/nuevo', component: NuevopacienteComponent, canActivate: [AuthGuard] },
  {
    path: 'pacientes/perfil/:id', component: PerfilpacienteComponent, canActivate: [AuthGuard],

    children: [
      { path: 'historia/:id', component: HistoriaClinicaComponent },
      { path: 'consultas/:id', component: ConsultasComponent },
      { path: 'consultas/nueva/:id', component: NuevaconsultaComponent },
      { path: 'consultas/ver/:id', component: EditarconsultaComponent },
      { path: 'vacunacion/:id', component: VacunacionComponent }
    ]
  },
  { path: 'agenda', component: AgendaComponent, canActivate: [AuthGuard] },
  { path: 'suscripcion', component: SuscripcionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

