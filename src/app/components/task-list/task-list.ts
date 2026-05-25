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
export class TaskList implements OnInit, OnDestroy, OnChanges {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  protected taskService = inject(TaskService);

  // tasks = signal<TaskdtoModel[]>([]);
  // private subscription?:Subscription;
  // private timer?:ReturnType<typeof setInterval>;
  // filter = signal<String>('');
  // totalTasks=signal<number>(0);

  // constructor() {
  //   // Solo para inyectar dependencias
  //   // Los @Input() aún no tienen valor aquí
  // }
   ngOnInit(): void {
    // subscribe() es necesario — sin él Angular no hace la petición
    this.taskService.loadTasks().subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
  // private taskService= inject(TaskService);

 
  onComplete(id: number): void {
    // tap() actualiza el Signal automáticamente tras la respuesta
    this.taskService.complete(id).subscribe();
  }
  onDelete(id: number): void {
    this.taskService.delete(id).subscribe();
  }

  //   ngOnChanges(changes: SimpleChanges): void {
  //     throw new Error('Method not implemented.');
  //   }

  // ngOnDestroy(): void {
  //   if(this.timer){
  //     clearInterval(this.timer);
  //   }
  //   this.subscription?.unsubscribe();
  //   console.log('Componente timer destruido y liberados recursos.');
  // }
}
