import {
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { TaskdtoModel } from '../../models/taskdto.model';
import { Subscription } from 'rxjs';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  protected taskService = inject(TaskService);

  ngOnInit(): void {
    // subscribe() es necesario — sin él Angular no hace la petición
    this.taskService.loadTasks().subscribe();
  }
  onComplete(id: number): void {
    // tap() actualiza el Signal automáticamente tras la respuesta
    this.taskService.complete(id).subscribe();
  }
  onDelete(id: number): void {
    this.taskService.delete(id).subscribe();
  }
}
