import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { PlanComponent } from '../plan/plan.component'

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'plan', component: PlanComponent},    
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];