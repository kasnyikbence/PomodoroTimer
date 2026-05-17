import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SettingsService } from "../../services/settings-service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { TimerService } from "../../services/timer-service";
import { NavbarComponent } from "../navbar-component/navbar-component";
import { MatIcon } from "@angular/material/icon";
import { BackgroundComponent } from "../background-component/background-component";
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, filter, map, of, startWith, switchMap, tap, withLatestFrom } from "rxjs";


@Component({
  selector: "app-settings-component",
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, NavbarComponent, MatIcon, BackgroundComponent, AsyncPipe],
  templateUrl: "./settings-component.html",
  styleUrl: "./settings-component.scss",
})
export class SettingsComponent {
  constructor(private timerService: TimerService) {}
  private router = inject(Router);
  public settingsService = inject(SettingsService);

  private readonly saveRequested$ = new Subject<void>();

  settingsForm = new FormGroup({
    focusTime: new FormControl(this.settingsService.focusTime(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    shortBreakTime: new FormControl(this.settingsService.shortBreakTime(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    longBreakTime: new FormControl(this.settingsService.longBreakTime(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  readonly settingsChanges$: Observable<{ focusTime: number; shortBreakTime: number; longBreakTime: number }> = this.settingsForm.valueChanges.pipe(
    startWith(this.settingsForm.getRawValue()),
    debounceTime(250),
    map((value) => ({
      focusTime: value.focusTime,
      shortBreakTime: value.shortBreakTime,
      longBreakTime: value.longBreakTime,
    })),
    filter(
      (value): value is { focusTime: number; shortBreakTime: number; longBreakTime: number } =>
        value.focusTime !== undefined &&
        value.shortBreakTime !== undefined &&
        value.longBreakTime !== undefined,
    ),
    distinctUntilChanged(
      (prev, curr) =>
        prev.focusTime === curr.focusTime &&
        prev.shortBreakTime === curr.shortBreakTime &&
        prev.longBreakTime === curr.longBreakTime,
    ),
    tap((changes) => {
      console.log("Beállítás változás:", changes);
    }),
  );

  readonly canSave$: Observable<boolean> = this.settingsForm.statusChanges.pipe(
    startWith(this.settingsForm.status),
    map((status) => status === "VALID"),
    distinctUntilChanged(),
  );

  readonly saveMessage$: Observable<string> = this.saveRequested$.pipe(
    withLatestFrom(this.settingsChanges$),
    switchMap(([, settings]) => {
      if (!this.settingsForm.valid) {
        return of("Hibás adatokat adtál meg.");
      }

      return of(settings).pipe(
        tap((currentSettings) => {
          this.settingsService.updateSettings(
            currentSettings.focusTime,
            currentSettings.shortBreakTime,
            currentSettings.longBreakTime,
          );
          this.timerService.resetTimer();
        }),
        map(() => "Beállítások elmentve."),
        catchError(() => of("Mentési hiba történt.")),
      );
    }),
    startWith(""),
  );

  returnToHome(): void {
    this.router.navigateByUrl("home");
  }

  saveSettings() {
    this.saveRequested$.next();
  }
}
