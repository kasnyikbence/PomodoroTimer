import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [MatIcon],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent {
  private router = inject(Router);


  toSettings(): void {
    this.router.navigateByUrl('settings');
  }

  toHome(): void {
    this.router.navigateByUrl('home');
  }
}
