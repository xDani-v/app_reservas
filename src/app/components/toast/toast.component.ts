import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {

  message: string | null = '';
  type: string | null = '';
  confirmCallback?: () => void = () => { };
  subscription: Subscription | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.subscription = this.toastService.toastSubject.subscribe(({ type, message, confirmCallback }) => {
      this.type = type;
      this.message = message;
      this.confirmCallback = confirmCallback;
      if (type !== 'confirmation') {
        setTimeout(() => this.message = null, 2000);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.message = null;
    this.type = null;
  }

  onCancel() {
    this.message = null;
    this.type = null;
  }

  getToastClass() {
    return this.type === 'confirmation' ? 'toast-confirmation' : 'toast-alert';
  }

}
