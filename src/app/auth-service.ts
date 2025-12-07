
import { Injectable, signal, computed } from '@angular/core';

@Injectable({providedIn:'root'})
export class AuthService{
 private _user=signal<{username:string,role:'admin'|'user'}|null>(null);
 usuario=computed(()=>this._user());
 logueado=computed(()=>!!this._user());
 esAdmin(){ return this._user()?.role==='admin'; }

 login(u:string,p:string){
   if(u==='admin'&&p==='admin') this._user.set({username:u,role:'admin'});
   else if(u==='user'&&p==='user') this._user.set({username:u,role:'user'});
   else this._user.set(null);
 }
 logout(){ this._user.set(null); }
}
