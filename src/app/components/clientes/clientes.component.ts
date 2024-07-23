import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  cliente: any = {};
  clientes: Cliente[] = [];
  page: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';

  constructor(private servicio: DatosService, private toast: ToastService) { }

  ngOnInit() {

    this.cargarClientes();
  }

  cargarClientes(): void {
    this.servicio.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Hubo un error al obtener los clientes:', error)
    });
  }

  filtrarClientes(): void {
    if (this.searchTerm != '') {
      this.clientes = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cliente.cedula.includes(this.searchTerm)
      );
    } else {
      this.cargarClientes();
    }

    this.page = 1;
  }

  onSubmit() {
    if (this.cliente.id) {

      this.modificarCliente(this.cliente);
    } else {
      this.insertarCliente(this.cliente);
    }
    this.cliente = {}; // Limpia el formulario después de insertar o modificar
    this.closeModal();
    this.cargarClientes();
  }

  insertarCliente(cliente: any) {
    this.servicio.agregarCliente(cliente).subscribe(
      response => {
        this.cargarClientes();
        this.toast.show('success', 'Cliente insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el cliente');
      }
    );
  }

  cargarCliente(cliente: any) {
    this.cliente = Object.assign({}, cliente);
    this.openModal();

  }

  modificarCliente(cliente: any) {
    this.servicio.actualizarCliente(cliente).subscribe(
      response => {
        this.cargarClientes();
        this.toast.show('success', 'Cliente modificado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el cliente');
      }
    );
  }

  eliminarCliente(cliente: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarCliente(cliente.id).subscribe(
        response => {
          this.toast.show('success', 'Cliente eliminado correctamente');
          this.cargarClientes();
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el cliente');
        }
      );
    });
  }



}
