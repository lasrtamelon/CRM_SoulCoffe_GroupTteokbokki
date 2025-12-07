
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';

export function adminGuard(){
 const auth=inject(AuthService);
 const router=inject(Router);
 if(!auth.esAdmin()){ router.navigate(['/productos']); return false; }
 return true;
}
