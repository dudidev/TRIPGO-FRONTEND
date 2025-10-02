import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';   
import { NocturnaComponent } from './pages/nocturna/nocturna.component';


import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'contact', component: Contact},
    {path : 'principal', component: PrincipalComponent},
    {path : 'nocturna', component: NocturnaComponent},
    {path: '', redirectTo:'/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes {}