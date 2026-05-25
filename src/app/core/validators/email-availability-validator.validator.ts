import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { catchError, debounceTime, map, Observable, of, switchMap } from "rxjs";

// Validador asíncrono — comprueba si el email ya está registrado en la API
export function emailAvailabilityValidator (
    
authService: AuthService
): AsyncValidatorFn {
return (control: AbstractControl): Observable<ValidationErrors | null> => {

if (!control.value) return of(null);

// debounceTime evita llamar a la API en cada tecla
return of(control.value).pipe(
debounceTime(400),
switchMap(email =>
authService.emailAvailabilityValidator(email)
.pipe(
    map(available => available ? null : { emailNotAvailable: true }),
catchError(() => of(null))
)
)
);
};
}

// Usar el validador asíncrono — tercer parámetro del FormControl
// [valor, validadoresSincronos, validadoresAsincronos]
// email: ['', [Validators.required, Validators.email],[emailDisponibleValidator(this.authService)]]
