import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder,ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private title = inject(Title);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  error = '';

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password');}

  ngOnInit(): void {
    // Actualizar el título de la pestaña al cargar el componente
    this.title.setTitle('GestorTareas — Iniciar sesión');
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.title.setTitle('GestorTareas — Mis tareas');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.error = 'Email o contraseña incorrectos';
      },
    });
  }
}
