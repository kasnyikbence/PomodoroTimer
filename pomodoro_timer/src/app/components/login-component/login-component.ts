import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-component",
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: "./login-component.html",
  styleUrl: "./login-component.scss",
})
export class LoginComponent {
  readonly router = inject(Router);

  onSubmit() {
    this.router.navigate(["/home"]);
  }
}
