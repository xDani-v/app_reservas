import { Component } from '@angular/core';
import { EditComponent } from '../edit/edit.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { DatosService } from '../../services/datos.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [EditComponent, FormsModule, NgxPaginationModule, CommonModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent {

  usuario: any = {};
  reserva: any = {
    hora_inicio: '',
    hora_fin: '',
    estado: 'confirmada',
  };
  pedido: any = {};
  reservas: any[] = [];
  mesasd: any[] = [];
  pedidos: any[] = [];
  menus: any[] = [];
  menusDisponibles: any[] = [];
  categorias: any[] = [];
  reservaactual: any = {};

  page: number = 1;
  pageSize: number = 9;

  showModal: boolean = false;
  constructor(private servicio: DatosService, private toast: ToastService) {
    this.menus = [];
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  modalReserva: boolean = false;
  openModalReserva(reserva: any) {
    this.modalReserva = true;
    this.reservaactual = reserva;
    this.cargarPedidos(reserva);
  }

  closeModalReserva() {
    this.modalReserva = false;
    this.cargarDatos();
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    let token: any = localStorage.getItem('response');
    if (token) {
      let usr = JSON.parse(token).user;
      this.usuario = usr.nombres + " " + usr.apellidos;
    }

    this.cargarDatos();
  }

  cargarDatos(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.servicio.obtenerReservas().subscribe({
        next: (reservas) => {
          this.reservas = reservas.filter(reserva => reserva.id_cliente.toString() === token.toString());
        },
        error: (error) => {
          console.error('Hubo un error al obtener las reservas:', error);
        }
      });
    } else {
      console.warn('No se encontró un token en el localStorage.');
    }
    this.servicio.obtenerMesas().subscribe({
      next: (mesas) => this.mesasd = mesas.filter(mesa => mesa.estado === 'disponible'),
      error: (error) => console.error('Hubo un error al obtener las mesas:', error)
    });
  }

  cargarPedidos(reserva: any) {
    this.servicio.obtenerPedidos().subscribe({
      next: (pedidos) => this.pedidos = pedidos.filter(pedido => pedido.id_reserva == reserva.id),
      error: (error) => console.error('Hubo un error al obtener los pedidos:', error)
    });
    this.servicio.obtenerMenus().subscribe({
      next: (menus) => {
        // Filtrar menús disponibles
        this.menusDisponibles = menus.filter(menu => menu.estado === 'disponible');

        // Agrupar menús por categoría
        const menusAgrupadosPorCategoria = this.menusDisponibles.reduce((acc, menu) => {
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

  onSubmit() {
    this.reserva.id_cliente = localStorage.getItem('token');
    this.servicio.agregarReserva(this.reserva).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'reserva insertado correctamente');
        this.reserva = {
          estado: 'confirmada',
        };
      },
      error => {
        this.toast.show('danger', 'Error al modificar el reserva');
      }
    );
    this.closeModal();
    this.cargarDatos();
  }

  modificar(reserva: any) {
    reserva.estado = 'anulada';
    this.servicio.actualizarReserva(reserva).subscribe(
      response => {
        this.cargarDatos();
        this.toast.show('success', 'reserva anulada correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el reserva');
      }
    );
  }

  actualizarHoraFin() {
    if (this.reserva.hora_inicio) {
      const [hours, minutes] = this.reserva.hora_inicio.split(':');
      let date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(0); // Asegurar que los minutos sean 00
      date.setSeconds(0);
      date.setMilliseconds(0);
      date.setHours(date.getHours() + 2); // Añadir 2 horas

      const horaFin = date.toTimeString().split(':').slice(0, 2).join(':');
      this.reserva.hora_fin = horaFin;
      this.reserva.hora_inicio = `${hours.padStart(2, '0')}:00`; // Asegurar que los minutos sean 00
    }
  }

  insertarPedido() {
    this.pedido.id_reserva = this.reservaactual.id;
    this.pedido.estado = 'pendiente';
    this.servicio.agregarPedido(this.pedido).subscribe(
      response => {
        this.cargarPedidos(this.reservaactual);
        this.toast.show('success', 'pedido insertado correctamente');
      },
      error => {
        this.toast.show('danger', 'Error al modificar el pedido');
      }
    );
  }

  eliminarPedido(pedido: any) {
    this.toast.show('confirmation', '¿Estás seguro?', () => {
      this.servicio.eliminarPedido(pedido.id).subscribe(
        response => {
          this.toast.show('success', 'pedido eliminado correctamente');
          this.cargarPedidos(this.reservaactual);
        },
        error => {
          this.toast.show('danger', 'Error al eliminar el pedido');
        }
      );
    });
  }

  getNombreMenu(id_menu: number): string {
    const menu = this.menusDisponibles.find(menu => menu.id === id_menu);
    return menu ? menu.nombre : 'Nombre no encontrado';
  }
}
