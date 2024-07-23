import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.css'
})
export class MenusComponent {

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  menu: any = {};
  menus: any[] = [];
  page: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';

  constructor(private servicio: DatosService, private toast: ToastService) { }

  ngOnInit() {

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicio.obtenerMenus().subscribe({
      next: (menus) => this.menus = menus,
      error: (error) => console.error('Hubo un error al obtener los menus:', error)
    });
  }

  filtrar(): void {
    if (this.searchTerm != '') {
      this.menus = this.menus.filter(menu =>
        menu.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        menu.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        menu.categoria.includes(this.searchTerm)
      );
    } else {
      this.cargarDatos();
    }

    this.page = 1;
  }

  onSubmit() {
    if (this.menu.id) {
      this.modificar(this.menu);
    } else {
      this.insertar(this.menu);
    }
    this.menu = {}; // Limpia el formulario después de insertar o modificar
    this.closeModal();
    this.cargarDatos();
  }

  insertar(menu: any) {
    this.servicio.agregarMenu(menu).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'Menu insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el Menu');
      }
    );
  }

  cargar(menu: any) {
    this.menu = Object.assign({}, menu);
    this.openModal();

  }

  modificar(menu: any) {
    this.servicio.actualizarMenu(menu).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'Menu modificado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el menu');
      }
    );
  }

  eliminar(menu: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarMenu(menu.id).subscribe(
        response => {
          this.toast.show('success', 'Menu eliminado correctamente');
          this.cargarDatos();
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el Menu');
        }
      );
    });
  }
}
