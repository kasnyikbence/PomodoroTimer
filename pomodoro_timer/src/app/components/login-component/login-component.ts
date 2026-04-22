import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BackgroundComponent } from "../background-component/background-component";
import { NavbarComponent } from "../navbar-component/navbar-component";
import { AuthService } from "../../services/auth-service";

@Component({
  selector: "app-login-component",
  imports: [ReactiveFormsModule, BackgroundComponent, NavbarComponent],
  templateUrl: "./login-component.html",
  styleUrl: "./login-component.scss",
})
export class LoginComponent {
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  errorMessage: string | null = null;

  readonly emailControl = this.formBuilder.control('', { validators: [Validators.required, Validators.email], nonNullable: true  });
  readonly passwordControl = this.formBuilder.control('', { validators: [Validators.required], nonNullable: true });  

  protected readonly loginForm = this.formBuilder.group({
    email: this.emailControl,
    password: this.passwordControl,
  });


  onSubmit() {
    if (!this.loginForm.valid) {
      this.errorMessage = "Invalid email or password";
      console.log("Form is invalid");
      return;
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    const success = this.authService.login(email, password);

    if (success) {
    this.router.navigateByUrl("home");
    } else {
      this.errorMessage = "Invalid email or password";
    }
  }

  clearError() {
    this.errorMessage = null;
  }

  toRegister() {
    this.router.navigateByUrl("register");
  }
}
