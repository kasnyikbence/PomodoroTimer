import { Component, inject, OnInit } from "@angular/core";
import { SettingsService } from "../../services/settings-service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { TimerService } from "../../services/timer-service";
import { NavbarComponent } from "../navbar-component/navbar-component";
import { MatIcon } from "@angular/material/icon";
import { BackgroundComponent } from "../background-component/background-component";


@Component({
  selector: "app-settings-component",
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, NavbarComponent, MatIcon, BackgroundComponent],
  templateUrl: "./settings-component.html",
  styleUrl: "./settings-component.scss",
})
export class SettingsComponent implements OnInit {
  constructor(private timerService: TimerService) {}
  private router = inject(Router);
  public settingsService = inject(SettingsService);

  settingsForm = new FormGroup({
    focusTime: new FormControl(this.settingsService.focusTime(), Validators.min(1)),
    shortBreakTime: new FormControl(this.settingsService.shortBreakTime(), Validators.min(1)),
    longBreakTime: new FormControl(this.settingsService.longBreakTime(), Validators.min(1)),
  });

  ngOnInit() {
    this.settingsForm.valueChanges.subscribe((changes) => {
      console.log("Valaki épp módosítja az értékeket:", changes);
    });
  }

  returnToHome(): void {
    this.router.navigateByUrl("home");
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      const formValues = this.settingsForm.value;

      this.settingsService.updateSettings(formValues.focusTime!, formValues.shortBreakTime!, formValues.longBreakTime!);

      this.timerService.resetTimer();
      console.log("Beállítások elmentve!");
    }
  }
}
