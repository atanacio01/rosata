import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'ng-sidebar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxLoadingModule } from 'ngx-loading';
import { NgSelectModule } from '@ng-select/ng-select';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AlertModule } from 'ngx-alerts';
import { ChartsModule } from 'ng2-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { PacientesComponent } from './Paciente/pacientes/pacientes.component';
import { NuevopacienteComponent } from './Paciente/nuevopaciente/nuevopaciente.component';
import { PerfilpacienteComponent } from './Paciente/perfilpaciente/perfilpaciente.component';
import { HistoriaClinicaComponent } from './Paciente/historia-clinica/historia-clinica.component';
import { ConsultasComponent } from './Paciente/consultas/consultas.component';
import { NuevaconsultaComponent } from './Paciente/nuevaconsulta/nuevaconsulta.component';
import { EditarconsultaComponent } from './Paciente/editarconsulta/editarconsulta.component';
import { VacunacionComponent } from './Paciente/vacunacion/vacunacion.component';
import { AgendaComponent } from './agenda/agenda.component';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es-MX';
import { CuentaComponent } from './cuenta/cuenta.component';
import { SoporteComponent } from './soporte/soporte.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
registerLocaleData(locale);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    PacientesComponent,
    NuevopacienteComponent,
    PerfilpacienteComponent,
    HistoriaClinicaComponent,
    ConsultasComponent,
    NuevaconsultaComponent,
    EditarconsultaComponent,
    VacunacionComponent,
    AgendaComponent,
    CuentaComponent,
    SoporteComponent,
    SuscripcionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SidebarModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    NgSelectModule,
    BrowserAnimationsModule,
    AlertModule.forRoot({maxMessages: 5, timeout: 3000, position: 'right'}),
    ChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
