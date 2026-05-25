import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { Notification } from "./components/notification/notification";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestorTareas-frontend');
}
