import { Routes } from '@angular/router';
import { TimerComponent } from './components/timer-component/timer-component';
import { LoginComponent } from './components/login-component/login-component';
import { RegisterComponent } from './components/register-component/register-component';
import { SettingsComponent } from './components/settings-component/settings-component';
import { authGuardGuard} from './guards/auth-guard-guard';

export const routes: Routes = [
    {
        path: 'home',
        component: TimerComponent,
        canActivate: [authGuardGuard]
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
        component: SettingsComponent,
        canActivate: [authGuardGuard]
    },

    {
        path: '**',
        redirectTo: 'home'
    },
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
