import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../Environments/environment';
import { RegisterDto } from '../models/register-dto/register-dto.model';

interface LoginResponseDto{
  token:string,
  expires:string
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
    
  private http = inject(HttpClient);
private baseUrl = environment.apiUrl;
private tokenLocal = 'gestor_tareas_token';

// Signal privado — fuente de verdad del token
private _token = signal<string | null>(
  localStorage.getItem(this.tokenLocal)
);
// Signals públicos de solo lectura
readonly token = this._token.asReadonly();
readonly isAuthenticated = computed(() => this._token() !== null);

emailAvailabilityValidator(email: string) {
      return this.http.get<boolean>(`${this.baseUrl}/auth/check-email?email=${email}`); 
    }

login(userEmail: string, userPassword: string) {
return this.http.post<LoginResponseDto>(
`${this.baseUrl}/Auth/login`,
{ userEmail, userPassword }
).pipe(
// tap guarda el token cuando el login tiene éxito
tap(responseToken=> {
  this._token.set(responseToken.token)
  //guardar en localstorage
  this.setToken(responseToken.token)
})
);
}
register(userName:string,userLastName:string,userEmail: string, userPassword: string) {
return this.http.post<RegisterDto>(
`${this.baseUrl}/Auth/register`,
{userName,userLastName, userEmail, userPassword }
)
}
logout(): void {
this._token.set(null);
localStorage.removeItem(this.tokenLocal)
}
private setToken(token:string){
  this._token.set(token)
  localStorage.setItem(this.tokenLocal,token)
}
}
