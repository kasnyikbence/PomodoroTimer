import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-timer-component',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './timer-component.html',
  styleUrl: './timer-component.scss',
})
export class TimerComponent {}
