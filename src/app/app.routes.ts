import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';   
import { NocturnaComponent } from './pages/nocturna/nocturna.component';


import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'about', component: About},
    {path: 'contact', component: Contact},
    {path : 'principal', component: PrincipalComponent},
    {path : 'nocturna', component: NocturnaComponent},
    {path: '**', redirectTo:''}
];

// hoal