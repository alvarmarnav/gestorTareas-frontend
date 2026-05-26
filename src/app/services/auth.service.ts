import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

interface LoginResponseDto{
  token:string,
  expires:string
}

@Injectable({
  providedIn: 'root',
})

export class AuthService {
    
  private http = inject(HttpClient);
private baseUrl = 'https://localhost:5001/api';
// Signal privado — fuente de verdad del token
private _token = signal<string | null>(null);
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
tap(responseToken=> this._token.set(responseToken.token))
);
}
logout(): void {
this._token.set(null);
}
}
