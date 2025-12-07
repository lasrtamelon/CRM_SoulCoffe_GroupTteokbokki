
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
 selector:'app-login',
 standalone:true,
 imports:[CommonModule,FormsModule],
 templateUrl:'./login-component.html'
})
export class LoginComponent{
 user=signal('');
 pass=signal('');
 error=signal(false);

 constructor(private auth:AuthService, private router:Router){}

 login(){
   this.auth.login(this.user(),this.pass());
   if(!this.auth.logueado()){ this.error.set(true); return; }

   // Si es admin te lleva a dashboard
   if(this.auth.esAdmin()) this.router.navigate(['/dashboard']);
   //si no te lleva a productos
   else this.router.navigate(['/']);
 }
}
