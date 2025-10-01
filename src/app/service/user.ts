import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {
  private storageKey = 'users';
  private sessionKey = 'currentUser';

  constructor() {}

  register(user: any): boolean {
    let users = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const exists = users.find((u: any) => u.email === user.email);
    if (exists) {
      return false;
    }

    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    let users = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    const validUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (validUser) {
      localStorage.setItem(this.sessionKey, JSON.stringify(validUser));
      return true;
    }

    return false;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.sessionKey) || 'null');
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  
}
