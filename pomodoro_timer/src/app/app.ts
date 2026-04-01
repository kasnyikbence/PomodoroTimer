import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimerComponent } from './components/timer-component/timer-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
