import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../../services/datos.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  recordar: boolean = false;

  constructor(private datosService: DatosService, private toast: ToastService, private router: Router) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.email = localStorage.getItem('email') || '';
    this.password = localStorage.getItem('password') || '';
  }

  login() {

    this.datosService.loginCliente(this.email, this.password).subscribe(
      res => {
        console.log(res.cliente);
        if (this.recordar) {
          localStorage.setItem('email', this.email);
          localStorage.setItem('password', this.password)
        }
        localStorage.setItem('token', res.cliente.id);
        localStorage.setItem('cg', res.cliente.tipo);
        if (res.cliente.tipo == 'admin') {
          this.router.navigate(['/home']);
        }
        if (res.cliente.tipo == 'cliente') {
          this.router.navigate(['/panel']);
        }
      },
      err => {
        this.toast.show('danger', 'Error al iniciar sesión');
      }
    );
  }
}
