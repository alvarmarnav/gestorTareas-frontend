import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TaskdtoModel } from '../../models/taskdto.model';
import { RouterLink } from '@angular/router';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-card',
  standalone:true,
  imports: [RouterLink],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard implements OnChanges{
  @Input() task!:TaskdtoModel;
  daysToEnd:number=0;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['task']){
      const prevTask = changes['task'].previousValue;
      const newTask = changes['task'].currentValue;

      if(changes['task'].firstChange){
        console.log("La tarea cambió: ",prevTask, ' ahora: ',newTask);
      }
      this.calculateDaysToEnd();
    }
  }

  private calculateDaysToEnd():void{
if(!this.task.dueTime){
  this.daysToEnd=0; return;
}
const today = new Date();
const lastDate = new Date(this.task.dueTime);
this.daysToEnd=Math.ceil((lastDate.getTime()-today.getTime())/(1000 * 60 * 60 * 24))
  }
  // @Output() — emite un evento al padre cuando se completa la tarea
// EventEmitter<number> indica que el evento lleva un número (el id)
@Output() completeTask = new EventEmitter<number>();
// @Output() — emite un evento al padre cuando se elimina la tarea
@Output() deleteTask = new EventEmitter<number>();
// Método que se llama al hacer clic en "Completar"
onCompleteTask(): void {
// emit() dispara el evento y pasa el id al padre
this.completeTask.emit(this.task.id);
}
// Método que se llama al hacer clic en "Eliminar"
onDeleteTask(): void {
this.deleteTask.emit(this.task.id);
}
}
