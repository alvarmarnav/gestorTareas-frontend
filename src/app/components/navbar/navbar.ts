import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, map, Observable } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected authService = inject(AuthService);
private router = inject(Router);

onLogout(): void {
this.authService.logout();
this.router.navigate(['/login']);
}
isLoginPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects === '/login')
    ),
    { initialValue: false }
  );
}


