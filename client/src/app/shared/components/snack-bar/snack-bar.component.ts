import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent implements OnInit {
  durationInSeconds = 5;

  constructor(public _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [className],
    });
  }

  ngOnInit(): void {}
}
