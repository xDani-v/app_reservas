import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  showModal: boolean = false;

  cliente: any = {};

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.servicio.obtenerCliente(token).subscribe(
        (res: any) => {
          this.cliente = res;

        },
        (err: any) => {
          console.error('Error fetching client data', err);
        }
      );
    } else {
      console.error('No token found in localStorage');
    }
  }

  constructor(private router: Router, private servicio: DatosService, private toast: ToastService) { }

  clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('cg');
    this.router.navigate(['/login']);
  }

  actualizardatos() {
    this.servicio.actualizarCliente(this.cliente).subscribe(
      response => {

        this.toast.show('success', 'Datos actualizados correctamente');
        this.showModal = false;
      },
      error => {
        this.toast.show('danger', 'Error al actualizar datos');
      }
    );
  }
}
