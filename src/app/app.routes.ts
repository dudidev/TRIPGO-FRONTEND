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

  { path: 'categorias/:slug', component: Categorias },
  { path: 'lugares/:townSlug/:categoryKey', component: LugaresComponent },
  { path: 'detalles/:slug', component: Detalles },

  { path: 'editar-cuenta', component: EditarCuentaComponent },

  { path: 'prices', component: Prices },
  // ✅ Ruta exclusiva empresa
  { path: 'empresa', component: EmpresaComponent, canActivate: [empresaGuard] },

  // ✅ comodín (opcional)
  { path: '**', redirectTo: '' },
];
