import { Routes } from '@angular/router';
import { HomePage } from './layout/HomePage/HomePage';

export const routes: Routes = [
    {
        path: "",
        component: HomePage,
        children: [
            {
                path: "instruments",
                loadComponent: () => import('./layout/HomePage/Instruments/Instruments').then(m => m.InstrumentsView)
            },
            {
                path: "configuration",
                loadComponent: () => import('./layout/HomePage/Configuration/Configuration').then(m => m.ConfigurationView)
            },
            {
                path: "about",
                loadComponent: () => import('./layout/HomePage/About/About').then(m => m.AboutView)
            }
        ]
    }
];
