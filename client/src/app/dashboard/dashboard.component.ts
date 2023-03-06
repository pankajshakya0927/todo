import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { Board } from '../models/board';
import { Task } from '../models/task';
import { SharedService } from '../services/shared.service';
import { TaskService } from '../services/task.service';
import { ColorPaletteComponent } from '../shared/components/color-palette/color-palette.component';
import { SnackBarComponent } from '../shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private taskService: TaskService,
    private activeRoute: ActivatedRoute,
    private sharedService: SharedService,
    private bottomSheet: MatBottomSheet,
    private snackbar: SnackBarComponent
  ) {
    this.colorChangeSubscription = this.sharedService.$color.subscribe(
      (paint) => {
        const color = paint as string;
        this.setBoardColor(color);
      }
    );
  }

  taskName: string = '';
  board: Board = {
    name: '',
    isProtected: false,
    password: '',
    dateCreated: null,
    tasks: [],
    bgColor: '',
  };
  changeBoardColor: boolean = false;
  colorChangeSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    const params = this.activeRoute.snapshot.params;
    if (params && params.name) this.board.name = params.name;

    this.getBoard();
  }

  getBoard() {
    if (this.board) {
      this.taskService.getBoard(this.board).subscribe(
        (res) => {
          this.board = (res as ApiResponse).data as Board;
        },
        (err) => {
          this.snackbar.openSnackBar(err.message, 'Close', 'error');
        }
      );
    }
  }

  addTask() {
    if (!this.taskName) return;

    const task: Task = {
      name: this.taskName,
      dueDate: null,
      priority: 0,
      subtasks: [],
      boardName: this.board.name,
      bgColor: '',
    };
    this.board.tasks.push(task);
    this.saveNewTask(task);
  }

  saveNewTask(task: Task) {
    this.taskService.newTask(task).subscribe(
      (res) => {
        const response = res as ApiResponse;
        this.reset();
        this.getBoard();
        this.snackbar.openSnackBar(response.message, 'Close', 'success');
        
        let el = document.getElementById('footer');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  reset() {
    this.taskName = '';
  }

  drop(event: CdkDragDrop<any>) {
    this.board.tasks[event.previousContainer.data.index] =
      event.container.data.item;
    this.board.tasks[event.container.data.index] =
      event.previousContainer.data.item;

    this.updateBoard();
  }

  updateBoard() {
    this.taskService.updateBoard(this.board).subscribe(
      (res) => {},
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  setBoardColor(color: string) {
    if (this.changeBoardColor) {
      this.board.bgColor = color;
      this.updateBoard();
      this.changeBoardColor = false;
    }
  }

  openColorPalette() {
    this.changeBoardColor = true;
    this.bottomSheet.open(ColorPaletteComponent);
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }
}
