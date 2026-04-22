import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth-service";

@Component({
  selector: "app-navbar-component",
  imports: [MatIcon],
  templateUrl: "./navbar-component.html",
  styleUrl: "./navbar-component.scss",
})
export class NavbarComponent {
  private router = inject(Router);
  readonly authService = inject(AuthService);
  isDropdownOpen: boolean = false;

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("login");
  }

  toggleMenu() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toSettings(): void {
    this.router.navigateByUrl("settings");
  }
}
