import { Injectable, signal } from '@angular/core';

export interface Notification {
  type: 'success' | 'error' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notification = signal<Notification | null>(null);
  readonly notification = this._notification.asReadonly();

  showError(message: string): void {
    this._notification.set({
      type: 'error',
      message
    });
    // Limpiar automáticamente después de 4 segundos
    setTimeout(() => this._notification.set(null), 4000);
  }

  showSuccess(message: string): void {
    this._notification.set({
      type: 'success',
      message
    });
    setTimeout(() => this._notification.set(null), 3000);
  }
}
