import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ConfirmDialogData = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info';
};

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private stateSubject = new BehaviorSubject<ConfirmDialogData | null>(null);
  state$ = this.stateSubject.asObservable();

  private resolver: ((value: boolean) => void) | null = null;

  open(data: ConfirmDialogData): Promise<boolean> {
    this.stateSubject.next({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      variant: 'warning',
      ...data
    });

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm() {
    if (this.resolver) {
      this.resolver(true);
      this.resolver = null;
    }
    this.stateSubject.next(null);
  }

  cancel() {
    if (this.resolver) {
      this.resolver(false);
      this.resolver = null;
    }
    this.stateSubject.next(null);
  }

  close() {
    this.cancel();
  }
}