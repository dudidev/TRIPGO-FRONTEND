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



// ✅ Tu empresa está en: src/app/pages/empresa/empresa.ts
import { EmpresaComponent } from './pages/empresa/empresa';

// ✅ guard funcional (CanActivateFn)
import { empresaGuard } from './guards/empresa-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'contact', component: Contact },

  { path: 'principal', component: PrincipalComponent },

  // ✅ PUEBLO → TIPOS
  { path: 'lugares/:townSlug', component: Categorias },

  // ✅ TIPOS → ESTABLECIMIENTOS
  { path: 'lugares/:townSlug/tipo/:idTipo', component: LugaresComponent },

  { path: 'detalles/:slug', component: Detalles },

  { path: 'editar-cuenta', component: EditarCuentaComponent },

  { path: 'empresa', component: EmpresaComponent, canActivate: [empresaGuard] },

  { path: '**', redirectTo: '' },
];