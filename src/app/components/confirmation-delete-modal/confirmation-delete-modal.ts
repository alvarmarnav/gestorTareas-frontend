import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-delete-modal.html',
  styleUrl: './confirmation-delete-modal.css',
})
export class ConfirmationDeleteModal {
  @Input() isOpen = false;
  @Input() title = 'Confirma eliminación';
  @Input() itemName = '';
  @Input() message = '¿Seguro que quieres eliminar este elemento?';
  @Input() warning = 'Esta acción no se puede deshacer.';
  @Input() cancelText = 'Cancelar';
  @Input() confirmText = 'Sí, eliminar';
  @Input() isLoading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(event?: MouseEvent): void {
    event?.stopPropagation();
    event?.preventDefault();

    if (this.isLoading) return;

    this.cancel.emit();
  }

  onConfirm(event?: MouseEvent): void {
    event?.stopPropagation();
    event?.preventDefault();

    if (this.isLoading) return;

    this.confirm.emit();
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
