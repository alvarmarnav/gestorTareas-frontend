import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notificationComponent',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
  template: `
@if (notificacionService.notification(); as n) {
<div class="notification notification--{{ n.type }}">
{{ n.message }}
</div>
}`

})
export class NotificationComponent {
protected notificationService = inject(NotificationService);

}
