import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterModule, EditComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
