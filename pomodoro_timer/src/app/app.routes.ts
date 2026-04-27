import { Routes } from '@angular/router';
import { authGuardGuard} from './guards/auth-guard-guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./components/timer-component/timer-component').then(m => m.TimerComponent),
        canActivate: [authGuardGuard]
    },

    {
        path: 'login',
        loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent)
    },

    {
        path: 'register',
        loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent)

    },

    {
        path: 'settings',
        loadComponent: () => import('./components/settings-component/settings-component').then(m => m.SettingsComponent),
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
