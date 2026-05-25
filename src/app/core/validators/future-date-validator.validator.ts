import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

// Validador que comprueba que la fecha límite no sea anterior a hoy
export function futureDateValidator(): ValidatorFn {
return (control: AbstractControl): ValidationErrors | null => {

if (!control.value) {
// Si no hay fecha no hay error — el campo es opcional
return null;
}

const dueTime = new Date(control.value);
const today = new Date();
today.setHours(0, 0, 0, 0); // comparar solo la fecha sin la hora

if (dueTime < today) {
// Devolver un objeto con el nombre del error como clave
return { overDueDate: true };
}

// null significa que el control es válido
return null;
};
}

// Usar el validador personalizado en el FormControl
// form = this.fb.group({
// titulo: ['', Validators.required],
// fechaLimite: [null, futureDateValidation()] // validador personalizado
// });