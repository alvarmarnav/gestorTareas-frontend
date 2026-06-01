import { Routes } from '@angular/router';
import { CreateSubtask } from './components/create-subtask/create-subtask';
import { Login } from './components/login/login';
import { RegisterComponent } from './components/register-component/register-component';
import { TaskDetail } from './components/task-detail/task-detail';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Sin lazy loading — el componente se importa al inicio
  // component: LoginComponent
  // Con lazy loading — se carga solo cuando el usuario navega aquí
  // loadComponent devuelve una Promise con el componente
  {
    // Ruta pública — sin guard
    path: 'login',
    component: Login,
    // solo accesible si NO está autenticado
    canActivate: [noAuthGuard],
  },
  {
    // Ruta pública — sin guard
    path: 'register',
    component: RegisterComponent,
    // solo accesible si NO está autenticado
    canActivate: [noAuthGuard],
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent:()=> import('./components/task-list/task-list').then((m=>m.TaskList)),
  },
  {
    path: 'tasks/newTask',
    canActivate: [authGuard],
    loadComponent: () => import('./components/create-task/create-task').then((m) => m.CreateTask),
  },
  {
    path: 'tasks/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./components/create-task/create-task').then((m) => m.CreateTask),
  },
  {
    path: 'tasks/:id',
    canActivate: [authGuard],
    component: TaskDetail,
  },
  {
  path:'tasks/:id/subtsk/new',
  canActivate: [authGuard],
  component: CreateSubtask,
  },
  {
    // Ruta raíz y comodín (ya definidas anteriormente)
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
