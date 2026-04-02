import { Routes } from '@angular/router';

import { PrincipalComponent } from './pages/principal/principal.component';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Categorias } from './pages/categorias/categorias';
import { LugaresComponent } from './pages/lugares/lugares';
import { Detalles } from './pages/detalles/detalles';
import { EditarCuentaComponent } from './pages/editar-cuenta/editar-cuenta';
import { About } from './pages/about/about';
import { Prices } from './pages/prices/prices';
import { Soporte } from './pages/soporte/soporte';
import { Recomendaciones } from './pages/recomendaciones/recomendaciones';
import { authGuard } from './services/auth.guard';



// ✅ Tu empresa está en: src/app/pages/empresa/empresa.ts
import { EmpresaComponent } from './pages/empresa/empresa';

// ✅ guard funcional (CanActivateFn)
import { empresaGuard } from './guards/empresa-guard';

export const routes: Routes = [
  { path: '', component: Home, data: { animation: 'home' } },
  { path: 'login', component: Login, data: { animation: 'login' } },
  { path: 'register', component: Register, data: { animation: 'register' } },
  { path: 'contact', component: Contact, data: { animation: 'contact' } },

  { path: 'principal', component: PrincipalComponent },

  // ✅ PUEBLO → TIPOS
  { path: 'lugares/:townSlug', component: Categorias, data: { animation: 'lugares' } },

  // ✅ TIPOS → ESTABLECIMIENTOS
  { path: 'lugares/:townSlug/tipo/:idTipo', component: LugaresComponent, data: { animation: 'lugares' } },

  { path: 'detalles/:slug', component: Detalles, data: { animation: 'detalles' } },

  { path: 'editar-cuenta', component: EditarCuentaComponent,  canActivate: [authGuard], data: { animation: 'editar-cuenta' } },

  // ✅ Ruta exclusiva empresa
  { path: 'empresa', component: EmpresaComponent, canActivate: [empresaGuard], data: { animation: 'empresa' } },
  {path: 'about', component: About, data: { animation: 'about' } },
  {path: 'prices', component: Prices, data: { animation: 'prices' } },
  {path: 'soporte', component: Soporte, canActivate: [authGuard], data: { animation: 'soporte' } },
  {path: 'recomendaciones', component: Recomendaciones, canActivate: [authGuard], data: { animation: 'recomendaciones' } },

  {path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password')},
  {path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password')},

  { path: '**', redirectTo: '' },
];