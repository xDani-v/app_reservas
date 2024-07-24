import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css'
})
export class MesasComponent {
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  mesa: any = {};
  mesas: any[] = [];
  page: number = 1;
  pageSize: number = 9;

  searchTerm: string = '';

  constructor(private servicio: DatosService, private toast: ToastService) { }

  ngOnInit() {

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicio.obtenerMesas().subscribe({
      next: (mesas) => this.mesas = mesas,
      error: (error) => console.error('Hubo un error al obtener los mesas:', error)
    });
  }

  filtrar(): void {
    if (this.searchTerm != '') {
      this.mesas = this.mesas.filter(mesa =>
        mesa.ubicacion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mesa.capacidad.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mesa.estado.includes(this.searchTerm)
      );
    } else {
      this.cargarDatos();
    }

    this.page = 1;
  }

  onSubmit() {
    if (this.mesa.id) {
      this.modificar(this.mesa);
    } else {
      this.insertar(this.mesa);
    }
    this.mesa = {}; // Limpia el formulario después de insertar o modificar
    this.closeModal();
    this.cargarDatos();
  }

  insertar(mesa: any) {
    this.servicio.agregarMesa(mesa).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'mesa insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el mesa');
      }
    );
  }

  cargar(mesa: any) {
    this.mesa = Object.assign({}, mesa);
    this.openModal();

  }

  modificar(mesa: any) {
    this.servicio.actualizarMesa(mesa).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'mesa modificado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el mesa');
      }
    );
  }

  eliminar(mesa: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarMesa(mesa.id).subscribe(
        response => {
          this.toast.show('success', 'mesa eliminado correctamente');
          this.cargarDatos();
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el mesa');
        }
      );
    });
  }
}
