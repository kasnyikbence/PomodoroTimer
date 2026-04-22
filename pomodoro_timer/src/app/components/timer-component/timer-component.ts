import { Component, inject, OnDestroy} from "@angular/core";
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
export class TimerComponent implements OnDestroy {
  private readonly timerService = inject(TimerService);
      
  public timeLeft = this.timerService.timeLeft;
  public phase = this.timerService.phase;

  public startText = "start";

    startTimer(): void {
        this.timerService.startTimer();
        this.startText = this.timerService.isRunning() ? "pause" : "start";
    }

    phaseSelection(event: any): void {
        if (event.target.value === 'focus') {
            this.timerService.phaseSelection('focus');
        }
        else if (event.target.value === 'short') {
            this.timerService.phaseSelection('short');
        }
        else if (event.target.value === 'long') {
            this.timerService.phaseSelection('long');
        }
    }


    // readonly formatTime = (time: number): string => {
    //     const minutes = Math.floor(time / 60);
    //     const seconds = time % 60;
    //     return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    // };

    ngOnDestroy(): void {
        console.log("TimerComponent destroyed");
    }
}
