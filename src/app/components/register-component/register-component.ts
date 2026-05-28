import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private title = inject(Title);

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    userLastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  error = '';
  get userName() {
    return this.form.get('userName');
  }
  get userLastName() {
    return this.form.get('userLastName');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  ngOnInit(): void {
    // Actualizar el título de la pestaña al cargar el componente
    this.title.setTitle('GestorTareas — Registrar Usuario');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { userName, userLastName, email, password } = this.form.value;

    this.authService.register(userName!, userLastName!, email!, password!).subscribe({
      next: () => {
        this.title.setTitle('GestorTareas — Mis tareas');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.dir(this.error);
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else {
          this.error = 'Error al registrar el usuario. Revisa los datos.';
        }
      },
    });
  }

  onRegisterSuccess() {
    // 3. Redirige a la ruta de login (ej: '/login')
    this.router.navigate(['/login']);
  }
}
