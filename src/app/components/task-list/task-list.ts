import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { TaskCard } from '../task-card/task-card';
import { TaskdtoModel } from '../../models/taskdto.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCard],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit,OnDestroy {
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
ngOnInit(): void {
  this.loadTasks();
  this.timer = setInterval(() => {
    console.log('Comprobando tareas...');
  }, 5000);
  
}

onComplete(id:number):void{
  this.tasks.update(tasks=>tasks
    .map(t=>t.id === id ? {...t,isCompleted:true}:t));
}

onDelete(id:number):void{
  this.tasks.update(tasks=>tasks.filter(t=>t.id !== id));
}

private loadTasks():void{
  this.tasks=[
      {id: 1,
      title: 'Preparar informe trimestral',
      isCompleted: false,
      dueTime: '2025-06-30',
      userName: 'Ana García',
      type: 'Simple',
    },
    {
      id: 2,
      title: 'Revisión semanal de backlog',
      isCompleted: true,
      dueTime: null,
      userName: 'Carlos López',
      type: 'Recurrente',
    },
    {
      id: 3,
      title: 'Revisión semanal de backlog',
      isCompleted: true,
      dueTime: null,
      userName: 'Carlos López',
      type: 'Recurrente',
    }
  ]
  
}
ngOnDestroy(): void {
  if(this.timer){
    clearInterval(this.timer);
  }
  this.subscription?.unsubscribe();
  console.log('Componente timer destruido y liberados recursos.');
}
}
