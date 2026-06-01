import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormTaskType } from '../../models/formtasktype';
import { TaskStatus } from '../../models/task-status';
import { TaskdtoModel } from '../../models/taskdto.model';
import { RemainingDaysPipe } from '../../pipes/remaining-days-pipe';
import { ConfirmationDeleteModal } from '../confirmation-delete-modal/confirmation-delete-modal';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [RouterLink, RemainingDaysPipe, DatePipe, ConfirmationDeleteModal],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard implements OnChanges {
  @Input() task!: TaskdtoModel;
  daysToEnd: number = 0;
  protected readonly TaskType = FormTaskType;
  readonly TaskStatus = TaskStatus;
  showDeleteModal = false;
  noDueTime: string = 'Sin fecha FIN';
  // @Output() taskCompleted = new EventEmitter<number>();
  completing: boolean = false;
  errorMessage: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      const prevTask = changes['task'].previousValue;
      const newTask = changes['task'].currentValue;

      if (changes['task'].firstChange) {
        console.log('La tarea cambió: ', prevTask, ' ahora: ', newTask);
      }
      this.calculateDaysToEnd();
    }
  }

  private calculateDaysToEnd(): void {
    if (!this.task.dueTime) {
      this.daysToEnd = 0;
      return;
    }
    const today = new Date();
    const lastDate = new Date(this.task.dueTime);
    this.daysToEnd = Math.ceil((lastDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  openDeleteModal(event?: MouseEvent): void {
    event?.stopPropagation();
    event?.preventDefault();

    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDeleteTask(): void {
    this.deleteTask.emit(this.task.id);
    this.showDeleteModal = false;
  }
}
