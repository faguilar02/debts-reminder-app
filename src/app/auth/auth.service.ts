import { computed, Injectable, signal } from '@angular/core';
import { User } from './interfaces/user.interface';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _users = signal<User[]>([]);
  private _currentUser = signal<User | undefined>(undefined);

  public users = computed<User[]>(() => this._users());
  public currentUser = computed<User | undefined>(() => this._currentUser());
  constructor() {
    this.loadUsersFromLocalStorage();
    this.loadCurrentUserFromLocalStorage()
    this.verifyAuthentication()
  }

  register(user: User) {

    console.log('Usuario a agregar:', user);

    this._users.update((users) => [
      ...users,
      {
        ...user,
        id: uuid(),
      },
    ]);

    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this._users()));
  }

  loadUsersFromLocalStorage() {
    if (!localStorage.getItem('users')) return;

    this._users.set(JSON.parse(localStorage.getItem('users')!));
  }

  login(user: User): User | undefined {
    const userwasFound = this._users().find(
      (u) => u.email === user.email && u.password === user.password
    );

    this._currentUser.set(userwasFound);

    localStorage.setItem('currentUser', JSON.stringify(this._currentUser()));

    return userwasFound;
  }

  loadCurrentUserFromLocalStorage(){

    if(!localStorage.getItem('currentUser')) return

    this._currentUser.set(JSON.parse(localStorage.getItem('currentUser')!))

  }

  verifyEmailExists(user: User): boolean {
    return this._users().some((u) => u.email === user.email);
  }

  logout(){
    // this._currentUser.set(undefined)
    localStorage.removeItem('currentUser')
  }

  verifyAuthentication():boolean{
    if(!localStorage.getItem('currentUser')) return false

    const user:User = JSON.parse(localStorage.getItem('currentUser')!);

    const userWasFound = this._users().some( (u) => u.id === user.id)

    return userWasFound
  }

}
