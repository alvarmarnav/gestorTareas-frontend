import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskdtoModel } from '../models/taskdto.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PaginationDto } from '../models/pagination-dto.model';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CreateTaskDto } from '../models/create-task-dto.model';
import { AuthService } from './auth.service';
import { environment } from '../../Environments/environment';
import { CreateRecurringTaskDto } from '../models/recurring-task-dto/create-recurring-task-dto.model';
import { CreateCompositeTaskDto } from '../models/composite-task-dto/create-composite-task-dto.model';
import { CreateTaskcollaboratorDto } from '../models/create-taskcollaborator-dto/create-taskcollaborator-dto.model';
import { CreateCollaborativeTaskDto } from '../models/create-collaborativetask-dto.model';

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
  readonly totalPending = computed(() => this._tasks().filter((t) => !t.isCompleted).length);
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

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
  getTasks(pageNumber: number, pageSize: number): Observable<TaskdtoModel[]> {
    return this.http
      .get<PaginationDto<TaskdtoModel>>(`${this.baseUrl}/tasks`, {
        params: {
          pageNumber,
          pageSize: pageSize,
        },
      })
      .pipe(
        map((response) => response.data), // extraer el array
        catchError((error) => this.handleError(error)),
      );
  }
  // GET /api/tasks/:id — obtener una task por id
  getTaskById(id: number) {
    return this.http.get<TaskdtoModel>(`${this.baseUrl}/tasks/${id}`);
  }

  // POST /api/tasks — crear una task nueva
  create(dto: CreateTaskDto): Observable<TaskdtoModel> {
    return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks`, dto);
  }
  //poliformismo
//   createSimple(dto: any) {
//   return this.http.post<any>(`${this.baseUrl}/tasks/simple`, dto);
// }

createRecurring(dto: CreateRecurringTaskDto):Observable<TaskdtoModel> {
  return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks/recurring`, dto);
}

createComposite(dto: CreateCompositeTaskDto):Observable<TaskdtoModel> {
  return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks/composite`, dto);
}

createCollaborative(dto: CreateCollaborativeTaskDto):Observable<TaskdtoModel> {
  return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks/collaborative`, dto);
}

addLinkedRelation(taskId: number, dto: { dependsOnTaskId: number; linkedTaskOrder: number }):Observable<TaskdtoModel> {
  return this.http.post<TaskdtoModel>(`${this.baseUrl}/tasks/${taskId}/linkedRelation`, dto);
}

  // PUT /api/tasks/:id — actualizar una task existente
  update(id: number, dto: CreateTaskDto): Observable<TaskdtoModel> {
    return this.http.put<TaskdtoModel>(
      `${this.baseUrl}/tasks/${id}`,
      dto, // PUT devuelve 204 No Content — por eso void como tipo
    );
  }
  // DELETE /api/tasks/:id — eliminar una task
  delete(id: number):  Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`).pipe(
      tap(() => this._tasks.update((tasks) => tasks.filter((t) => t.id !== id))),
      catchError((err) => this.handleError(err)),
    );
  }

  readonly totalPendingTasks = computed(() => this._tasks().filter((t) => !t.isCompleted).length);

  complete(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${id}`, {}).pipe(
      tap(() =>
        this._tasks.update((tasks) =>
          tasks.map((t) => (t.id === id ? { ...t, isCompleted: true } : t)),
        ),
      ),
      catchError((err) => this.handleError(err)),
    );
  }

  loadTasks() {
    this._loading.set(true);
    this._error.set(null);
    return this.http.get<PaginationDto<TaskdtoModel>>(`${this.baseUrl}/tasks`).pipe(
      map((response) => response.data),
      tap((tasks) => {
        this._tasks.set(tasks);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._loading.set(false);
        this._error.set('Error al cargar las tareas');
        return of([]);
      }),
    );
  }
}
