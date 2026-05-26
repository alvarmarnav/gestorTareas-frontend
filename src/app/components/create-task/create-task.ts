import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CreateTaskDto } from '../../models/create-task-dto.model';
import { FormBuilder, Validators,ReactiveFormsModule,FormArray,FormControl } from '@angular/forms';
import { futureDateValidator } from '../../core/validators/future-date-validator.validator';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {

private fb = inject(FormBuilder);
private router = inject(Router);
private route = inject(ActivatedRoute);
private taskService = inject(TaskService);

taskId: number | null = null;

form = this.fb.group({
title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
taskDescription: [''],
dueTime: [null as string | null, futureDateValidator()],
type: ['Simple', Validators.required],
// userId: [null as number | null, [Validators.required, Validators.min(1)]]
});

get formTitle(): string {
return this.taskId ? 'Editar tarea' : 'Nueva tarea';
}

ngOnInit(): void {
const id = this.route.snapshot.paramMap.get('id');
if (id) {
this.taskId = Number(id);
this.taskService.getTaskById(this.taskId)
.subscribe(task => {
this.form.patchValue({
title: task.title,
taskDescription: task.taskDescription ?? '',
dueTime: task.dueTime,
type: task.type,
// userId: task.userId
});
});
}
}

onSubmit(): void {
if (this.form.invalid) return;
const dto = this.form.value as CreateTaskDto;

const operation = this.taskId ? this.taskService.update(this.taskId, dto) : this.taskService.create(dto);
operation.subscribe(() => {
  this.form.reset();
  this.router.navigate(['/tasks']);
});
}

get title() { return this.form.get('title'); }
get dueTime() { return this.form.get('dueTime'); }
get userId() { return this.form.get('userId'); }

cancel(): void { this.router.navigate(['/tasks']); }

// patchValue() — rellena solo los campos indicados
// Los campos no mencionados mantienen su valor actual
// this.form.patchValue({
// title: 'Preparar informe trimestral',
// type: 'Simple'
// // descripcion, fechaLimite y usuarioId no cambian
// });

}
