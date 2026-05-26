import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './components/task-list/task-list';
import { NotificationComponent } from "./components/notification/notification";
import { TaskCard } from './components/task-card/task-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent,TaskCard, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestorTareas-frontend');
}
