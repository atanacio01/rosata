import { AuthenticationService } from './_services/authentication.service';
import { Component, Predicate, OnInit, HostListener } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd, } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@HostListener('window:resize', ['$event'])
export class AppComponent implements OnInit {
  title = 'rosata';
  private _opened: boolean = false;
  

  constructor(private auth: AuthenticationService, private router: Router) {
    // if (localStorage.getItem('currentUser') != null) {
    //   this._opened = true;
    // }
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      var event = JSON.stringify(e);
      var json = JSON.parse(event);
      if (json.url.toLowerCase().includes('pacientes')) {
        this.selected = this.menu[0];
      }
      else if (json.url.toLowerCase().includes('agenda')) {
        this.selected = this.menu[1];
      }
      else if (json.url.toLowerCase().includes('soporte')) {
        this.selected = this.menu[2];
      }
      else if (json.url.toLowerCase().includes('cuenta')) {
        this.selected = this.menu[30];
      }
    });
  }

  ngOnInit() {
  }

  onResize(event) {
    alert(event);
    event.target.innerWidth;
  }

  private _toggleSidebar() {
    this._opened = !this._opened;
  }


  isLogin() {
    if (localStorage.getItem('currentUser') != null) {
      return true;
    }
    return false;
  }

  logout() {
    this._opened = false;
    this.auth.logout();
    this.router.navigateByUrl('');
  }

  goto(opcion: String, item) {
    // alert(opcion);
    this.selected = item;
    if (opcion == 'info') {
      this.router.navigateByUrl('pacientes');
    }
    if (opcion == 'historia') {
      this.router.navigate(['agenda']);
    }
    if (opcion == 'consultas') {
      this.router.navigate(['soporte']);
    }
  }

  isActive(item) {
    return this.selected === item;
  };

  menu = [
    {
      metodo: 'info',
      texto: 'Pacientes',
      icono: 'fas fa-user-friends',
      activa: 'tab-active'
    },
    {
      metodo: 'historia',
      texto: 'Agenda',
      icono: 'fas fa-calendar-alt',
      activa: 'tab-active'
    },
    {
      metodo: 'consultas',
      texto: 'Soporte',
      icono: 'fas fa-headset',
      activa: 'tab-active'
    }
  ];
  selected: any = this.menu[0];
}
