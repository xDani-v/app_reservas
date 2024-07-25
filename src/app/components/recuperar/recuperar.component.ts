import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {

  correo: string = '';

  constructor(private datosService: DatosService, private toast: ToastService) { }

  recuperarContrasena() {
    this.datosService.recuperarContrasena(this.correo).subscribe(
      res => {
        this.toast.show('success', 'Se ha enviado un correo con las instrucciones para recuperar la contraseña');
      },
      err => {
        this.toast.show('danger', 'Hubo un error al recuperar la contraseña');
      }
    );
  }
}
