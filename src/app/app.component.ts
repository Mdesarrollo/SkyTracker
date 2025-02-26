import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HistorialComponent } from './historial/historial.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent,HistorialComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SkyTracker';
}
