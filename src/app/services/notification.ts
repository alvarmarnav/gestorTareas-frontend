import { Injectable } from '@angular/core';

export interface Notification{
  type:'success'|'error'|'warning';
  message:string;
}

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private _notification = signal<Notification | null>(null);
readonly notification = this._notification.asReadonly();
mostrarError(message: string): void {
this._notification.set({ tipo: 'error', message });
// Limpiar automáticamente después de 4 segundos
setTimeout(() => this._notification.set(null), 4000);
}
showSuccess(message: string): void {
this._notification.set({ tipo: 'success', message });
setTimeout(() => this._notification.set(null), 3000);
}
}
