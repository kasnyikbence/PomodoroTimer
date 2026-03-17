import { Routes } from '@angular/router';
import { TimerComponent } from './components/timer-component/timer-component';
import { LoginComponent } from './components/login-component/login-component';
import { RegisterComponent } from './components/register-component/register-component';
import { SettingsComponent } from './components/settings-component/settings-component';

export const routes: Routes = [
    {
        path: 'home',
        component: TimerComponent
    },

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'register',
        component: RegisterComponent

    },

    {
        path: 'settings',
        component: SettingsComponent
    },

    {
        path: '**',
        redirectTo: 'home'
    }
];
