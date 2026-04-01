import { Injectable, Input, input, signal } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SettingsService {
    public focusTime = signal(25);
    public shortBreakTime = signal(5);
    public longBreakTime = signal(15);

    updateSettings(focusTime: number, shortBreakTime: number, longBreakTime: number): void {
        this.focusTime.set(focusTime);
        this.shortBreakTime.set(shortBreakTime);
        this.longBreakTime.set(longBreakTime);

        console.log(`Settings updated: Focus Time = ${focusTime} min, Short Break = ${shortBreakTime} min, Long Break = ${longBreakTime} min`);
    }
}
