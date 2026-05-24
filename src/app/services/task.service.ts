import { computed, inject, Injectable, signal } from '@angular/core';
import { TaskdtoModel } from '../models/taskdto.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PaginationDto } from '../models/pagination-dto.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CreateTaskDto } from '../models/create-task-dto.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:5001/api';

  private readonly _tasks = signal<TaskdtoModel[]>([]);
  readonly tasks = this._tasks.asReadonly();

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
  // GET /api/tareas — devuelve Observable<PaginadoDto<TareaDto>>
  getTasks(pageNumber:number,pageSize:number):Observable<PaginationDto<TaskdtoModel>> {
    return this.http.get<PaginationDto<TaskdtoModel>>(`${this.baseUrl}/tasks`)
    .pipe(
      // map((response) => response.tasksData), // extraer el array
      catchError((error) => this.handleError(error)),
    );
  }
  // GET /api/tareas/:id — obtener una tarea por id
  getTaskById(id: number) {
    return this.http.get<TaskdtoModel>(`${this.baseUrl}/tasks/${id}`);
  }

  // POST /api/tareas — crear una tarea nueva
  create(dto: CreateTaskDto) {
    return this.http.post(
      `${this.baseUrl}/tareas`,
      dto, // HttpClient serializa a JSON y añade Content-Type automáticamente
    );
  }
  // PUT /api/tareas/:id — actualizar una tarea existente
  update(id: number, dto: CreateTaskDto) {
    return this.http.put<void>(
      `${this.baseUrl}/tareas/${id}`,
      dto, // PUT devuelve 204 No Content — por eso void como tipo
    );
  }
  // DELETE /api/tareas/:id — eliminar una tarea
  delete(id: number) {
    return this.http.delete<void>(
      `${this.baseUrl}/tareas/${id}`,
      // DELETE también devuelve 204 No Content
    );
  }

  readonly totalPendingTasks = computed(() => this._tasks().filter((t) => !t.isCompleted).length);

  complete(id: number): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, isCompleted: true } : t)),
    );
  }
}
