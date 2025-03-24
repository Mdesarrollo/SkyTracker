import { Component,inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router, private authService :AuthService) {}

  navegarMain(){
    this.router.navigate(['main'])
  }

  navegarLogin(){
    this.router.navigate(['login'])
  }

  // toma de datos para el registro
  email = '';
  password = '';

  // configurar que se vea la contraseña
  showPassword = false; // Variable para controlar la visibilidad de la contraseña

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  register() {
    
    this.authService.signUp(this.email, this.password)
      .then(() => {
        
        this.router.navigate(['/main']); // Redirigir después del registro (opcional)
      })
      .catch(error => console.error('Error al registrarse', error));
  }
}
