import { inject, Injectable, signal } from "@angular/core";
import { SettingsService } from "./settings-service";

@Injectable({
    providedIn: "root",
})
export class TimerService {
    public settingsService = inject(SettingsService);

    private timeRemaining = signal(this.settingsService.focusTime() * 60);
    private timerIsRunning = signal(false);
    private currentPhase = "focus";

    readonly timeLeft = this.timeRemaining.asReadonly();
    readonly isRunning = this.timerIsRunning.asReadonly();
    readonly phase = this.currentPhase;

    private interValId: number | null = null;

    //Timer control methods
    startTimer(): void {
        if (this.timerIsRunning()) {
           this.stopTimer();
           return;
        }

        console.log("Timer started");
        console.log('Current settings - Focus Time:', this.settingsService.focusTime(), 'min, Short Break:', this.settingsService.shortBreakTime(), 'min, Long Break:', this.settingsService.longBreakTime(), 'min');

        this.timerIsRunning.set(true);

        this.interValId = window.setInterval(() => {
            this.timeRemaining.update((time) => {
                if (time <= 1) {
                    return this.settingsService.focusTime() * 60;
                }

                console.log(`Time remaining: ${time - 1} seconds`);
                return time - 1;
            });
        }, 1000);
    }

    stopTimer(): void {
        if (!this.timerIsRunning()) {
            return;
        }

        if (this.interValId !== null) {
            window.clearInterval(this.interValId);
            this.interValId = null;
        }

        this.timerIsRunning.set(false);
        console.log("Timer stopped");
    }

    resetTimer(): void {
        if (this.timerIsRunning()) {
            return;
        }
        this.stopTimer();
        this.timeRemaining.set(this.settingsService.focusTime() * 60);
        console.log("Timer reset to initial focus time");
    }

    endTimer(): void {
        alert("Time's up!");
        this.stopTimer();
    }
}
