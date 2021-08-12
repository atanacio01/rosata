import { AuthenticationService } from './../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServiceService } from '../_services/api-service.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  public loading = false;
  alert: boolean = false;
  message: String;

  constructor(private api: ApiServiceService, private route: ActivatedRoute, private authenticationService: AuthenticationService, private router: Router) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (localStorage.getItem('currentUser') != null) {
      if (this.returnUrl == '/')
        this.router.navigateByUrl('pacientes');
      else
        this.router.navigate([this.returnUrl]);
    }
  }

  private crearFormulario() {
    this.loginForm = new FormGroup({
      Correo: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      Password: new FormControl(null, [Validators.required])
    });
  }

  register() {
    this.router.navigateByUrl('registro');
  }

  login() {
    
    this.loading = true;
    this.authenticationService.login(this.loginForm.value).pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (this.returnUrl == '/')
            this.router.navigateByUrl('pacientes');
          else
            this.router.navigate([this.returnUrl]);

        },
        error => {
          this.loading = false;
          this.alert = true;
          this.message = error.error;
        });
  }
}
