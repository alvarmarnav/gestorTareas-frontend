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
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCard,RouterModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  
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

