import { inject, Injectable, signal } from "@angular/core";
import { SettingsService } from "./settings-service";

@Injectable({
    providedIn: "root",
})
export class TimerService {
    public settingsService = inject(SettingsService);

    private timeRemaining = signal(this.settingsService.focusTime() * 60);
    private timerIsRunning = signal(false);
    private currentPhase = signal<"focus" | "break">("focus");

    readonly timeLeft = this.timeRemaining.asReadonly();
    readonly isRunning = this.timerIsRunning.asReadonly();
    readonly phase = this.currentPhase.asReadonly();

    private interValId: number | null = null;

    //Timer control methods
    startTimer(): void {
        if (this.timerIsRunning()) {
            return;
        }

        console.log("Timer started");
        console.log('Current settings - Focus Time:', this.settingsService.focusTime(), 'min, Short Break:', this.settingsService.shortBreakTime(), 'min, Long Break:', this.settingsService.longBreakTime(), 'min');

        this.timerIsRunning.set(true);

        this.interValId = window.setInterval(() => {
            this.timeRemaining.update((time) => {
                if (time <= 1) {
                    return this.switchPhase();
                }

                console.log(`Time remaining: ${time - 1} seconds`);
                return time - 1;
            });
        }, 1000);
    }

    private switchPhase(): number {
        if (this.currentPhase() === "focus") {
            this.currentPhase.set("break");
            alert("Focus finished. Break time!");

            return this.settingsService.shortBreakTime() * 60;
        }

        this.currentPhase.set("focus");
        alert("Break finished. Back to focus!");
        return this.settingsService.focusTime() * 60;
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
        this.currentPhase.set("focus");
        this.timeRemaining.set(this.settingsService.focusTime() * 60);
        console.log("Timer reset to initial focus time");
    }

    endTimer(): void {
        alert("Time's up!");
        this.stopTimer();
    }
}
