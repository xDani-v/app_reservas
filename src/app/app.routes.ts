import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RegistroComponent } from './components/registro/registro.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { MenusComponent } from './components/menus/menus.component';
import { MesasComponent } from './components/mesas/mesas.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ClienteComponent } from './components/cliente/cliente.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'recuperar',
        component: RecuperarComponent
    },
    {
        path: 'registro',
        component: RegistroComponent

    },
    {
        path: 'home',
        component: PrincipalComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'clientes', component: ClientesComponent },
            { path: 'menus', component: MenusComponent },
            { path: 'mesas', component: MesasComponent },
            { path: 'pedidos', component: PedidosComponent },
            { path: 'reservas', component: ReservasComponent },
        ],
        //canActivate: [authGuard]

    },
    {
        path: 'panel',
        component: ClienteComponent,
        //canActivate: [authGuard]

    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    },

];
