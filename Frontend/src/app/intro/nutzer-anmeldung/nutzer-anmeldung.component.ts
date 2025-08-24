import { Component, Input, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-nutzer-anmeldung',
  templateUrl: './nutzer-anmeldung.component.html',
})
export class LoginComponent{
  @Input() isAccountDeleted: boolean = false;
  email: string = '';
  password: string = '';
  passwordInvalid = false;
  passwordTouched = false;
  showPassword = false;
  inputType = 'password';
  loginSuccess: boolean = false;
  loginError: boolean = false;
  isAuthenticated: boolean = false;
  oidcProperties: string = '';


  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.accountDeleted$.subscribe(status => {
      this.isAccountDeleted = status;
      console.log('Account deleted status:', this.isAccountDeleted);
    });
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.loginSuccess = true;
        this.loginError = false;
        this.isAuthenticated = true;

        localStorage.setItem('isAuthenticated', 'true');

        console.log('isAuthenticated', this.isAuthenticated);
        this.email = response.email
        this.oidcProperties = JSON.stringify(response.oidcProperties);
        this.router.navigate(['/listen-container']);
      },
      (error) => {
        this.loginSuccess = false;
        this.loginError = true;
      }
    );
  }

  onPasswordFocus() {
    this.passwordTouched = true;
  }

  onPasswordChange() {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    this.passwordInvalid = !regex.test(this.password);
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? 'text' : 'password';
  }

  navigateListe(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/listen-container']);
  }

  navigateLanding(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/landing']);
  }
}
