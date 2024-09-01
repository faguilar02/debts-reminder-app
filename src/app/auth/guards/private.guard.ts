import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';

export const PrivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthenticated = authService.verifyAuthentication();

  if (!isAuthenticated) {
    router.navigateByUrl('auth/login');
    return false;
  }

  // la unica manera de que no dejemos entrar al home(debts) es que el usuario no esté autenticado. y si no está autenticado queremos redirigirlo a la ruta auth
  // por ello decimos que si no está autenticado, o sea, is authenticated es false, redirigimos al login, no dejamos pasar a la ruta debts
  // y retornamos false para no dejarlo entrar a la ruta privada debts

  return true; // si está autenticado, retornamos true, dejamos pasar a la ruta privada debts
};
