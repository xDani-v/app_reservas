import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'info' | 'danger' | 'confirmation';

export interface ToastMessage {
  type: ToastType;
  message: string;
  confirmCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastSubject = new Subject<ToastMessage>();

  show(type: ToastType, message: string, confirmCallback?: () => void) {
    this.toastSubject.next({ type, message, confirmCallback });
  }

}
