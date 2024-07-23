import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  reserva: any = {};
  reservas: any[] = [];
  clientes: any[] = [];
  mesasd: any[] = [];

  page: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';

  constructor(private servicio: DatosService, private toast: ToastService) { }

  ngOnInit() {

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicio.obtenerReservas().subscribe({
      next: (reservas) => this.reservas = reservas,
      error: (error) => console.error('Hubo un error al obtener los reservas:', error)
    });
    this.servicio.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Hubo un error al obtener los clientes:', error)
    });
    this.servicio.obtenerMesas().subscribe({
      next: (mesas) => this.mesasd = mesas.filter(mesa => mesa.estado === 'disponible'),
      error: (error) => console.error('Hubo un error al obtener las mesas:', error)
    });
  }

  filtrar(): void {
    if (this.searchTerm != '') {
      this.reservas = this.reservas.filter(reserva =>
        reserva.id_cliente.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reserva.id_mes.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reserva.estado.includes(this.searchTerm)
      );
    } else {
      this.cargarDatos();
    }

    this.page = 1;
  }

  onSubmit() {
    if (this.reserva.id) {
      this.modificar(this.reserva);
    } else {
      this.insertar(this.reserva);
    }
    this.reserva = {}; // Limpia el formulario después de insertar o modificar
    this.closeModal();
    this.cargarDatos();
  }

  insertar(reserva: any) {
    this.servicio.agregarReserva(reserva).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'reserva insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el reserva');
      }
    );
  }

  cargar(reserva: any) {
    this.reserva = Object.assign({}, reserva);
    this.openModal();

  }

  modificar(reserva: any) {
    this.servicio.actualizarReserva(reserva).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'reserva modificado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el reserva');
      }
    );
  }

  eliminar(reserva: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarReserva(reserva.id).subscribe(
        response => {
          this.toast.show('success', 'reserva eliminado correctamente');
          this.cargarDatos();
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el reserva');
        }
      );
    });
  }
}
