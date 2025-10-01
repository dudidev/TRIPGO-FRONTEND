import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';   
import { NocturnaComponent } from './pages/nocturna/nocturna.component';

export const routes: Routes = [  
    { path : '', component: PrincipalComponent},
    {path : 'principal', component: PrincipalComponent},
    {path : 'nocturna', component: NocturnaComponent}
];
