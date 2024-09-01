import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';

export const PublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService)

  const isAuthenticated = authService.verifyAuthentication()

  if(isAuthenticated){
    router.navigateByUrl('')
    return false
  }
  // pero de qué manera no retornará true? de qué manera no vamos a dejar que se entre a la ruta publica(auth)?
  // la unica manera de que no vaya a esa ruta es que esté autenticado el usuario, ahi deberia quedarse en el home(debts)
  // por eso decimos que si está autenticado, le redirigimos al home y retornamos false para no dejarlo pasar a la ruta auth

  return true; // si no está autenticado retornamos true, dejamos pasar a la ruta publica auth
};
