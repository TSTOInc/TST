import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TrucksComponent } from './pages/trucks/trucks.component';
import { TruckViewComponent } from './pages/truck-view/truck-view.component';
import { CompanyComponent } from './company/company.component';

export const routes: Routes = [
    {   path: '', redirectTo: 'home', pathMatch: 'full' },
    {   path: 'home', component: HomeComponent },
    {   path: 'trucks', component: TrucksComponent },
    {   path: 'trucks/:id', component: TruckViewComponent },
    {   path: 'company', component: CompanyComponent },
];
