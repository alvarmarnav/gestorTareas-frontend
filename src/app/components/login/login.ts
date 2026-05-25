import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string='';
  password:string='';
  error: string = '';

  private router = inject(Router);
private authService = inject(AuthService);
private title =inject(Title);

form = this.fb.group({
email: ['', [Validators.required, Validators.email]],
password: ['', [Validators.required, Validators.minLength(8)]]
});
error = '';

get email() { return this.form.get('email'); }
get password() { return this.form.get('password');}

ngOnInit(): void {
// Actualizar el título de la pestaña al cargar el componente
this.title.setTitle('GestorTareas — Iniciar sesión');
}

//   async onSubmit():Promise<void>{
// this.authService.login(this.email, this.password)
// .subscribe({
// next: () => {
// this.title.setTitle('GestorTareas — Mis tareas');
// this.router.navigate(['/tasks']);
// },
// error: () => {
// this.error = 'Email o contraseña incorrectos';
// }
// });  }
onSubmit():void{
  if (this.form.invalid) return;
const { email, password } = this.form.value;
this.authService.login(email!, password!).subscribe({
next: () => {
this.title.setTitle('GestorTareas — Mis tareas');
this.router.navigate(['/tasks']);
},
error: () => {
this.error = 'Email o contraseña incorrectos';
}
});
}

}
