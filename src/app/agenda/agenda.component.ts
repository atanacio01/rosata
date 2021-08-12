import { element } from 'protractor';
import { AuthenticationService } from './../_services/authentication.service';
import { ApiServiceService } from './../_services/api-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  eachDay
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { first } from 'rxjs/operators';
import { DateTime } from "luxon";
import { findSafariExecutable } from 'selenium-webdriver/safari';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  agendaForm: FormGroup;
  CalendarView = CalendarView;
  locale: string = 'es_MX';
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = false;

  listaPacientes: any;
  todosTurnos :any;
  constructor(private modal: NgbModal, private api: ApiServiceService, private auth: AuthenticationService,config:NgbDatepickerConfig) {
    this.crearFormulario();
    this.agendaForm.controls['Paciente_Nuevo'].setValue(false);
    let dt = DateTime.local();
    config.minDate = { year: dt.year, month: dt.month, day: dt.day };
  }

  guardarTurno() {
    if (this.agendaForm.controls['Paciente_Nuevo'].value == false || this.agendaForm.controls['Paciente_Nuevo'].value == null) {
      this.agendaForm.controls['Nombre'].setValue(this.agendaForm.controls['Id_Paciente'].value.Nombre_Completo);
    }
    let convert = this.agendaForm.controls['Fecha'].value;
    let fecha = DateTime.local(convert.year, convert.month, convert.day).setZone('America/Mexico_City');
    this.agendaForm.controls['Fecha'].setValue(fecha);
    let horario = this.agendaForm.controls['Horario'].value.hour + ":" + this.agendaForm.controls['Horario'].value.minute;
    this.agendaForm.controls['Horario'].setValue(horario);
    this.agendaForm.controls['Id_Usuario'].setValue(this.auth.UsuarioActual().user.id);
    this.api.postService('Agenda/Nueva', false, this.agendaForm.value).pipe(first()).subscribe(
      data => {
        this.obtenerAgenda();
        this.agendaForm.reset();
      }, error => {
        console.log(error);
      });
  }
  ngOnInit() {
    this.obtenerPacientes();
    this.obtenerAgenda();
  }

  obtenerPacientes() {
    this.api.getService('Pacientes/' + this.auth.IdUsuario(), false).pipe(first()).subscribe(
      data => {
        console.log(data);
        this.listaPacientes = data;
      }, error => {
      });
  }

  obtenerAgenda() {
    this.events = [];
    this.api.getService('Agenda/' + this.auth.IdUsuario(), false).pipe(first()).subscribe(
      data => {
        let elements = [];
        data.forEach(element => {
          this.events.push({
            title: element.Nombre + " cita a las: " + element.Horario,
            start: startOfDay(DateTime.fromISO(element.Fecha).setZone('America/Mexico_City')),
            end: endOfDay(DateTime.fromISO(element.Fecha).setZone('America/Mexico_City')),
            color: colors.red,
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          });
          this.refresh.next();
        });
      }, error => {
      });
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {

  }


  addEvent(): void {
    this.events = [
      {
        title: 'New event',
        start: startOfDay(new Date(2019, 10, 13, 15, 30, 0, 0)),
        end: endOfDay(new Date(2019, 10, 13, 15, 40, 0, 0)),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
 
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  private crearFormulario() {
    this.agendaForm = new FormGroup({
      Id_Usuario: new FormControl(null, []),
      Id_Paciente: new FormControl(null, []),
      Paciente_Nuevo: new FormControl(null, []),
      Nombre: new FormControl(null, []),
      Fecha: new FormControl(null, [Validators.required]),
      Horario: new FormControl(null, []),
    });
  }
}
