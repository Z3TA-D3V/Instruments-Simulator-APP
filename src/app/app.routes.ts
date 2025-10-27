import { Routes } from '@angular/router';
import { HomePage } from './layout/HomePage/HomePage';

export const routes: Routes = [
    {
        path: "",
        loadComponent: ()=> HomePage
    }
];
