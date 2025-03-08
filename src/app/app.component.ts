import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) { }

  navegarHistorial(){
    this.router.navigate(['historial'])
  }
}
