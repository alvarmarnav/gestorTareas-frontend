import { Component, inject, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
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
export class TaskList implements OnInit,OnDestroy,OnChanges {
  // tasks: TaskdtoModel[] = [];
  tasks = signal<TaskdtoModel[]>([]);
  private subscription?:Subscription;
  private timer?:ReturnType<typeof setInterval>;
  filter = signal<String>('');
  totalTasks=signal<number>(0);


  constructor() {
    // Solo para inyectar dependencias
    // Los @Input() aún no tienen valor aquí
    
  }
  private taskService= inject(TaskService);

  ngOnInit(): void {
  console.log('Componente inicializado');
  this.timer = setInterval(() => {
    console.log('Comprobando tareas...');
  }, 5000);
}

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }


onComplete(id:number):void{
 this.taskService.complete(id);
}

onDelete(id:number):void{
  this.taskService.delete(id);
}

ngOnDestroy(): void {
  if(this.timer){
    clearInterval(this.timer);
  }
  this.subscription?.unsubscribe();
  console.log('Componente timer destruido y liberados recursos.');
}
}
