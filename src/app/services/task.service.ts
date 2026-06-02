import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../Environments/environment';
import { CreateCompositeTaskDto } from '../models/composite-task-dto/create-composite-task-dto.model';
import { CreateCollaborativeTaskDto } from '../models/create-collaborativetask-dto.model';
import { CreateTaskDto } from '../models/create-task-dto.model';
import { FormTaskType } from '../models/formtasktype';
import { PaginationDto } from '../models/pagination-dto.model';
import { CreateRecurringTaskDto } from '../models/recurring-task-dto/create-recurring-task-dto.model';
import { CreateSubTaskDto } from '../models/sub-task-dto/create-sub-task-dto.model';
import { TaskPriority } from '../models/task-priority';
import { TaskStatus } from '../models/task-status';
import { TaskdtoModel } from '../models/taskdto.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiUrl;

  // Signal privado — fuente de verdad de las tasks
  private _tasks = signal<TaskdtoModel[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Signals públicos de solo lectura
  readonly tasks = this._tasks.asReadonly();
  readonly totalPending = computed(
    () => this._tasks().filter((t) => t.taskStatus !== TaskStatus.Completed).length,
  );
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalPendingTasks = this.totalPending;

  private normalizeTask(raw: any): TaskdtoModel {
    const status = Number(raw?.status ?? raw?.taskStatus ?? TaskStatus.Pending) as TaskStatus;
    const priority = Number(
      raw?.priority ?? raw?.taskPriority ?? TaskPriority.Normal,
    ) as TaskPriority;

    return {
      ...raw,
      taskType: Number(raw?.taskType ?? FormTaskType.Simple) as FormTaskType,
      taskDescription: raw?.taskDescription ?? null,
      priority,
      status,
      dueTime: raw?.dueTime ?? null,
      cancelReason: raw?.cancelReason ?? null,
      subTasksList: Array.isArray(raw?.subTasksList)
        ? raw.subTasksList.map((st: any) => this.normalizeTask(st))
        : undefined,
      taskCollaborators: raw?.taskCollaborators ?? raw?.userList ?? undefined,
      recurrenceRule: raw?.recurrenceRule ?? null,
      recurringTasksCount: raw?.recurringTasksCount ?? null,
      recurringSeriesId: raw?.recurringSeriesId ?? null,
      parentCompositeTaskId: raw?.parentCompositeTaskId ?? null,
      linkedTaskOrder: raw?.linkedTaskOrder ?? null,
      isCompleted: status === TaskStatus.Completed,
    } as TaskdtoModel;
  }

  private normalizeTasks(raw: any[]): TaskdtoModel[] {
    return (raw ?? []).map((task) => this.normalizeTask(task));
  }

  // Función reutilizable para manejar errores HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error de red — el servidor no responde
      console.error('Error de red:', error.message);
    } else if (error.status === 401) {
      console.error('No autorizado — token inválido o expirado');
    } else if (error.status === 404) {
      console.error('Recurso no encontrado');
    } else {
      console.error(`Error del servidor: ${error.status}`, error.error);
    }
    // throwError() propaga el error al siguiente catchError o al subscribe
    return throwError(() => error);
  }
  // GET /api/tasks — devuelve Observable<PaginadoDto<TareaDto>>
  getTasks(actualPage: number, itemsPerPage: number): Observable<TaskdtoModel[]> {
    return this.http
      .get<PaginationDto<any>>(`${this.baseUrl}/tasks`, {
        params: {
          actualPage: actualPage.toString(),
          itemsPerPage: itemsPerPage.toString(),
        },
      })
      .pipe(
        map((response) => this.normalizeTasks(response.data)),
        catchError((error) => this.handleError(error)),
      );
  }
  // GET /api/tasks/:id — obtener una task por id
  getTaskById(id: number) {
    return this.http
      .get<TaskdtoModel>(`${this.baseUrl}/tasks/${id}`)
      .pipe(map((task) => this.normalizeTask(task)));
  }

  // POST /api/tasks — crear una task nueva
  create(dto: CreateTaskDto): Observable<TaskdtoModel> {
    return this.http
      .post<any>(`${this.baseUrl}/tasks/simple`, dto)
      .pipe(map((task) => this.normalizeTask(task)));
  }

  createRecurring(dto: CreateRecurringTaskDto): Observable<TaskdtoModel[]> {
    return this.http.post<any[]>(`${this.baseUrl}/tasks/recurring`, dto);
  }

  createComposite(dto: CreateCompositeTaskDto): Observable<TaskdtoModel> {
    return this.http
      .post<any>(`${this.baseUrl}/tasks/composite`, dto)
      .pipe(map((task) => this.normalizeTask(task)));
  }

  createCollaborative(dto: CreateCollaborativeTaskDto): Observable<TaskdtoModel> {
    return this.http
      .post<any>(`${this.baseUrl}/tasks/collaborative`, dto)
      .pipe(map((task) => this.normalizeTask(task)));
  }
  createSubTask(compositeTaskId: number, dto: CreateSubTaskDto): Observable<TaskdtoModel> {
    return this.http
      .post<any>(`${this.baseUrl}/tasks/${compositeTaskId}/subtasks`, dto)
      .pipe(map((task) => this.normalizeTask(task)));
  }

  addLinkedRelation(
    taskId: number,
    dto: { dependsOnTaskId: number; linkedTaskOrder: number },
  ): Observable<any> {
    return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks/${taskId}/linkedRelation`, dto);
  }
  getLinkedTasks(taskId: number): Observable<TaskdtoModel[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/tasks/${taskId}/linkable`)
      .pipe(map((tasks) => this.normalizeTasks(tasks)));
  }
  // PUT /api/tasks/:id — actualizar una task existente
  update(taskId: number, dto: Partial<CreateTaskDto>): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/tasks/${taskId}`,
      dto, // PUT devuelve 204 No Content — por eso void como tipo
    );
  }
  deleteLinkedRelation(taskId: number, linkedTaskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${taskId}/linkedRelation/${linkedTaskId}`);
  }
  // DELETE /api/tasks/:id — eliminar una task
  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${taskId}`).pipe(
      tap(() => this._tasks.update((tasks) => tasks.filter((t) => t.id !== taskId))),
      catchError((err) => this.handleError(err)),
    );
  }

  complete(taskId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${taskId}/complete`, {}).pipe(
      tap(() =>
        this._tasks.update((tasks) =>
          tasks.map((t) =>
            t.id === taskId ? { ...t, taskStatus: TaskStatus.Completed, isCompleted: true } : t,
          ),
        ),
      ),
      catchError((err) => this.handleError(err)),
    );
  }

  loadTasks(): Observable<TaskdtoModel[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.http
      .get<PaginationDto<any>>(`${this.baseUrl}/tasks`, {
        params: {
          actualPage: '1',
          itemsPerPage: '10',
        },
      })
      .pipe(
        map((response) => this.normalizeTasks(response.data)),
        tap((tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._loading.set(false);
          this._error.set('Error al cargar las tareas');
          console.error(err);
          return of([]);
        }),
      );
  }
}
