import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { TimerService } from "../../services/timer-service";
import { NavbarComponent } from "../navbar-component/navbar-component";
import { BackgroundComponent } from "../background-component/background-component";
import { TimerFormatPipePipe } from "../../pipes/timer-format-pipe-pipe";

@Component({
  selector: "app-timer-component",
  standalone: true,
  imports: [MatButtonModule, NavbarComponent, BackgroundComponent, TimerFormatPipePipe],
  templateUrl: "./timer-component.html",
  styleUrl: "./timer-component.scss",
})
export class TimerComponent {
  private readonly timerService = inject(TimerService);

  public timeLeft = this.timerService.timeLeft;
  public phase = this.timerService.phase;

public startText = computed(() => this.timerService.isRunning() ? "pause" : "start");

  startTimer(): void {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted!");
        }
      });
    }

    this.timerService.startTimer();
  }

  phaseSelection(event: any): void {
    if (event.target.value === "focus") {
      this.timerService.phaseSelection("focus");
    } else if (event.target.value === "short") {
      this.timerService.phaseSelection("short");
    } else if (event.target.value === "long") {
      this.timerService.phaseSelection("long");
    }
  }
}
