import { inject, Injectable, signal, effect, untracked } from "@angular/core";
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

    constructor() {
        effect(() => {
            const focusTime = this.settingsService.focusTime();
            const shortBreakTime = this.settingsService.shortBreakTime();
            const longBreakTime = this.settingsService.longBreakTime();

            const isRunning = untracked(() => this.timerIsRunning());

            if (!isRunning) {
                if (this.currentPhase === "focus") {
                    this.timeRemaining.set(focusTime * 60);
                } else if (this.currentPhase === "short") {
                    this.timeRemaining.set(shortBreakTime * 60);
                } else if (this.currentPhase === "long") {
                    this.timeRemaining.set(longBreakTime * 60);
                }
            }
        });
    }

    //Timer control methods
    startTimer(): void {
        if (this.timerIsRunning()) {
            this.stopTimer();
            return;
        }

        console.log("Timer started");
        console.log(
            "Current settings - Focus Time:",
            this.settingsService.focusTime(),
            "min, Short Break:",
            this.settingsService.shortBreakTime(),
            "min, Long Break:",
            this.settingsService.longBreakTime(),
            "min",
        );

        this.timerIsRunning.set(true);

        this.interValId = window.setInterval(() => {
            const current = this.timeRemaining();

            if (current <= 1){
                setTimeout(() => this.endTimer(), 0);
            }else{
                this.timeRemaining.set(current - 1);
            }
        }, 1000);
    }

    phaseSelection(phase: string): void {
        this.stopTimer();

        this.currentPhase = phase;
        this.timeRemaining.set(
            phase === "focus" ? this.settingsService.focusTime() * 60 
            : phase === "short" ? this.settingsService.shortBreakTime() * 60
            : phase === "long" ? this.settingsService.longBreakTime() * 60 
            : 0
        );
        console.log(`Phase changed to: ${phase}`);;
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
    }

    endTimer(): void {
        this.stopTimer();
        this.sendNotification();
        this.phaseSelection(this.currentPhase);
    }


    sendNotification() {
        const title = "Pomodoro Timer";
        const message = this.currentPhase === "focus" ? "Time to take a break!" : "Time to focus!";

        const options = {
            body: message,
            icon: "favicon.ico",
            vibrate: [200, 100, 200, 100, 200],
            requireInteraction: true
        };

        if ('Notification' in window && Notification.permission === "granted") {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
            }).catch(error => {
                new Notification(title, options);
            });
        }else{
            alert(message);
        }
    }
}
