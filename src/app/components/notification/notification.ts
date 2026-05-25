import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
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
export class Notification {
protected notificationService = inject(NotificationService);

}
