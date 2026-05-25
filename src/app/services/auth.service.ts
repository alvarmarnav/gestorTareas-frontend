import { Injectable } from '@angular/core';

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
login(email: string, password: string) {
return this.http.post<LoginResponseDto>(
`${this.baseUrl}/auth/login`,
{ email, password }
).pipe(
// tap guarda el token cuando el login tiene éxito
tap(responseTok => this._token.set(responseTok.token))
);
}
logout(): void {
this._token.set(null);
}
}
