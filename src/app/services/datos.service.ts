import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private apiUrl = 'http://localhost:3000/api/clientes/';
  private apiUrlMenu = 'http://localhost:3000/api/menus/';
  private apiUrlMesa = 'http://localhost:3000/api/mesas/';
  private apiUrlReserva = 'http://localhost:3000/api/reservas/';
  private apiUrlPedido = 'http://localhost:3000/api/pedidos/';
  private apiConsultas = 'http://localhost:3000/api/consultas/';

  constructor(private http: HttpClient) { }

  //login cliente
  loginCliente(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'login', { email, password });
  }

  recuperarContrasena(correo: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'recuperar', { correo });
  }

  //crud cli
  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(this.apiUrl + id);
  }

  agregarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.apiUrl + cliente.id, cliente);
  }

  eliminarCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(this.apiUrl + id);
  }
  //metodos de menus
  obtenerMenus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMenu);
  }

  agregarMenu(menu: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMenu, menu);
  }

  actualizarMenu(menu: any): Observable<any> {
    return this.http.put<any>(this.apiUrlMenu + menu.id, menu);
  }

  eliminarMenu(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrlMenu + id);
  }

  //metodos de mesas
  obtenerMesas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlMesa);
  }

  agregarMesa(mesa: any): Observable<any> {
    return this.http.post<any>(this.apiUrlMesa, mesa);
  }

  actualizarMesa(mesa: any): Observable<any> {
    return this.http.put<any>(this.apiUrlMesa + mesa.id, mesa);
  }

  eliminarMesa(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrlMesa + id);
  }

  //reservas
  obtenerReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlReserva);
  }

  agregarReserva(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrlReserva, reserva);
  }

  actualizarReserva(reserva: any): Observable<any> {
    return this.http.put<any>(this.apiUrlReserva + reserva.id, reserva);
  }

  eliminarReserva(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrlReserva + id);
  }

  //pedidos
  obtenerPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlPedido);
  }

  agregarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrlPedido, pedido);
  }

  actualizarPedido(pedido: any): Observable<any> {
    return this.http.put<any>(this.apiUrlPedido + pedido.id, pedido);
  }

  eliminarPedido(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrlPedido + id);
  }
  //consultas
  creservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConsultas + 'reservas');
  }
  cmenus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConsultas + 'menus');
  }
  cgastos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiConsultas + 'gasto');
  }
}
