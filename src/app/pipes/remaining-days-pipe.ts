import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingDays',
  standalone: true,
})
export class RemainingDaysPipe implements PipeTransform {
  transform(dueTime: string | null): string {
    if (!dueTime) return 'La tareas no tiene fecha de finalización establecida.';

    const today = new Date();
    const finishDate = new Date(dueTime);

    const diff = finishDate.getTime() - today.getDate();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return `Vencida hace ${Math.abs(days)} días`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return 'Vence mañana';
    return `${days} días restantes`;
  }
}
