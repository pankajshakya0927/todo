import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';

import { Board } from '../models/board';
import { Task, Subtask } from '../models/task';
import { SharedService } from '../services/shared.service';
import { TaskService } from '../services/task.service';
import { ColorPaletteComponent } from '../shared/components/color-palette/color-palette.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  constructor(
    private taskService: TaskService,
    private sharedService: SharedService,
    private bottomSheet: MatBottomSheet
  ) {
    this.colorChangeSubscription = this.sharedService.$color.subscribe((paint) => {
      const color = paint as string;
      this.setTaskColor(color);
    });
  }

  @Input() task!: Task;
  @Input() board!: Board;
  @Output() getBoard: EventEmitter<Board> = new EventEmitter();
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
        this.getBoard.emit();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markAsComplete(checked: boolean, subtask: Subtask) {
    if (subtask) subtask.isCompleted = checked;
    this.updateSubtask(subtask);
  }

  updateSubtask(subtask: Subtask) {
    this.taskService.isCompleteSubtask(subtask).subscribe(
      (res) => {
        this.getBoard.emit();
      },
      (err) => {
        console.log(err);
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
        console.log(err);
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

  ngOnDestroy(): void {
    this.colorChangeSubscription.unsubscribe();
  }
}
