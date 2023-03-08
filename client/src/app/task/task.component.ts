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
    isDark: false,
  };

  bgColor: string = '';
  brightness: string = '';
  r: number = 0;
  g: number = 0;
  b: number = 0;
  hsp!: number;

  ngOnInit(): void {
    this.adjustTextColor();
  }

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
          this.snackbar.openSnackBar(response.message, 'Close', 'success');
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
      this.adjustTextColor();
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
      isDark: false
    };
  }

  onDeleteSubtask(subtask: Subtask) {
    if (confirm(`Are you sure you want to delete "${subtask.name}"?`)) {
      this.taskService.deleteSubtask(subtask).subscribe(
        (res) => {
          const response = res as ApiResponse;
          this.snackbar.openSnackBar(response.message, 'Close', 'success');
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

  adjustTextColor() {
    this.bgColor = this.hexToRGB(this.task.bgColor);

    // Call lightOrDark function to get the brightness (light or dark)
    this.brightness = this.lightOrDark(this.bgColor);

    // If the background color is dark, add the light-text class to it
    if (this.brightness == 'dark') {
      this.task.isDark = true;
      // this.element.classList.add('light-text');
    } else {
      this.task.isDark = false;
      // this.element.classList.add('dark-text');
    }
  }

  lightOrDark(color: any) {
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
      );

      this.r = color[1];
      this.g = color[2];
      this.b = color[3];
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +(
        '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
      );

      this.r = color >> 16;
      this.g = (color >> 8) & 255;
      this.b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    this.hsp = Math.sqrt(
      0.299 * (this.r * this.r) +
        0.587 * (this.g * this.g) +
        0.114 * (this.b * this.b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (this.hsp > 127.5) {
      return 'light';
    } else {
      return 'dark';
    }
  }

  hexToRGB(h: any) {
    let r: number | string = 0;
    let b: number | string = 0;
    let g: number | string = 0;
  
    // 3 digits
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
  
    // 6 digits
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    }
    
    return "rgb("+ +r + "," + +g + "," + +b + ")";
  }
}
