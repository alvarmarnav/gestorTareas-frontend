import { Component } from '@angular/core';

@Component({
  selector: 'app-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {

  private route = inject(ActivatedRoute);
private router = inject(Router);
private tareaService = inject(TaskService);
tarea = signal<TaskDtoModel | null>(null);
ngOnInit(): void {
// Leer el parámetro :id de la URL actual
const id = Number(this.route.snapshot.paramMap.get('id'));
if (!id) {
// Si no hay id válido, redirigir a la lista
this.router.navigate(['/tasks']);
return;
}
// Cargar la tarea con ese id
this.tareaService.obtenerTareaPorId(id)
.subscribe(task => this.task.set(task));
}
volver(): void {
this.router.navigate(['/tasks']);
}

}
