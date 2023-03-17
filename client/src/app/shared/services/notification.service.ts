import { Injectable, NgZone } from '@angular/core';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public snackbar: SnackBarComponent, private zone: NgZone) {}

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.snackbar.openSnackBar(message, 'Close', 'success-snackbar');
    });
  }

  showError(message: string): void {
    this.zone.run(() => {
      this.snackbar.openSnackBar(message, 'Close', 'error-snackbar');
    });
  }
}
