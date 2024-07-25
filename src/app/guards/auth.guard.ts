import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cargo = localStorage.getItem('cg');

  if (cargo) {
    return true; // Permite el acceso si 'cg' existe en localStorage
  } else {
    router.navigate(['/login']);
    return false; // Redirige a login si 'cg' no existe
  }
};