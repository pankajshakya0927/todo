import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatAccordion } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';

import { Board } from '../models/board';
import { Task, Subtask } from '../models/task';
import { SharedService } from '../services/shared.service';
import { TaskService } from '../services/task.service';
import { ColorPaletteComponent } from '../shared/components/color-palette/color-palette.component';
import { SnackBarComponent } from '../shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  constructor(
    private taskService: TaskService,
    private sharedService: SharedService,
    private bottomSheet: MatBottomSheet,
    private snackbar: SnackBarComponent
  ) {
    this.colorChangeSubscription = this.sharedService.$color.subscribe(
      (paint) => {
        const color = paint as string;
        this.setTaskColor(color);
      }
    );
  }

  @Input() task!: Task;
  @Input() board!: Board;
  @Output() getBoard: EventEmitter<Board> = new EventEmitter();
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  colorChangeSubscription: Subscription = new Subscription();

  subtaskName: string = '';
  selectedTask: Task = {
    name: '',
    dueDate: null,
    priority: 0,
    subtasks: [],
    boardName: '',
    bgColor: '',
  };

  ngOnInit(): void {}

  addSubtask() {
    if (this.subtaskName && this.task) {
      const subtask: Subtask = {
        name: this.subtaskName,
        isCompleted: false,
        taskName: this.task.name,
        boardName: this.task.boardName,
      };
      this.task.subtasks.push(subtask);
      this.saveNewSubtask(subtask);
    }

    this.subtaskName = '';
  }

  saveNewSubtask(subtask: Subtask) {
    this.taskService.saveNewSubtask(subtask).subscribe(
      (res) => {
        const response = res as ApiResponse;
        // this.getBoard.emit();
        this.snackbar.openSnackBar(response.message, 'Close', 'success');
      },
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  markAsComplete(checked: boolean, subtask: Subtask) {
    if (subtask) subtask.isCompleted = checked;
    this.updateSubtask(subtask);
  }

  onDueDateChange() {
    this.updateTask();
  }

  updateTask() {
    this.taskService.updateTask(this.task).subscribe(
      (res) => {
        // this.getBoard.emit();
      },
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  onDeleteTask() {
    if (confirm(`Are you sure you want to delete card "${this.task.name}"?`)) {
      this.taskService.deleteTask(this.task).subscribe(
        (res) => {
          const response = res as ApiResponse;
          this.snackbar.openSnackBar(
            response.message,
            'Close',
            'success'
          );
          this.getBoard.emit();
        },
        (err) => {
          this.snackbar.openSnackBar(err.message, 'Close', 'error');
        }
      );
    }
  }

  updateSubtask(subtask: Subtask) {
    this.taskService.updateSubtask(subtask).subscribe(
      (res) => {
        // this.getBoard.emit();
      },
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  updateBoard() {
    this.taskService.updateBoard(this.board).subscribe(
      (res) => {},
      (err) => {
        this.snackbar.openSnackBar(err.message, 'Close', 'error');
      }
    );
  }

  setTaskColor(color: string) {
    if (color) {
      this.selectedTask.bgColor = color;
      this.updateBoard();
      this.reset();
    }
  }

  openColorPalette(task: Task) {
    this.selectedTask = task;
    this.bottomSheet.open(ColorPaletteComponent);
  }

  reset() {
    this.selectedTask = {
      name: '',
      dueDate: null,
      priority: 0,
      subtasks: [],
      boardName: '',
      bgColor: '',
    };
  }

  onDeleteSubtask(subtask: Subtask) {
    if (confirm(`Are you sure you want to delete "${subtask.name}"?`)) {
      this.taskService.deleteSubtask(subtask).subscribe(
        (res) => {
          const response = res as ApiResponse;
          this.snackbar.openSnackBar(
            response.message,
            'Close',
            'success'
          );
          this.getBoard.emit();
        },
        (err) => {
          this.snackbar.openSnackBar(err.message, 'Close', 'error');
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }
}
