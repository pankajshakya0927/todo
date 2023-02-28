import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from '../models/board';
import { TaskService } from '../services/task.service';
import { SnackBarComponent } from '../shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackbar: SnackBarComponent
  ) {}

  board: Board = {
    name: '',
    isProtected: false,
    password: '',
    dateCreated: new Date(),
    tasks: [],
    bgColor: '',
  };

  ngOnInit(): void {}

  getBoard() {
    if (this.board?.name) {
      this.taskService.getBoard(this.board).subscribe(
        (res) => {
          this.router.navigate([this.board.name]);
        },
        (err) => {
          this.snackbar.openSnackBar(err.message, 'Close', 'error');
        }
      );
    }
  }
}
