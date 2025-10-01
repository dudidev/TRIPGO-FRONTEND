import { Routes } from '@angular/router';
<<<<<<< HEAD

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
    {path: '**', redirectTo:''}
=======
import { Home } from './pages/home/home';
export const routes: Routes = [
    {path: '', component: Home},
    {path: 'Home', component: Home}
>>>>>>> feature-karol
];
