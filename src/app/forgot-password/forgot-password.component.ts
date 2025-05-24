import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule} from '@angular/forms';
import { CommonModule} from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ CommonModule, FormsModule, ToastrModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = '';
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  constructor(private router: Router) {}

  navegarLogin(){
    this.router.navigate(['login'])
  }

  async enviarCorreo(){
    try {
      await this.authService.enviarCorreoReset(this.email);
      this.toastr.success('Correo de restablecimiento enviado exitosamente');
      await Swal.fire("Correo de Recuperacion Enviado")
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 2000);
    } catch (error: any) {
      this.toastr.error(error.message || 'Error al enviar correo de restablecimiento');
      await Swal.fire("Error al Enviar el Correo de Recuperacion")
    }
  }
}
