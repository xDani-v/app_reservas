import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  cliente: any = {
    estado: 'activo',
    tipo: 'cliente',
  };

  constructor(private datosService: DatosService, private toast: ToastService) { }

  registrar() {
    this.datosService.agregarCliente(this.cliente).subscribe(
      res => {
        this.cliente = {
          estado: 'activo',
          tipo: 'cliente',
        };
        this.toast.show('success', 'Registro exitoso');
      },
      err => {
        this.toast.show('danger', 'Hubo un error al registrar');
      }
    );
  }
} 
