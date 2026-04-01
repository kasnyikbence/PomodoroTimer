import { Component, inject, OnDestroy} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { TimerService } from "../../services/timer-service";
import { Router } from "@angular/router";
import { NavbarComponent } from "../navbar-component/navbar-component";

@Component({
    selector: "app-timer-component",
    standalone: true,
    imports: [MatButtonModule, MatIcon, NavbarComponent],
    templateUrl: "./timer-component.html",
    styleUrl: "./timer-component.scss",
})
export class TimerComponent implements OnDestroy {
  private readonly timerService = inject(TimerService);
  private router = inject(Router);
      
  public timeLeft = this.timerService.timeLeft;
  public phase = this.timerService.phase;

    startTimer(): void {
        this.timerService.startTimer();
    }

    stopTimer(): void {
        this.timerService.stopTimer();
    }


    readonly formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    ngOnDestroy(): void {
        console.log("TimerComponent destroyed");
    }
}
