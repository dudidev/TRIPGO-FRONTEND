import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {

  // ✅ ahora devuelve boolean para saber si registró o no
  register(user: { name: string; email: string; password: string }): boolean {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    const name = (user.name || '').trim();
    const email = (user.email || '').trim().toLowerCase();
    const password = (user.password || '').trim();

    // 1) No permitir vacíos
    if (!name || !email || !password) return false;

    // 2) Evitar email duplicado
    const exists = users.some((u: any) =>
      (u.email || '').trim().toLowerCase() === email
    );
    if (exists) return false;

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // ✅ Bloqueo total: no permite login vacío
    if (!cleanEmail || !cleanPassword) return false;

    const foundUser = users.find((u: any) =>
      (u.email || '').trim().toLowerCase() === cleanEmail &&
      (u.password || '').trim() === cleanPassword
    );

    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
