import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TaskdtoModel } from '../../models/taskdto.model';

@Component({
  selector: 'app-task-detail',
  imports: [],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  @Input() id!: string
  task = signal<TaskdtoModel | null>(null);
  ngOnInit(): void {
    // Leer el parámetro :id de la URL actual
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      // Si no hay id válido, redirigir a la lista
      this.router.navigate(['/tasks']);
      return;
    }
    // Cargar la tarea con ese id
    this.taskService.getTaskById(id).subscribe((task) => this.task.set(task));
  }
  volver(): void {
    this.router.navigate(['/tasks']);
  }
}
