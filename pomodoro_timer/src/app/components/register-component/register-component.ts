import { Component, inject } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BackgroundComponent } from "../background-component/background-component";
import { NavbarComponent } from "../navbar-component/navbar-component";
import { AuthService } from "../../services/auth-service";

@Component({
  selector: "app-register-component",
  imports: [ReactiveFormsModule, BackgroundComponent, NavbarComponent],
  templateUrl: "./register-component.html",
  styleUrl: "./register-component.scss",
})
export class RegisterComponent {
  readonly router = inject(Router);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);

  errorMessage: string | null = null;

  readonly emailControl = this.formBuilder.control("", { validators: [Validators.required, Validators.email], nonNullable: true });
  readonly passwordControl = this.formBuilder.control("", { validators: [Validators.required], nonNullable: true });
  readonly confirmPasswordControl = this.formBuilder.control("", { validators: [Validators.required], nonNullable: true });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  protected readonly registerForm = this.formBuilder.group(
    {
      email: this.emailControl,
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit() {
    if (!this.registerForm.valid) {
      if (this.registerForm.errors?.["passwordMismatch"]) {
        this.errorMessage = "Passwords do not match";
        return
      } else {
        this.errorMessage = "Invalid email or password";
        return;
      }
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;

    const success = this.authService.register(email, password);

    if (success) {
      this.router.navigateByUrl("login");
    } else {
      this.errorMessage = "Email already exists";
    }
  }

  clearError() {
    this.errorMessage = "";
  }

  toLogin() {
    this.router.navigateByUrl("login");
  }
}
