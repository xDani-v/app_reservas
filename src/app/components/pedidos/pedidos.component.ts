import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }


  pedido: any = {};
  pedidos: any[] = [];
  reservas: any[] = [];
  menus: any[] = [];
  categorias: any[] = [];

  page: number = 1;
  pageSize: number = 10;

  searchTerm: string = '';

  constructor(private servicio: DatosService, private toast: ToastService) { }

  ngOnInit() {

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicio.obtenerPedidos().subscribe({
      next: (pedidos) => this.pedidos = pedidos,
      error: (error) => console.error('Hubo un error al obtener los pedidos:', error)
    });
    this.servicio.obtenerReservas().subscribe({
      next: (reservas) => this.reservas = reservas.filter(reservas => reservas.estado === 'pendiente'),
      error: (error) => console.error('Hubo un error al obtener las mesas:', error)
    });
    this.servicio.obtenerMenus().subscribe({
      next: (menus) => {
        // Filtrar menús disponibles
        const menusDisponibles = menus.filter(menu => menu.estado === 'disponible');

        // Agrupar menús por categoría
        const menusAgrupadosPorCategoria = menusDisponibles.reduce((acc, menu) => {
          // Si la categoría aún no existe en el acumulador, la inicializamos
          if (!acc[menu.categoria]) {
            acc[menu.categoria] = [];
          }
          // Agregamos el menú a su respectiva categoría
          acc[menu.categoria].push(menu);
          return acc;
        }, {});

        // Asignar los menús agrupados a `this.menus`
        this.menus = menusAgrupadosPorCategoria;
        // Actualizar las categorías basadas en las claves de `this.menus`
        this.categorias = Object.keys(this.menus);
      },
      error: (error) => console.error('Hubo un error al obtener los menús:', error)
    });
  }

  filtrar(): void {
    if (this.searchTerm != '') {
      this.pedidos = this.pedidos.filter(pedido =>
        pedido.id_reserva.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pedido.id_menu.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pedido.estado.includes(this.searchTerm)
      );
    } else {
      this.cargarDatos();
    }

    this.page = 1;
  }

  onSubmit() {
    if (this.pedido.id) {
      this.modificar(this.pedido);
    } else {
      this.insertar(this.pedido);
    }
    this.pedido = {}; // Limpia el formulario después de insertar o modificar
    this.closeModal();
    this.cargarDatos();
  }

  insertar(pedido: any) {
    this.servicio.agregarPedido(pedido).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'pedido insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el pedido');
      }
    );
  }

  cargar(pedido: any) {
    this.pedido = Object.assign({}, pedido);
    this.openModal();

  }

  modificar(pedido: any) {
    this.servicio.actualizarPedido(pedido).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'pedido modificado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el pedido');
      }
    );
  }

  eliminar(pedido: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarPedido(pedido.id).subscribe(
        response => {
          this.toast.show('success', 'pedido eliminado correctamente');
          this.cargarDatos();
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el pedido');
        }
      );
    });
  }
}
