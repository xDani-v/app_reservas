import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RegistroComponent } from './components/registro/registro.component';

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

    },
    {
        path: '**',
        component: LoginComponent
    },

];
