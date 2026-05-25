import { Routes } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { TaskDetail } from './components/task-detail/task-detail';

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
canActivate: [noAuthGuard]
},
{
path: 'tasks',
canActivate: [authGuard],
component:TaskList
},
{
    path: 'tasks/newTask',
    canActivate:[authGuard],
    loadComponent:()=>
        import('./components/create-task/create-task')
    .then(m=>m.CreateTask)
},
{
path: 'tasks/:id/edit',
canActivate: [authGuard],
loadComponent: () =>
import('./components/create-task/create-task')
.then(m => m.CreateTask)
},
{
path: 'tasks/:id',
canActivate: [authGuard],
component: TaskDetail,
},
{
// Ruta raíz y comodín (ya definidas anteriormente)
path: '',
redirectTo: 'login',
pathMatch: 'full'
},
{
path: '**',
redirectTo: 'login'
}
];
